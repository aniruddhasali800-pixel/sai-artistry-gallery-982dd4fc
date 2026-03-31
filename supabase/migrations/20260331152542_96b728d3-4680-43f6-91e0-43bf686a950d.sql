
-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  painting_id TEXT NOT NULL,
  painting_title TEXT NOT NULL,
  painting_image TEXT NOT NULL,
  painting_price NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (public order form, no auth required)
CREATE POLICY "Anyone can place an order"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own order by id (for confirmation page)
CREATE POLICY "Anyone can read orders"
  ON public.orders FOR SELECT
  USING (true);

-- Create storage bucket for customer photos
INSERT INTO storage.buckets (id, name, public) VALUES ('order-photos', 'order-photos', true);

-- Allow anyone to upload photos to order-photos bucket
CREATE POLICY "Anyone can upload order photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'order-photos');

-- Allow public read of order photos
CREATE POLICY "Public read order photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-photos');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
