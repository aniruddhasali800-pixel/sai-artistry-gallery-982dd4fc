import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Painting {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  dimensions: string;
  medium: string;
  year: number;
  sold: boolean;
}

const fetchPaintings = async (): Promise<Painting[]> => {
  const { data, error } = await supabase
    .from("paintings")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.original_price,
    image: p.image_url,
    category: p.category,
    dimensions: p.dimensions,
    medium: p.medium,
    year: p.year,
    sold: p.sold,
  }));
};

export const usePaintings = () => {
  return useQuery({
    queryKey: ["paintings"],
    queryFn: fetchPaintings,
  });
};
