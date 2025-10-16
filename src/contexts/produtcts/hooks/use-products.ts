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
    const products = await client.fetch(PRODUCTS_QUERY);
    console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

export default function useProducts() {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => await fetchProducts(),
    initialData: [],
  });

  return {
    items: data,
    isLoading,
  };
}
