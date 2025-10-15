import { MapPin, Phone, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ selectedCategory, onCategoryChange, sortBy, onSortChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 lg:w-64 bg-card rounded-none lg:rounded-lg border-r lg:border border-border p-6 
        h-screen lg:h-fit lg:sticky lg:top-20 shadow-card
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
      <div className="space-y-6">
        {/* Botão de fechar (visível apenas em mobile) */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <h2 className="text-xl font-bold">Filtros</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Categorias</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-lg mb-3">Ordenar por</h3>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Contato</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Rua das Palmeiras, 123<br />
                Belém - PA, 66000-000
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">(91) 98765-4321</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">contato@mixnorte.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
