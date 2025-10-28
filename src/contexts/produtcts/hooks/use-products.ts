import { client } from "@/lib/sanity";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const PRODUCTS_QUERY = `*[_type == 'product'] {
  "id": _id,
  name,
  description,
  price,
  image,
  unit,
  "category": category->title,
  createdAt
}`;

export async function fetchProducts() {
  try {
    const products = await client.fetch<Product[]>(PRODUCTS_QUERY);
    console.log("produtos carregados", products);

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.log("Erro ao buscar produtos:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao carregar produtos"
    );
  }
}

export default function useProducts() {
  const { data, isLoading, error, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: [],
    // staleTime: 1000 * 60 * 5,
    // retry: 2,
    // refetchOnWindowFocus: false,
  });

  return {
    items: data ?? [],
    isLoading,
    error,
    isError,
  };
}
