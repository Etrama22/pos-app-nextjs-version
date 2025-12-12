import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import fs from "fs";

// Simple PDF generator without external dependencies
function generatePDF(sales: any[], summary: any, dateRange: string): Buffer {
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const paymentMethodLabels: Record<string, string> = {
    CASH: "Tunai",
    DEBIT: "Debit",
    CREDIT: "Kredit",
    QRIS: "QRIS",
    TRANSFER: "Transfer",
  };

  // Build PDF content using a simple text-based format
  // This creates a basic PDF structure
  let content = "";

  content += "========================================\n";
  content += "         LAPORAN PENJUALAN POS\n";
  content += "========================================\n\n";
  content += `Periode: ${dateRange}\n`;
  content += `Dicetak: ${format(new Date(), "dd MMMM yyyy HH:mm", {
    locale: id,
  })}\n\n`;

  content += "----------------------------------------\n";
  content += "              RINGKASAN\n";
  content += "----------------------------------------\n";
  content += `Total Transaksi    : ${summary.totalSales}\n`;
  content += `Total Pendapatan   : ${formatCurrency(summary.totalRevenue)}\n`;
  content += `Rata-rata Transaksi: ${formatCurrency(
    summary.averageTransaction
  )}\n\n`;

  content += "----------------------------------------\n";
  content += "           DETAIL TRANSAKSI\n";
  content += "----------------------------------------\n\n";

  sales.forEach((sale, idx) => {
    content += `[${idx + 1}] ${sale.receiptNumber}\n`;
    content += `    Tanggal : ${format(
      new Date(sale.createdAt),
      "dd/MM/yyyy HH:mm",
      { locale: id }
    )}\n`;
    content += `    Kasir   : ${sale.user?.name || "-"}\n`;
    content += `    Items   :\n`;

    sale.items.forEach((item: any) => {
      const subtotal = item.quantity * item.priceAtSale;
      content += `      - ${item.product.name}\n`;
      content += `        ${item.quantity} x ${formatCurrency(
        item.priceAtSale
      )} = ${formatCurrency(subtotal)}\n`;
    });

    content += `    Pembayaran: ${paymentMethodLabels[sale.paymentMethod]}\n`;
    content += `    Total     : ${formatCurrency(sale.total)}\n`;
    content += "\n";
  });

  content += "========================================\n";
  content += "              END OF REPORT\n";
  content += "========================================\n";

  // Create a simple PDF
  const pdfContent = createSimplePDF(content);
  return Buffer.from(pdfContent);
}

function createSimplePDF(text: string): string {
  const lines = text.split("\n");
  const pageHeight = 842;
  const pageWidth = 595;
  const margin = 50;
  const lineHeight = 12;
  const fontSize = 10;

  let y = pageHeight - margin;
  let pageContent = "";

  lines.forEach((line) => {
    if (y < margin) {
      y = pageHeight - margin;
    }

    // Escape special PDF characters
    const escapedLine = line
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");

    pageContent += `BT /F1 ${fontSize} Tf ${margin} ${y} Td (${escapedLine}) Tj ET\n`;
    y -= lineHeight;
  });

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length ${pageContent.length} >>
stream
${pageContent}
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000${(366 + pageContent.length).toString().padStart(3, "0")} 00000 n 

trailer
<< /Size 6 /Root 1 0 R >>
startxref
${420 + pageContent.length}
%%EOF`;

  return pdf;
}

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

    const sales = await prisma.sale.findMany({
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
    });

    // Calculate summary
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const averageTransaction = totalSales > 0 ? totalRevenue / totalSales : 0;

    const summary = {
      totalSales,
      totalRevenue,
      averageTransaction,
    };

    // Date range string
    let dateRange = "Semua waktu";
    if (startDate && endDate) {
      dateRange = `${format(new Date(startDate), "dd MMM yyyy", {
        locale: id,
      })} - ${format(new Date(endDate), "dd MMM yyyy", { locale: id })}`;
    } else if (startDate) {
      dateRange = `Dari ${format(new Date(startDate), "dd MMM yyyy", {
        locale: id,
      })}`;
    } else if (endDate) {
      dateRange = `Sampai ${format(new Date(endDate), "dd MMM yyyy", {
        locale: id,
      })}`;
    }

    const pdfBuffer = generatePDF(sales, summary, dateRange);
    const filename = `laporan-penjualan-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting PDF:", error);
    try {
      fs.appendFileSync(
        "export-error.log",
        `[${new Date().toISOString()}] PDF ERROR: ${error?.stack || error}\n`,
        "utf8"
      );
    } catch (fsErr) {
      console.error("Failed writing export-error.log:", fsErr);
    }
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
