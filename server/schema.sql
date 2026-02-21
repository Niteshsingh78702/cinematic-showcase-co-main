-- MG Films Database Schema for Hostinger MySQL
-- Run this on your Hostinger MySQL instance

CREATE DATABASE IF NOT EXISTS mg_films;
USE mg_films;

-- Admin Users
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Content (all dynamic page content)
CREATE TABLE IF NOT EXISTS site_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(50) NOT NULL,       -- 'hero', 'about', 'work_albums', 'work_films', 'work_weddings', 'services', 'actress', 'contact'
  title VARCHAR(255),
  description TEXT,
  media_url VARCHAR(500),
  media_type ENUM('image', 'video', 'youtube') DEFAULT 'image',
  link_url VARCHAR(500),
  category VARCHAR(100),              -- e.g. 'Purulia Bangla', 'Khortha', 'Santhali'
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section (section),
  INDEX idx_active (is_active)
);

-- Contact Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  message TEXT NOT NULL,
  is_contacted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacted (is_contacted)
);

-- SEO Settings (per page)
CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL UNIQUE,   -- 'home', 'about', 'work', 'actress', 'services', 'contact'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123 — change after first login!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admins (email, password_hash, name) VALUES
('admin@mgfilms.com', '$2b$10$placeholder_hash_change_me', 'MG Films Admin');

-- Insert default SEO settings
INSERT INTO seo_settings (page, meta_title, meta_description, meta_keywords) VALUES
('home', 'MG Films | Capturing Emotions, Creating Memories', 'MG Films - Regional music albums, short films & wedding cinematography.', 'MG Films, Purulia Bangla, Khortha, Santhali, wedding cinematography'),
('about', 'About MG Films | Our Story & Vision', 'Learn about MG Films - a creative production house specializing in regional content.', 'MG Films about, production house, regional films'),
('work', 'Our Work | MG Films Portfolio', 'Explore our portfolio of regional music albums, short films, and wedding cinematography.', 'MG Films portfolio, albums, films, wedding'),
('actress', 'Monika Singh | Actress Portfolio', 'Monika Singh - Regional actress in Purulia Bangla, Khortha and Santhali productions.', 'Monika Singh, actress, regional artist'),
('services', 'Services | MG Films Productions', 'Professional film production, music albums, wedding cinematography and more.', 'film production, music album, wedding cinematography, video editing'),
('contact', 'Contact MG Films | Book Your Event', 'Get in touch with MG Films for wedding cinematography, film production, and more.', 'contact MG Films, book wedding, film production booking');
