import { Product } from "@/types/product";
import { create } from "zustand";

type CartStore = {
  products: Product[];
  addProduct: (product: Product) => void;
  getAllProducts: () => Promise<void>;
};

export const useCartStore = create<CartStore>()((set, get) => ({
  products: [],
  addProduct: (product: Product) => {
    const { products } = get();
    set({ products: [...products, product] });
  },
  async getAllProducts() {},
}));
