-- Migration: Create Constitution, Chapters, Sections, and Rights Domains tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: public.constitutions
CREATE TABLE IF NOT EXISTS public.constitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 1999,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: public.constitution_chapters
CREATE TABLE IF NOT EXISTS public.constitution_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constitution_id UUID NOT NULL REFERENCES public.constitutions(id) ON DELETE CASCADE,
  chapter_number TEXT NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: public.constitution_sections
CREATE TABLE IF NOT EXISTS public.constitution_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constitution_id UUID NOT NULL REFERENCES public.constitutions(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.constitution_chapters(id) ON DELETE CASCADE,
  section_number TEXT NOT NULL,
  title TEXT NOT NULL,
  full_text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  source_reference TEXT,
  needs_manual_review BOOLEAN NOT NULL DEFAULT false,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: public.rights_domains (matching category field in LegalSection)
CREATE TABLE IF NOT EXISTS public.rights_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('civil', 'police', 'tenancy', 'employment', 'consumer')),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_constitution_chapters_const_id ON public.constitution_chapters(constitution_id);
CREATE INDEX IF NOT EXISTS idx_constitution_sections_chapter_id ON public.constitution_sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_constitution_sections_section_num ON public.constitution_sections(section_number);

-- Enable RLS
ALTER TABLE public.constitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constitution_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constitution_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rights_domains ENABLE ROW LEVEL SECURITY;

-- Allow public read access to constitution tables & domains
CREATE POLICY "Allow public read constitutions" ON public.constitutions FOR SELECT USING (true);
CREATE POLICY "Allow public read constitution_chapters" ON public.constitution_chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read constitution_sections" ON public.constitution_sections FOR SELECT USING (true);
CREATE POLICY "Allow public read rights_domains" ON public.rights_domains FOR SELECT USING (true);

-- Seed rights_domains (5 pilot categories)
INSERT INTO public.rights_domains (name, description, display_order)
VALUES
  ('civil', 'Fundamental Civil Rights & Liberties', 1),
  ('police', 'Police Stop & Arrest Rights', 2),
  ('tenancy', 'Tenant & Housing Rights', 3),
  ('employment', 'Employment & Labor Law', 4),
  ('consumer', 'Consumer Rights & Refunds', 5)
ON CONFLICT (name) DO UPDATE
  SET description = EXCLUDED.description,
      display_order = EXCLUDED.display_order;

-- Auto-update updated_at triggers
DROP TRIGGER IF EXISTS set_constitutions_updated_at ON public.constitutions;
CREATE TRIGGER set_constitutions_updated_at
  BEFORE UPDATE ON public.constitutions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_constitution_chapters_updated_at ON public.constitution_chapters;
CREATE TRIGGER set_constitution_chapters_updated_at
  BEFORE UPDATE ON public.constitution_chapters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_constitution_sections_updated_at ON public.constitution_sections;
CREATE TRIGGER set_constitution_sections_updated_at
  BEFORE UPDATE ON public.constitution_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_rights_domains_updated_at ON public.rights_domains;
CREATE TRIGGER set_rights_domains_updated_at
  BEFORE UPDATE ON public.rights_domains
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
