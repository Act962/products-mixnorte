import useLocalStorage from "use-local-storage";
import { Product } from "@/types/product";

const CART_KEY = "@cart_products";

export type CartItem = Product & {
  cartId: string;
  quantity: number;
};

export default function useShoppingCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(CART_KEY, []);

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          cartId: Math.random().toString(36).substring(2, 9),
          quantity,
        },
      ]);
    }
  }

  function removeFromCart(cartId: string) {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
  }

  function updateQuantity(cartId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const itemsCount = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsCount,
    totalQuantity,
    subtotal,
    tax,
    total,
  };
}
