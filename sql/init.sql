CREATE DATABASE IF NOT EXISTS vehicle_management;
USE vehicle_management;

-- Vehicle Types Table
CREATE TABLE IF NOT EXISTS vehicle_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default vehicle types
INSERT INTO vehicle_types (name) VALUES 
  ('Truck'), ('Pickup'), ('Lory'), ('Car'), ('Car'), ('Others')
ON DUPLICATE KEY UPDATE name=name;

-- Owners Table
CREATE TABLE IF NOT EXISTS owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contract_number VARCHAR(50),
  nid_number VARCHAR(50),
  district_name VARCHAR(100),
  present_address TEXT,
  permanent_address TEXT,
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_nid (nid_number)
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contract_number VARCHAR(50),
  nid_number VARCHAR(50),
  district_name VARCHAR(100),
  present_address TEXT,
  permanent_address TEXT,
  driving_licence_number VARCHAR(100),
  experience_duration VARCHAR(50),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_licence (driving_licence_number)
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_type_id INT NOT NULL,
  owner_id INT NOT NULL,
  driver_id INT NOT NULL,
  engine_number VARCHAR(100),
  chache_number VARCHAR(100),
  vehicle_licence_number VARCHAR(100),
  vehicle_capacity VARCHAR(50),
  vehicle_location VARCHAR(255),
  service_area VARCHAR(255),
  vehicle_pic VARCHAR(500),
  status ENUM('loading', 'unloading') DEFAULT 'unloading',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id) ON DELETE RESTRICT,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE RESTRICT,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE RESTRICT,
  INDEX idx_type (vehicle_type_id),
  INDEX idx_status (status),
  INDEX idx_location (vehicle_location)
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
-- Hash generated using bcrypt with 10 rounds
INSERT INTO admin_users (user_id, password, name) VALUES 
  ('admin', '$2a$10$rF8qk1PqF5vR8hPxKZq.ZuHnXJ7F8RzxK1YzGxVYZLxPxKZq.Zu8W', 'Administrator')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Public Users Table
CREATE TABLE IF NOT EXISTS public_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);