import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import fs from "fs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate + "T23:59:59");
      }
    }

    const sales = (await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as Array<{
      user: any;
      receiptNumber: string;
      createdAt: Date | string;
      cashier?: { name: string | null } | null;
      items: Array<{
        product: { name: string };
        quantity: number;
        priceAtSale: number;
      }>;
      total: number;
      paymentMethod: string;
    }>;

    // Build CSV content
    const headers = [
      "No. Struk",
      "Tanggal",
      "Kasir",
      "Produk",
      "Qty",
      "Harga Satuan",
      "Subtotal",
      "Total Transaksi",
      "Metode Pembayaran",
    ];

    const paymentMethodLabels: Record<string, string> = {
      CASH: "Tunai",
      DEBIT: "Debit",
      CREDIT: "Kredit",
      QRIS: "QRIS",
      TRANSFER: "Transfer",
    };

    const rows: string[][] = [];

    sales.forEach((sale) => {
      sale.items.forEach((item, index) => {
        rows.push([
          index === 0 ? sale.receiptNumber : "",
          index === 0
            ? format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm", {
                locale: id,
              })
            : "",
          index === 0 ? sale.user?.name || "-" : "",
          item.product.name,
          item.quantity.toString(),
          item.priceAtSale.toString(),
          (item.quantity * item.priceAtSale).toString(),
          index === 0 ? sale.total.toString() : "",
          index === 0 ? paymentMethodLabels[sale.paymentMethod] : "",
        ]);
      });
    });

    // Convert to CSV string
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Add BOM for Excel compatibility
    const bom = "\ufeff";
    const csvWithBom = bom + csvContent;

    const filename = `laporan-penjualan-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting CSV:", error);
    try {
      fs.appendFileSync(
        "export-error.log",
        `[${new Date().toISOString()}] CSV ERROR: ${error?.stack || error}\n`,
        "utf8"
      );
    } catch (fsErr) {
      console.error("Failed writing export-error.log:", fsErr);
    }
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
