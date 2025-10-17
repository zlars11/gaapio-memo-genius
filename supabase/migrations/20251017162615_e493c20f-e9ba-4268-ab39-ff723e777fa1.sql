-- Create customer_testimonials table
CREATE TABLE public.customer_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  customer_name TEXT NOT NULL,
  customer_title TEXT NOT NULL,
  highlight_words TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_testimonials ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-testimonials', 'customer-testimonials', true);

-- RLS Policies for customer_testimonials table
CREATE POLICY "Anyone can view active testimonials"
ON public.customer_testimonials
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all testimonials"
ON public.customer_testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for storage bucket
CREATE POLICY "Anyone can view testimonial avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'customer-testimonials');

CREATE POLICY "Admins can upload testimonial avatars"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'customer-testimonials' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonial avatars"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'customer-testimonials' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonial avatars"
ON storage.objects
FOR DELETE
USING (bucket_id = 'customer-testimonials' AND has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_customer_testimonials_updated_at
BEFORE UPDATE ON public.customer_testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing hardcoded testimonials
INSERT INTO public.customer_testimonials (quote, avatar_url, customer_name, customer_title, highlight_words, display_order, is_active)
VALUES 
  (
    'As a Controller, I need to ensure our disclosures are accurate and complete. This tool has become indispensable in our quarterly close process.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    'James Mitchell',
    'Controller, Tech Innovations Inc.',
    ARRAY['accurate', 'complete', 'indispensable'],
    0,
    true
  ),
  (
    'The guidance update feature alone is worth it. We never miss important changes anymore, and our audit prep time has been cut in half.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'Sarah Chen',
    'VP Finance, Growth Capital Partners',
    ARRAY['never miss', 'cut in half'],
    1,
    true
  ),
  (
    'Finally, a solution that understands the complexity of footnote disclosures. The AI suggestions are remarkably accurate and save us countless hours.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'Michael Rodriguez',
    'CFO, Precision Manufacturing',
    ARRAY['remarkably accurate', 'countless hours'],
    2,
    true
  );