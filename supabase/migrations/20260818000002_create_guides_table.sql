-- Migration: Create Guides table for curated legal lessons (NDPR & Security compliant)

CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  rights_domain_id UUID REFERENCES public.rights_domains(id) ON DELETE SET NULL,
  constitution_section_id UUID REFERENCES public.constitution_sections(id) ON DELETE SET NULL,
  signoff_status TEXT NOT NULL DEFAULT 'draft' CHECK (signoff_status IN ('draft', 'in_review', 'approved', 'retired')),
  signoff_by TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast query filtering
CREATE INDEX IF NOT EXISTS idx_guides_rights_domain_id ON public.guides(rights_domain_id);
CREATE INDEX IF NOT EXISTS idx_guides_constitution_section_id ON public.guides(constitution_section_id);
CREATE INDEX IF NOT EXISTS idx_guides_status_published ON public.guides(signoff_status, published);
CREATE INDEX IF NOT EXISTS idx_guides_featured ON public.guides(featured) WHERE (featured = true);

-- Enable RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Strict Public Read Policy: ONLY approved AND published guides are ever returned
CREATE POLICY "Allow public read approved published guides"
  ON public.guides
  FOR SELECT
  USING (signoff_status = 'approved' AND published = true);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS set_guides_updated_at ON public.guides;
CREATE TRIGGER set_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
