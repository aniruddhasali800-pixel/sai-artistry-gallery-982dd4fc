import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  id: string;
  section: string;
  key: string;
  value: string;
  image_url: string | null;
};

export const useSiteContent = (section?: string) => {
  return useQuery({
    queryKey: ["site_content", section],
    queryFn: async () => {
      let query = supabase.from("site_content").select("*");
      if (section) query = query.eq("section", section);
      const { data, error } = await query;
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

export const useContentValue = (section: string, key: string) => {
  const { data } = useSiteContent(section);
  const item = data?.find((d) => d.key === key);
  return { value: item?.value ?? "", image_url: item?.image_url ?? null };
};

export const useContentMap = (section: string) => {
  const { data, isLoading } = useSiteContent(section);
  const map: Record<string, { value: string; image_url: string | null }> = {};
  data?.forEach((item) => {
    map[item.key] = { value: item.value, image_url: item.image_url };
  });
  return { content: map, isLoading };
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ section, key, value, image_url }: { section: string; key: string; value: string; image_url?: string | null }) => {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("section", section)
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const updateData: { value: string; image_url?: string | null } = { value };
        if (image_url !== undefined) updateData.image_url = image_url;
        const { error } = await supabase.from("site_content").update(updateData).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_content").insert({ section, key, value, image_url: image_url ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
    },
  });
};
