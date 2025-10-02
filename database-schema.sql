-- Vitafoods360 Complete Database Schema
-- This file contains all database tables, policies, and functions

-- ==============================================
-- CORE TABLES
-- ==============================================

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    image_url TEXT,
    category TEXT DEFAULT 'bakery',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- USER MANAGEMENT TABLES
-- ==============================================

-- Create user_profiles table to extend auth.users
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    dietary_preferences TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create addresses table for saved delivery addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- e.g., "Home", "Work", "Office"
    full_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT,
    country TEXT DEFAULT 'Sierra Leone',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- ORDER MANAGEMENT TABLES
-- ==============================================

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name TEXT NOT NULL, -- Store product name at time of order
    product_price NUMERIC(10, 2) NOT NULL, -- Store price at time of order
    quantity INTEGER NOT NULL DEFAULT 1,
    special_notes TEXT
);

-- ==============================================
-- LOYALTY SYSTEM TABLES
-- ==============================================

-- Create loyalty_transactions table
CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL, -- Positive for earned, negative for redeemed
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- ROW LEVEL SECURITY
-- ==============================================

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- RLS POLICIES
-- ==============================================

-- RLS Policies for products (public read access)
CREATE POLICY "Public read access" ON products 
    FOR SELECT USING (true);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Public insert access" ON newsletter_subscribers 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select access" ON newsletter_subscribers 
    FOR SELECT USING (auth.role() = 'admin');

-- RLS Policies for messages
CREATE POLICY "Public insert access" ON messages 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select access" ON messages 
    FOR SELECT USING (auth.role() = 'admin');

-- RLS Policies for staff (public read access)
CREATE POLICY "Public read access" ON staff 
    FOR SELECT USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles 
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for addresses
CREATE POLICY "Users can view own addresses" ON addresses 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses 
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- RLS Policies for loyalty_transactions
CREATE POLICY "Users can view own loyalty transactions" ON loyalty_transactions 
    FOR SELECT USING (auth.uid() = user_id);

-- ==============================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create sequence for order numbers
CREATE SEQUENCE order_number_seq START 1;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    order_num := 'VITA-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to update loyalty points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
    points_earned INTEGER;
BEGIN
    -- Award 1 point per 100 Leones spent
    points_earned := FLOOR(NEW.total_amount / 100);
    
    -- Add points to user profile
    UPDATE user_profiles 
    SET loyalty_points = loyalty_points + points_earned
    WHERE id = NEW.user_id;
    
    -- Record the transaction
    INSERT INTO loyalty_transactions (user_id, order_id, points, description)
    VALUES (NEW.user_id, NEW.id, points_earned, 'Points earned from order #' || NEW.order_number);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update loyalty points when order is confirmed
CREATE TRIGGER update_loyalty_on_order_confirmed
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status = 'pending' AND NEW.status = 'confirmed')
    EXECUTE FUNCTION update_loyalty_points();

-- ==============================================
-- SAMPLE DATA
-- ==============================================

-- Sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
('Vita Fresh Bread', 'Freshly baked daily bread with premium ingredients', 2500.00, '/images/products/VitaFreshBread.webp', 'bread'),
('Vita Rolls', 'Soft and fluffy dinner rolls perfect for any meal', 1200.00, '/images/products/VitaRolls.webp', 'bread'),
('Vita Chin-Chin', 'Crispy and sweet traditional Nigerian snack', 800.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'snacks'),
('Vita Pie', 'Delicious meat and vegetable pies', 1500.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'pastries'),
('Vita White Bread', 'Classic white bread for everyday use', 2000.00, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', 'bread'),
('Vita Whole-Wheat Bread', 'Healthy whole-wheat bread with fiber', 2800.00, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400', 'bread'),
('Vita Cake', 'Moist and delicious celebration cakes', 5000.00, '/images/products/VitaCakes.webp', 'cakes'),
('Vita Cookies', 'Homemade cookies with premium ingredients', 1000.00, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', 'snacks');

-- Sample staff
INSERT INTO staff (name, role, bio, image_url) VALUES
('Aminata Bangura', 'Founder & CEO', 'Passionate about bringing healthy, fresh bakery products to our community. With over 10 years of experience in food service and nutrition.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300'),
('Mohamed Kamara', 'Head Baker', 'Master baker with expertise in traditional and modern baking techniques. Committed to quality and consistency in every product.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'),
('Fatima Sesay', 'Nutritionist', 'Certified nutritionist focused on creating healthy bakery options. Specializes in whole-grain and low-sugar alternatives.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'),
('Ibrahim Conteh', 'Operations Manager', 'Ensures smooth operations and maintains the highest standards of food safety and quality control.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300');
