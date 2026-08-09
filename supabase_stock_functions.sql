-- Run anytime after veda_website_schema.sql
-- Atomic stock decrements — avoids race conditions vs. read-then-write from the app.

create or replace function public.decrement_product_stock(p_product_id uuid, p_quantity integer)
returns void as $$
begin
  update public.products
  set stock_quantity = greatest(0, stock_quantity - p_quantity)
  where id = p_product_id;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.decrement_variant_stock(p_variant_id uuid, p_quantity integer)
returns void as $$
begin
  update public.product_variants
  set stock_quantity = greatest(0, stock_quantity - p_quantity)
  where id = p_variant_id;
end;
$$ language plpgsql security definer set search_path = public;
