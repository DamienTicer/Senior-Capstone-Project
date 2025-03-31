-- database/schema.sql

-- Create Database
CREATE DATABASE IF NOT EXISTS bowie_tech_discount;
USE bowie_tech_discount;

-- Drop table if it already exists (optional, for clean testing)
DROP TABLE IF EXISTS products;

-- Create Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

-- Insert Mock Product Data
INSERT INTO products (name, price, discount_price, image_url) VALUES
('MacBook Pro 14-inch', 1999.99, 1699.99, 'https://via.placeholder.com/200x150?text=MacBook+Pro'),
('Dell XPS 13', 1399.99, 1199.99, 'https://via.placeholder.com/200x150?text=Dell+XPS+13'),
('iPhone 14 Pro', 999.99, 849.99, 'https://via.placeholder.com/200x150?text=iPhone+14+Pro'),
('Samsung Galaxy S23', 899.99, 749.99, 'https://via.placeholder.com/200x150?text=Galaxy+S23'),
('Lenovo ThinkPad X1', 1499.99, 1299.99, 'https://via.placeholder.com/200x150?text=ThinkPad+X1');

-- Optional: View inserted products
SELECT * FROM products;
