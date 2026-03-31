
-- Create paintings table for inventory
CREATE TABLE public.paintings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Abstract',
  dimensions TEXT NOT NULL DEFAULT '',
  medium TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  sold BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.paintings ENABLE ROW LEVEL SECURITY;

-- Anyone can view paintings
CREATE POLICY "Anyone can view paintings" ON public.paintings FOR SELECT USING (true);

-- Public insert/update/delete for admin (no auth yet)
CREATE POLICY "Anyone can insert paintings" ON public.paintings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update paintings" ON public.paintings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete paintings" ON public.paintings FOR DELETE USING (true);

-- Also allow updates on orders (for approve/reject)
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

-- Storage bucket for painting images
INSERT INTO storage.buckets (id, name, public) VALUES ('painting-images', 'painting-images', true);

CREATE POLICY "Anyone can upload painting images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'painting-images');
CREATE POLICY "Public read painting images" ON storage.objects FOR SELECT USING (bucket_id = 'painting-images');

-- Trigger for updated_at
CREATE TRIGGER update_paintings_updated_at
  BEFORE UPDATE ON public.paintings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
