import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { CartItem, Product } from "@/types/product";
import { toast } from "sonner";
import acaiHero from "@/assets/acai-hero.jpg";

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("name");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success(`${product.name} atualizado no carrinho!`);
    } else {
      setCart([...cart, { ...product, quantity }]);
      toast.success(`${product.name} adicionado ao carrinho!`);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Navbar onSearch={setSearchQuery} />

      <div
        className="h-64 bg-cover bg-center flex items-center justify-center mt-16"
        style={{ backgroundImage: `url(${acaiHero})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm px-8 py-6 rounded-lg shadow-elegant">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            O melhor açaí da região!
          </h2>
          <p className="text-muted-foreground mt-2">
            Produtos frescos e de qualidade direto do Norte
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "Todos"
                    ? "Todos os produtos"
                    : selectedCategory}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} produto(s) encontrado(s)
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(true)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
