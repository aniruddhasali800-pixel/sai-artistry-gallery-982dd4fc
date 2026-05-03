-- Table for 3D-only paintings (separate from regular inventory)
CREATE TABLE public.paintings_3d (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.paintings_3d ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view 3d paintings" ON public.paintings_3d FOR SELECT USING (true);
CREATE POLICY "Anyone can insert 3d paintings" ON public.paintings_3d FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update 3d paintings" ON public.paintings_3d FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete 3d paintings" ON public.paintings_3d FOR DELETE USING (true);

CREATE TRIGGER update_paintings_3d_updated_at
BEFORE UPDATE ON public.paintings_3d
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for 3D-only painting images
INSERT INTO storage.buckets (id, name, public) VALUES ('paintings-3d', 'paintings-3d', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read 3d paintings" ON storage.objects FOR SELECT USING (bucket_id = 'paintings-3d');
CREATE POLICY "Public upload 3d paintings" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'paintings-3d');
CREATE POLICY "Public update 3d paintings" ON storage.objects FOR UPDATE USING (bucket_id = 'paintings-3d');
CREATE POLICY "Public delete 3d paintings" ON storage.objects FOR DELETE USING (bucket_id = 'paintings-3d');