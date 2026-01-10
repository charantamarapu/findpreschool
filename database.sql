-- FindYourPreSchool Database Schema
-- MySQL Database Script

CREATE DATABASE IF NOT EXISTS findyourpreschool;
USE findyourpreschool;

-- PreSchools Table
CREATE TABLE preschools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  google_place_id VARCHAR(255) UNIQUE,
  google_map_url VARCHAR(500),
  verified_status BOOLEAN DEFAULT FALSE,
  established_year INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_verified (verified_status),
  INDEX idx_google_place_id (google_place_id)
);

-- PreSchool Images Table
CREATE TABLE preschool_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preschool_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (preschool_id) REFERENCES preschools(id) ON DELETE CASCADE,
  INDEX idx_preschool_id (preschool_id)
);

-- Admission Details Table
CREATE TABLE admission_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preschool_id INT NOT NULL UNIQUE,
  monthly_fee_min DECIMAL(10, 2),
  monthly_fee_max DECIMAL(10, 2),
  annual_fee_min DECIMAL(10, 2),
  annual_fee_max DECIMAL(10, 2),
  registration_fee DECIMAL(10, 2),
  hidden_charges_json JSON,
  age_criteria VARCHAR(255),
  academic_year_start VARCHAR(50),
  verified_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (preschool_id) REFERENCES preschools(id) ON DELETE CASCADE,
  INDEX idx_monthly_fee_min (monthly_fee_min),
  INDEX idx_monthly_fee_max (monthly_fee_max),
  INDEX idx_verified_rating (verified_rating)
);

-- Franchise Details Table
CREATE TABLE franchise_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preschool_id INT NOT NULL UNIQUE,
  franchise_available BOOLEAN DEFAULT FALSE,
  initial_investment DECIMAL(12, 2),
  royalty_percentage DECIMAL(5, 2),
  royalty_type ENUM('flat', 'percentage') DEFAULT 'percentage',
  franchise_terms_json JSON,
  support_provided_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (preschool_id) REFERENCES preschools(id) ON DELETE CASCADE,
  INDEX idx_franchise_available (franchise_available)
);

-- Comparison History Table
CREATE TABLE comparison_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_ip VARCHAR(45),
  compared_preschool_ids JSON NOT NULL,
  comparison_type ENUM('admission', 'franchise', 'both') DEFAULT 'admission',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_ip (user_ip),
  INDEX idx_created_at (created_at)
);

-- Reviews Table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preschool_id INT NOT NULL,
  parent_name VARCHAR(255),
  parent_email VARCHAR(255),
  rating DECIMAL(3, 2) NOT NULL,
  facilities_rating DECIMAL(3, 2),
  teachers_rating DECIMAL(3, 2),
  curriculum_rating DECIMAL(3, 2),
  safety_rating DECIMAL(3, 2),
  review_text TEXT,
  verified BOOLEAN DEFAULT FALSE,
  photo_urls JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (preschool_id) REFERENCES preschools(id) ON DELETE CASCADE,
  INDEX idx_preschool_id (preschool_id),
  INDEX idx_verified (verified),
  INDEX idx_rating (rating)
);

-- Admin Users Table
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'moderator', 'viewer') DEFAULT 'moderator',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- PreSchool Owners Table (for claims/verification)
CREATE TABLE preschool_owners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  preschool_id INT NOT NULL UNIQUE,
  owner_name VARCHAR(255),
  owner_email VARCHAR(255) UNIQUE,
  owner_phone VARCHAR(20),
  verified_owner BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (preschool_id) REFERENCES preschools(id) ON DELETE CASCADE,
  INDEX idx_owner_email (owner_email)
);
