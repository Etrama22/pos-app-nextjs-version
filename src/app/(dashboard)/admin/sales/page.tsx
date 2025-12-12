"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Search,
  Eye,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { PaymentMethod } from "@prisma/client";

interface Sale {
  id: string;
  receiptNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtSale: number;
    product: {
      name: string;
    };
  }[];
}

interface Summary {
  totalSales: number;
  totalRevenue: number;
  averageTransaction: number;
}

export default function SalesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sales, setSales] = React.useState<Sale[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/pos");
    }
  }, [status, session, router]);

  React.useEffect(() => {
    fetchSales();
    fetchSummary();
  }, [page, startDate, endDate]);

  const fetchSales = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/sales?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSales(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/sales/summary?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: "Tunai",
    DEBIT: "Debit",
    CREDIT: "Kredit",
    QRIS: "QRIS",
    TRANSFER: "Transfer",
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/sales/export/csv?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-penjualan-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/sales/export/pdf?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-penjualan-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Riwayat Penjualan
          </h1>
          <p className="text-secondary-600">Laporan transaksi penjualan</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">
                    Total Transaksi
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {summary.totalSales}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">
                    Total Pendapatan
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatCurrency(summary.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600 mb-1">
                    Rata-rata Transaksi
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatCurrency(summary.averageTransaction)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-secondary-400" />
              <Input
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 shadow-none focus:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Struk</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.receiptNumber}
                  </TableCell>
                  <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                  <TableCell className="font-semibold text-primary-600">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">
                      {paymentMethodLabels[sale.paymentMethod]}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.items.length} items</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sales.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">Tidak ada transaksi</p>
            </div>
          )}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {page} of {Math.ceil(total / 10)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 10)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title="Detail Transaksi"
        size="lg"
      >
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-lg">
              <div>
                <p className="text-xs text-secondary-600">No. Struk</p>
                <p className="font-medium">{selectedSale.receiptNumber}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600">Tanggal</p>
                <p className="font-medium">
                  {formatDateTime(selectedSale.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-600">Pembayaran</p>
                <p className="font-medium">
                  {paymentMethodLabels[selectedSale.paymentMethod]}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-600">Total</p>
                <p className="font-bold text-primary-600">
                  {formatCurrency(selectedSale.total)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-2">
                {selectedSale.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-secondary-600">
                        {item.quantity} x {formatCurrency(item.priceAtSale)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.quantity * item.priceAtSale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
