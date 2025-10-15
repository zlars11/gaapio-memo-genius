-- Create customer_logos table
CREATE TABLE public.customer_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_logos ENABLE ROW LEVEL SECURITY;

-- Public can view active logos
CREATE POLICY "Anyone can view active logos"
  ON public.customer_logos FOR SELECT
  USING (is_active = true);

-- Admins can manage all logos
CREATE POLICY "Admins can manage all logos"
  ON public.customer_logos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_customer_logos_updated_at
  BEFORE UPDATE ON public.customer_logos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for customer logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-logos', 'customer-logos', true);

-- Storage RLS policies
CREATE POLICY "Anyone can view customer logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'customer-logos');

CREATE POLICY "Admins can upload customer logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'customer-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update customer logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'customer-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete customer logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'customer-logos' AND has_role(auth.uid(), 'admin'::app_role));