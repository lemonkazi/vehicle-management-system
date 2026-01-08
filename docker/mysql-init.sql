CREATE DATABASE IF NOT EXISTS vehicle_db;
USE vehicle_db;

-- Vehicle Types Table
CREATE TABLE vehicle_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Owners Table
CREATE TABLE owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contract_number VARCHAR(50) UNIQUE,
    nid_number VARCHAR(50) UNIQUE,
    district_name VARCHAR(100),
    present_address TEXT,
    permanent_address TEXT,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contract_number VARCHAR(50) UNIQUE,
    nid_number VARCHAR(50) UNIQUE,
    district_name VARCHAR(100),
    present_address TEXT,
    permanent_address TEXT,
    driving_license_number VARCHAR(100) UNIQUE,
    experience_duration VARCHAR(50),
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type_id INT,
    engine_number VARCHAR(100) UNIQUE,
    chassis_number VARCHAR(100) UNIQUE,
    vehicle_license_number VARCHAR(100) UNIQUE,
    vehicle_capacity VARCHAR(50),
    vehicle_location VARCHAR(255),
    service_area VARCHAR(255),
    status ENUM('LOADING', 'UNLOADING', 'AVAILABLE', 'BUSY') DEFAULT 'AVAILABLE',
    vehicle_pic VARCHAR(255),
    driver_id INT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_vehicle_type (vehicle_type_id),
    INDEX idx_location (vehicle_location)
);

-- Users Table (for admin and general users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(200),
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Password will be hashed by the application
INSERT INTO users (email, password, name, role) VALUES 
('admin@vehicle.com', '$2b$10$YourHashedPasswordWillBeSetByApp', 'Admin User', 'ADMIN');

-- Insert sample vehicle types
INSERT INTO vehicle_types (name, description) VALUES 
('Truck', 'Heavy duty trucks for transportation'),
('Pickup', 'Light pickup vehicles'),
('Lorry', 'Medium to heavy lorries'),
('Car', 'Personal and commercial cars'),
('Car', 'Emergency medical vehicles'),
('Others', 'Other types of vehicles');