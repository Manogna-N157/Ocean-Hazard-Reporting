USE ocean_hazard_platform;

-- All seeded accounts use password: password
INSERT INTO users (name, email, password, role) VALUES
('Demo Citizen', 'citizen@example.com', '$2b$10$8uiaP1tWiqBzl8W0tksNwuhFSBWxKTrvtVRs.OeAZYzZoOGFiEBgu', 'Citizen'),
('Coastal Authority', 'authority@example.com', '$2b$10$8uiaP1tWiqBzl8W0tksNwuhFSBWxKTrvtVRs.OeAZYzZoOGFiEBgu', 'Authority'),
('Platform Admin', 'admin@example.com', '$2b$10$8uiaP1tWiqBzl8W0tksNwuhFSBWxKTrvtVRs.OeAZYzZoOGFiEBgu', 'Admin');

INSERT INTO hazard_reports (user_id, hazard_type, description, latitude, longitude, location, severity, status) VALUES
(1, 'Oil Spill', 'Dark oil patches observed near the fishing harbour.', 18.9387710, 72.8353350, 'Mumbai Harbour, Maharashtra', 'High', 'Verified'),
(1, 'Plastic Pollution', 'Large quantity of plastic waste washed onto the shore.', 11.9416000, 79.8083000, 'Puducherry Beach, Puducherry', 'Medium', 'Pending'),
(1, 'High Waves', 'Unusually high waves reported by local fishermen.', 8.0883000, 77.5385000, 'Kanyakumari, Tamil Nadu', 'Critical', 'Pending');

INSERT INTO alerts (report_id, title, message, location, severity) VALUES
(1, 'Oil Spill Warning', 'Avoid fishing and coastal water activities until further notice.', 'Mumbai Harbour, Maharashtra', 'High');

INSERT INTO social_media_analytics (keyword, mentions, sentiment, location, date) VALUES
('#OilSpill', 1250, 'Negative', 'Mumbai, Maharashtra', CURDATE()),
('#HighWaves', 890, 'Neutral', 'Kanyakumari, Tamil Nadu', CURDATE()),
('#CleanOcean', 760, 'Positive', 'Puducherry, Puducherry', CURDATE()),
('#PlasticPollution', 640, 'Negative', 'Chennai, Tamil Nadu', CURDATE());
