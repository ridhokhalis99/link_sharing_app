-- Add an order field to the links table
ALTER TABLE public.links ADD COLUMN "order" INTEGER DEFAULT 0;

-- Create an index on order field for faster sorting
CREATE INDEX idx_links_order ON public.links("order");

-- Update existing links to have sequential order based on creation date
UPDATE public.links
SET "order" = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at) as row_num
  FROM public.links
) as subquery
WHERE links.id = subquery.id;