import { Product } from "@/types/product";
import acaiBowl from "@/assets/acai-bowl.jpg";
import acaiPulp from "@/assets/acai-pulp.jpg";
import acaiSmoothie from "@/assets/acai-smoothie.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Açaí Bowl Tradicional",
    description: "Bowl de açaí puro com granola, banana e mel",
    price: 15.9,
    image: acaiBowl,
    category: "Bowls",
  },
  {
    id: "2",
    name: "Açaí Bowl Premium",
    description:
      "Bowl de açaí com frutas especiais, granola artesanal e nutella",
    price: 22.9,
    image: acaiBowl,
    category: "Bowls",
  },
  {
    id: "3",
    name: "Polpa de Açaí 1kg",
    description: "Polpa de açaí pura e natural, pronta para consumo",
    price: 35.0,
    image: acaiPulp,
    category: "Polpas",
  },
  {
    id: "4",
    name: "Polpa de Açaí 5kg",
    description: "Polpa de açaí em embalagem econômica",
    price: 150.0,
    image: acaiPulp,
    category: "Polpas",
  },
  {
    id: "5",
    name: "Smoothie de Açaí",
    description: "Smoothie cremoso de açaí com morango",
    price: 18.9,
    image: acaiSmoothie,
    category: "Bebidas",
  },
  {
    id: "6",
    name: "Açaí Bowl Fitness",
    description:
      "Bowl de açaí com whey protein, frutas vermelhas e granola sem açúcar",
    price: 25.9,
    image: acaiBowl,
    category: "Bowls",
  },
  {
    id: "7",
    name: "Polpa de Açaí 500g",
    description: "Polpa de açaí ideal para consumo individual",
    price: 18.0,
    image: acaiPulp,
    category: "Polpas",
  },
  {
    id: "8",
    name: "Smoothie Tropical",
    description: "Smoothie de açaí com manga e abacaxi",
    price: 19.9,
    image: acaiSmoothie,
    category: "Bebidas",
  },
];

export const categories = ["Todos", "Bowls", "Polpas", "Bebidas"];
