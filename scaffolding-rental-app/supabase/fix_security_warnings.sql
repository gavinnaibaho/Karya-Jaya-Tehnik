-- ============================================
-- FIX PERFORMANCE WARNINGS - Supabase Advisor
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- Drop all existing policies first
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ============================================
-- SIMPLE POLICIES - For Internal Business App
-- All authenticated users have full access
-- ============================================

-- CUSTOMERS
CREATE POLICY "Allow authenticated access" ON public.customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PRODUCTS
CREATE POLICY "Allow authenticated access" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ORDERS
CREATE POLICY "Allow authenticated access" ON public.orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ORDER_ITEMS
CREATE POLICY "Allow authenticated access" ON public.order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- DELIVERIES
CREATE POLICY "Allow authenticated access" ON public.deliveries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- DELIVERY_ITEMS
CREATE POLICY "Allow authenticated access" ON public.delivery_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RETURNS
CREATE POLICY "Allow authenticated access" ON public.returns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RETURN_ITEMS
CREATE POLICY "Allow authenticated access" ON public.return_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- INVOICES
CREATE POLICY "Allow authenticated access" ON public.invoices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PAYMENTS
CREATE POLICY "Allow authenticated access" ON public.payments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STOCK_MOVEMENTS
CREATE POLICY "Allow authenticated access" ON public.stock_movements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SETTINGS
CREATE POLICY "Allow authenticated access" ON public.settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROFILES - Keep user-specific but use optimized pattern
CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL TO authenticated 
  USING ((SELECT auth.uid()) = id) 
  WITH CHECK ((SELECT auth.uid()) = id);


-- ============================================
-- Done! 
-- For internal business apps with trusted users,
-- these simple policies are acceptable.
-- ============================================
