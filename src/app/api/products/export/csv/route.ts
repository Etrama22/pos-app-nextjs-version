import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Build CSV content
    const headers = [
      "ID",
      "Nama Produk",
      "Deskripsi",
      "Harga",
      "Stok",
      "Kategori",
      "Barcode",
      "Status",
      "Tanggal Dibuat",
      "Terakhir Update",
    ];

    const rows = products.map((product) => [
      product.id,
      product.name,
      product.description || "",
      product.price.toString(),
      product.stock.toString(),
      product.category || "",
      product.barcode || "",
      product.isActive ? "Aktif" : "Tidak Aktif",
      format(new Date(product.createdAt), "dd/MM/yyyy HH:mm"),
      format(new Date(product.updatedAt), "dd/MM/yyyy HH:mm"),
    ]);

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

    const filename = `daftar-produk-${format(new Date(), "yyyy-MM-dd")}.csv`;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting products CSV:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
