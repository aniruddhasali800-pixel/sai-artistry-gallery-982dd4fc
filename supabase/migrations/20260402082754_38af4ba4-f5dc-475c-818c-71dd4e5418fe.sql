
CREATE TABLE public.upcoming_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned',
  video_url TEXT,
  thumbnail_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upcoming projects" ON public.upcoming_projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert upcoming projects" ON public.upcoming_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update upcoming projects" ON public.upcoming_projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete upcoming projects" ON public.upcoming_projects FOR DELETE USING (true);

CREATE TRIGGER update_upcoming_projects_updated_at
  BEFORE UPDATE ON public.upcoming_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
