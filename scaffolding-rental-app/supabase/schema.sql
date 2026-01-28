-- ============================================
-- KARYA JAYA TEHNIK - Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  pic_name TEXT,
  pic_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCTS TABLE (Scaffolding Items)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT DEFAULT 'Unit',
  category TEXT,
  price_daily INTEGER DEFAULT 0,
  price_weekly INTEGER DEFAULT 0,
  price_monthly INTEGER DEFAULT 0,
  stock_total INTEGER DEFAULT 0,
  stock_available INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  project_location TEXT,
  pic_name TEXT,
  pic_phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'Draft',
  deposit_amount INTEGER DEFAULT 0,
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_date DATE,
  deposit_method TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_day INTEGER NOT NULL DEFAULT 0,
  delivered_qty INTEGER DEFAULT 0,
  returned_qty INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. DELIVERIES TABLE (Surat Jalan Kirim)
-- ============================================
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  delivery_date DATE NOT NULL,
  driver_name TEXT,
  vehicle_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Draft',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. DELIVERY ITEMS TABLE
-- ============================================
CREATE TABLE delivery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- ============================================
-- 7. RETURNS TABLE (Surat Jalan Retur)
-- ============================================
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  return_date DATE NOT NULL,
  receiver_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Draft',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. RETURN ITEMS TABLE
-- ============================================
CREATE TABLE return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id UUID REFERENCES returns(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT DEFAULT 'good'
);

-- ============================================
-- 9. INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_percent DECIMAL DEFAULT 11,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  reference TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. STOCK MOVEMENTS TABLE
-- ============================================
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. USER PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'staff',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. COMPANY SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT DEFAULT 'KARYA JAYA TEHNIK',
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  company_npwp TEXT,
  invoice_prefix TEXT DEFAULT 'INV',
  invoice_start_number INTEGER DEFAULT 1,
  tax_percent DECIMAL DEFAULT 11,
  payment_terms_days INTEGER DEFAULT 30,
  terms_conditions TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED DATA - Products
-- ============================================
INSERT INTO products (code, name, category, unit, price_daily, price_weekly, price_monthly, stock_total, stock_available) VALUES
('MF-170', 'Main Frame 1.7m x 1.5m', 'Main Frame', 'Unit', 15000, 90000, 300000, 500, 280),
('CB-150', 'Cross Brace 1.5m', 'Cross Brace', 'Unit', 8000, 48000, 160000, 800, 450),
('JB-60', 'Jack Base Adjustable 60cm', 'Jack Base', 'Unit', 5000, 30000, 100000, 300, 50),
('UH-40', 'U-Head 40cm', 'U-Head', 'Unit', 6000, 36000, 120000, 250, 100),
('JP-10', 'Joint Pin 10cm', 'Joint Pin', 'Unit', 2000, 12000, 40000, 1000, 20);

-- ============================================
-- SEED DATA - Customers
-- ============================================
INSERT INTO customers (name, address, phone, email, pic_name) VALUES
('PT Konstruksi Bangunan', 'Jl. Raya Kebayoran No. 45, Jakarta Selatan', '021-7654321', 'info@konstruksi.com', 'Budi Santoso'),
('CV Jaya Abadi', 'Jl. Pemuda No. 100, Jakarta Timur', '021-8765432', 'admin@jayaabadi.com', 'Andi Wijaya'),
('PT Mega Proyek', 'BSD City, Tangerang Selatan', '021-5551234', 'project@megaproyek.com', 'Dewi Kartika');

-- ============================================
-- SEED DATA - Settings
-- ============================================
INSERT INTO settings (company_name, company_address, company_phone, company_email, company_npwp) VALUES
('KARYA JAYA TEHNIK', 'Jl. Industri No. 123, Jakarta Utara', '021-12345678', 'info@karyajayatehnik.com', '01.234.567.8-901.000');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON deliveries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON delivery_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON return_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON settings FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated write" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON deliveries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON delivery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON returns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON return_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- User profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  current_year TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1
  INTO next_num
  FROM orders
  WHERE order_number LIKE 'ORD-' || current_year || '-%';
  RETURN 'ORD-' || current_year || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Done! Database ready to use
-- ============================================
