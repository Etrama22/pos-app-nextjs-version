"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, calculateTax } from "@/lib/utils";
import { paymentMethods } from "@/lib/config";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

export default function PosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("CASH");
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  React.useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await fetch(`/api/products/active?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast("warning", "Stok tidak mencukupi");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;

      if (quantity <= 0) {
        return prev.filter((i) => i.id !== productId);
      }

      if (quantity > item.stock) {
        showToast("warning", "Stok tidak mencukupi");
        return prev;
      }

      return prev.map((i) => (i.id === productId ? { ...i, quantity } : i));
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + tax;
  const change = paymentAmount ? parseFloat(paymentAmount) - total : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("warning", "Keranjang masih kosong");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) < total) {
      showToast("warning", "Jumlah pembayaran kurang");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtSale: item.price,
          })),
          discount,
          tax,
          paymentMethod,
          paymentAmount: parseFloat(paymentAmount),
        }),
      });

      if (res.ok) {
        const sale = await res.json();
        showToast("success", `Transaksi berhasil! No: ${sale.receiptNumber}`);
        clearCart();
        setDiscount(0);
        setPaymentAmount("");
        setIsCheckoutOpen(false);
        fetchProducts();
      } else {
        const error = await res.json();
        showToast("error", error.error || "Transaksi gagal");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Point of Sale
        </h1>
        <p className="text-secondary-600">Kelola transaksi penjualan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="py-0 px-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 shadow-none focus:ring-0"
                />
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-secondary-100 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="w-12 h-12 text-secondary-400" />
                    </div>
                  )}
                  <h3 className="font-medium text-sm text-secondary-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-2">
                    {formatCurrency(product.price)}
                  </p>
                  <Badge variant={product.stock > 10 ? "success" : "warning"}>
                    Stok: {product.stock}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-500">Tidak ada produk ditemukan</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Keranjang ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-secondary-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-secondary-500">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded hover:bg-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded hover:bg-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-secondary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-500">Keranjang kosong</p>
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Diskon</span>
                      <span className="font-medium">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Pajak (11%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Bayar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Bersihkan
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Checkout"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Diskon"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />

          <Select
            label="Metode Pembayaran"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={paymentMethods.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
          />

          <Input
            label="Jumlah Bayar"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="0"
          />

          <div className="bg-secondary-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary-600">Total</span>
              <span className="font-bold text-lg text-primary-600">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {paymentAmount && parseFloat(paymentAmount) >= total && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-green-700">Kembalian</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(change)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCheckout}
              isLoading={isProcessing}
              disabled={isProcessing}
            >
              Proses Pembayaran
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
