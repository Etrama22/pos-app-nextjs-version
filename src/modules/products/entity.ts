import type { Product } from "@prisma/client";

export interface ProductEntity extends Product {}

export interface ProductWithSales extends Product {
  saleItems: {
    quantity: number;
    subtotal: number;
  }[];
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
}
