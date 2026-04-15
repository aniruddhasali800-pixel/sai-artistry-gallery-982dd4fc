
-- Create site_content table for dynamic page content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can insert site content" ON public.site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update site content" ON public.site_content FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete site content" ON public.site_content FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default about page content
INSERT INTO public.site_content (section, key, value) VALUES
  ('about', 'artist_name', 'Sai'),
  ('about', 'page_title', 'The Story of Sai'),
  ('about', 'heading', 'A Journey Through Color & Canvas'),
  ('about', 'paragraph_1', 'Born and raised in the vibrant artistic traditions of India, Sai discovered his passion for painting at the young age of eight. What began as simple sketches on the margins of school notebooks evolved into a lifelong dedication to the art of painting.'),
  ('about', 'paragraph_2', 'After training at prestigious art academies, Sai developed a unique style that bridges classical Indian art traditions with contemporary global expressions. His work explores themes of nature, mythology, human emotion, and the cosmic dance of creation.'),
  ('about', 'paragraph_3', 'Each painting undergoes weeks, sometimes months, of meticulous craftsmanship. From preparing the canvas with traditional gesso to layering oils with palette knives and fine brushes, every step is a meditation in excellence.'),
  ('about', 'paragraph_4', 'Today, Sai''s works grace private collections across India, the Middle East, Europe, and North America. His art has been featured in numerous exhibitions and has won acclaim from critics and collectors alike.'),
  ('about', 'quote', 'Every painting is a conversation between my soul and the canvas. I paint not just what I see, but what I feel — the invisible threads that connect us all.'),
  ('about', 'stat_paintings', '500+'),
  ('about', 'stat_awards', '25'),
  ('about', 'stat_experience', '20+'),
  ('about', 'stat_collectors', '300+'),
  ('contact', 'email', 'contact@saliarts.com'),
  ('contact', 'phone', '+91 98765 43210'),
  ('contact', 'location', 'Mumbai, India'),
  ('footer', 'description', 'Exclusive handcrafted paintings that transform spaces into galleries. Each piece is unique, original, and crafted with passion.');
