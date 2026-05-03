import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Painting3DItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const usePaintings3D = () => {
  return useQuery({
    queryKey: ["paintings_3d"],
    queryFn: async (): Promise<Painting3DItem[]> => {
      const { data, error } = await supabase
        .from("paintings_3d" as never)
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data as unknown as Array<{ id: string; title: string; description: string; image_url: string }>) ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image_url,
      }));
    },
  });
};
