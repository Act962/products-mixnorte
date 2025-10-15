import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useState } from "react";
import useShoppingCart from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useShoppingCart();
  const productInCart = !!cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 animate-fade-in bg-gradient-card border-border">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            R$ {product.price.toFixed(2)}
          </p>
          <span className="text-xs text-muted-foreground">{product.unit}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={productInCart}
        >
          {productInCart ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
