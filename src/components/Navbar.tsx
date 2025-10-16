import { ShoppingCart, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import useShoppingCart from "@/hooks/use-cart";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const navigate = useNavigate();
  const { cartItems } = useShoppingCart();

  const cardItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-card ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo do Mix Açaí" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
            Mix Norte
          </h1>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            onClick={() => navigate("/register")}
          >
            <User className="h-4 w-4 mr-2" />
            Cadastrar
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cardItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                {cardItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
