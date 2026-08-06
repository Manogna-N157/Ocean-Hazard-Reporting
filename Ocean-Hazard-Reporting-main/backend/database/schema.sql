CREATE DATABASE IF NOT EXISTS ocean_hazard_platform;
USE ocean_hazard_platform;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Citizen', 'Authority', 'Admin') NOT NULL DEFAULT 'Citizen',
  approval_status ENUM('Approved', 'Pending', 'Rejected') NOT NULL DEFAULT 'Approved',
  government_authority_id VARCHAR(100) NULL,
  department_name VARCHAR(150) NULL,
  organization_name VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hazard_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  assigned_authority_id INT NULL,
  verified_by INT NULL,
  hazard_type ENUM('Oil Spill', 'Cyclone', 'High Waves', 'Plastic Pollution', 'Marine Animal Death', 'Other') NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  location VARCHAR(255) NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_assigned_authority FOREIGN KEY (assigned_authority_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_report_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  role ENUM('Citizen', 'Authority', 'Admin') NOT NULL,
  date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reports_submitted INT NOT NULL DEFAULT 0,
  verified_reports INT NOT NULL DEFAULT 0,
  pending_reports INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alert_report FOREIGN KEY (report_id) REFERENCES hazard_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL UNIQUE,
  hazard_prediction ENUM('Oil Spill', 'Plastic Pollution', 'Cyclone Damage', 'High Waves', 'Marine Animal Death', 'Coastal Flooding', 'Ship Accident', 'Other') NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL,
  risk_level ENUM('Low', 'Medium', 'High') NOT NULL,
  explanation TEXT NOT NULL,
  recommendation VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_analysis_report FOREIGN KEY (report_id) REFERENCES hazard_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS social_media_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(100) NOT NULL,
  mentions INT NOT NULL DEFAULT 0,
  sentiment ENUM('Positive', 'Neutral', 'Negative') NOT NULL,
  location VARCHAR(255) NOT NULL,
  date DATE NOT NULL
);
