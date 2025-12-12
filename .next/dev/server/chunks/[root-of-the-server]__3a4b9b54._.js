module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/app/api/sales/export/pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/id.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
;
;
// Simple PDF generator without external dependencies
function generatePDF(sales, summary, dateRange) {
    const formatCurrency = (num)=>new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(num);
    const paymentMethodLabels = {
        CASH: "Tunai",
        DEBIT: "Debit",
        CREDIT: "Kredit",
        QRIS: "QRIS",
        TRANSFER: "Transfer"
    };
    // Build PDF content using a simple text-based format
    // This creates a basic PDF structure
    let content = "";
    content += "========================================\n";
    content += "         LAPORAN PENJUALAN POS\n";
    content += "========================================\n\n";
    content += `Periode: ${dateRange}\n`;
    content += `Dicetak: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "dd MMMM yyyy HH:mm", {
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
    })}\n\n`;
    content += "----------------------------------------\n";
    content += "              RINGKASAN\n";
    content += "----------------------------------------\n";
    content += `Total Transaksi    : ${summary.totalSales}\n`;
    content += `Total Pendapatan   : ${formatCurrency(summary.totalRevenue)}\n`;
    content += `Rata-rata Transaksi: ${formatCurrency(summary.averageTransaction)}\n\n`;
    content += "----------------------------------------\n";
    content += "           DETAIL TRANSAKSI\n";
    content += "----------------------------------------\n\n";
    sales.forEach((sale, idx)=>{
        content += `[${idx + 1}] ${sale.receiptNumber}\n`;
        content += `    Tanggal : ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(sale.createdAt), "dd/MM/yyyy HH:mm", {
            locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
        })}\n`;
        content += `    Kasir   : ${sale.user?.name || "-"}\n`;
        content += `    Items   :\n`;
        sale.items.forEach((item)=>{
            const subtotal = item.quantity * item.priceAtSale;
            content += `      - ${item.product.name}\n`;
            content += `        ${item.quantity} x ${formatCurrency(item.priceAtSale)} = ${formatCurrency(subtotal)}\n`;
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
function createSimplePDF(text) {
    const lines = text.split("\n");
    const pageHeight = 842;
    const pageWidth = 595;
    const margin = 50;
    const lineHeight = 12;
    const fontSize = 10;
    let y = pageHeight - margin;
    let pageContent = "";
    lines.forEach((line)=>{
        if (y < margin) {
            y = pageHeight - margin;
        }
        // Escape special PDF characters
        const escapedLine = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
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
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate + "T23:59:59");
            }
        }
        const sales = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        // Calculate summary
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale)=>sum + sale.total, 0);
        const averageTransaction = totalSales > 0 ? totalRevenue / totalSales : 0;
        const summary = {
            totalSales,
            totalRevenue,
            averageTransaction
        };
        // Date range string
        let dateRange = "Semua waktu";
        if (startDate && endDate) {
            dateRange = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(startDate), "dd MMM yyyy", {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
            })} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(endDate), "dd MMM yyyy", {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
            })}`;
        } else if (startDate) {
            dateRange = `Dari ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(startDate), "dd MMM yyyy", {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
            })}`;
        } else if (endDate) {
            dateRange = `Sampai ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(endDate), "dd MMM yyyy", {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"]
            })}`;
        }
        const pdfBuffer = generatePDF(sales, summary, dateRange);
        const filename = `laporan-penjualan-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "yyyy-MM-dd")}.pdf`;
        // Convert Buffer to Uint8Array for NextResponse
        const pdfUint8Array = new Uint8Array(pdfBuffer);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](pdfUint8Array, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        });
    } catch (error) {
        console.error("Error exporting PDF:", error);
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].appendFileSync("export-error.log", `[${new Date().toISOString()}] PDF ERROR: ${error?.stack || error}\n`, "utf8");
        } catch (fsErr) {
            console.error("Failed writing export-error.log:", fsErr);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to export PDF"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a4b9b54._.js.map