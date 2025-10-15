export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "pix" | "credit" | "debit" | "cash";
