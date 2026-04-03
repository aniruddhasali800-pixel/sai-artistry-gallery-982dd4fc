
-- Create media table for multiple images/videos per upcoming project
CREATE TABLE public.upcoming_project_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.upcoming_projects(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.upcoming_project_media ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view media" ON public.upcoming_project_media FOR SELECT USING (true);
CREATE POLICY "Anyone can insert media" ON public.upcoming_project_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update media" ON public.upcoming_project_media FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete media" ON public.upcoming_project_media FOR DELETE USING (true);

-- Create storage bucket for upcoming media
INSERT INTO storage.buckets (id, name, public) VALUES ('upcoming-media', 'upcoming-media', true);

CREATE POLICY "Anyone can view upcoming media" ON storage.objects FOR SELECT USING (bucket_id = 'upcoming-media');
CREATE POLICY "Anyone can upload upcoming media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'upcoming-media');
CREATE POLICY "Anyone can delete upcoming media" ON storage.objects FOR DELETE USING (bucket_id = 'upcoming-media');
