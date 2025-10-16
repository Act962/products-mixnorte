import { client } from "@/lib/sanity";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

type Category = {
  title: string;
};

const CATEGORY_QUERY = `*[_type == 'category']|order(order asc){
  title
}`;

export async function fetchCategory() {
  try {
    const categorys = await client.fetch(CATEGORY_QUERY);
    console.log(categorys);
    return categorys;
  } catch (error) {
    console.log(error);
  }
}

export default function useCategorys() {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ["categorys"],
    queryFn: async () => await fetchCategory(),
    initialData: [],
  });

  return {
    categories: data,
    categoryLoading: isLoading,
  };
}
