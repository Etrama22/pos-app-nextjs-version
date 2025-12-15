import type { Sale, SaleItem, PaymentMethod } from "@prisma/client";

export interface SaleEntity extends Sale {
  items: SaleItemEntity[];
}

export interface SaleItemEntity extends SaleItem {
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

export interface SaleWithDetails extends Sale {
  items: (SaleItem & {
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  })[];
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}
