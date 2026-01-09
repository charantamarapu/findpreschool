-- Sample Data for FindPreschool.org Database
USE findpreschool;

-- Insert Sample Preschools
INSERT INTO preschools (name, address, city, state, pincode, latitude, longitude, phone, email, website, verified_status, created_at, updated_at) VALUES
('Sunshine Academy', 'Block A, New Delhi', 'Delhi', 'Delhi', '110001', 28.6139, 77.2090, '9876543210', 'info@sunshine.com', 'www.sunshine.com', TRUE, NOW(), NOW()),
('Little Stars Preschool', 'Whitefield, Bangalore', 'Bangalore', 'Karnataka', '560066', 12.9698, 77.7499, '9876543211', 'info@littlestars.com', 'www.littlestars.com', TRUE, NOW(), NOW()),
('Rainbow Kids School', 'Bandra, Mumbai', 'Mumbai', 'Maharashtra', '400050', 19.0596, 72.8295, '9876543212', 'info@rainbowkids.com', 'www.rainbowkids.com', TRUE, NOW(), NOW()),
('Smart Kids Learning Center', 'Kalyani Nagar, Pune', 'Pune', 'Maharashtra', '411006', 18.5204, 73.8567, '9876543213', 'info@smartkids.com', 'www.smartkids.com', TRUE, NOW(), NOW()),
('Golden Years Preschool', 'Sector 7, Chandigarh', 'Chandigarh', 'Chandigarh', '160001', 30.7333, 76.7794, '9876543214', 'info@goldenyears.com', 'www.goldenyears.com', TRUE, NOW(), NOW()),
('Playway Academy', 'Jubilee Hills, Hyderabad', 'Hyderabad', 'Telangana', '500033', 17.3850, 78.4867, '9876543215', 'info@playway.com', 'www.playway.com', FALSE, NOW(), NOW()),
('Creative Kids School', 'Indiranagar, Bangalore', 'Bangalore', 'Karnataka', '560038', 12.9716, 77.6412, '9876543216', 'info@creativekids.com', 'www.creativekids.com', TRUE, NOW(), NOW()),
('Bright Minds Preschool', 'Malviya Nagar, Delhi', 'Delhi', 'Delhi', '110017', 28.5244, 77.1903, '9876543217', 'info@brightminds.com', 'www.brightminds.com', TRUE, NOW(), NOW()),
('Happy Child Daycare', 'T. Nagar, Chennai', 'Chennai', 'Tamil Nadu', '600017', 13.0279, 80.2427, '9876543218', 'info@happychild.com', 'www.happychild.com', FALSE, NOW(), NOW()),
('Wisdom Kids Academy', 'Gurgaon', 'Gurgaon', 'Haryana', '122001', 28.4595, 77.0266, '9876543219', 'info@wisdomkids.com', 'www.wisdomkids.com', TRUE, NOW(), NOW());

-- Insert Sample Preschool Images
INSERT INTO preschool_images (preschool_id, image_url, is_primary, created_at) VALUES
(1, 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop', TRUE, NOW()),
(1, 'https://images.unsplash.com/photo-1503454537688-e6ba5f2b8fbc?w=400&h=300&fit=crop', FALSE, NOW()),
(2, 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop', TRUE, NOW()),
(2, 'https://images.unsplash.com/photo-1427504494975-3a3a3880ed15?w=400&h=300&fit=crop', FALSE, NOW()),
(3, 'https://images.unsplash.com/photo-1578992260292-e77cb98a759d?w=400&h=300&fit=crop', TRUE, NOW()),
(3, 'https://images.unsplash.com/photo-1524634126442-357e0eac6b14?w=400&h=300&fit=crop', FALSE, NOW()),
(4, 'https://images.unsplash.com/photo-1508450860342-f8899e5e7e5e?w=400&h=300&fit=crop', TRUE, NOW()),
(4, 'https://images.unsplash.com/photo-1552959843-6f5a58e0f43e?w=400&h=300&fit=crop', FALSE, NOW()),
(5, 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=300&fit=crop', TRUE, NOW()),
(6, 'https://images.unsplash.com/photo-1491897913055-e3835cdcd4c0?w=400&h=300&fit=crop', TRUE, NOW()),
(7, 'https://images.unsplash.com/photo-1517842645503-45a6b11e9c60?w=400&h=300&fit=crop', TRUE, NOW()),
(8, 'https://images.unsplash.com/photo-1497027993440-be41614549ca?w=400&h=300&fit=crop', TRUE, NOW()),
(9, 'https://images.unsplash.com/photo-1537905904737-13fc61b36800?w=400&h=300&fit=crop', TRUE, NOW()),
(10, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', TRUE, NOW());

-- Insert Sample Admission Details
INSERT INTO admission_details (preschool_id, monthly_fee_min, monthly_fee_max, annual_fee_min, annual_fee_max, registration_fee, age_criteria, academic_year_start, verified_rating, total_reviews, created_at, updated_at) VALUES
(1, 12000, 15000, 144000, 180000, 5000, '2-5 years', 'April', 4.8, 45, NOW(), NOW()),
(2, 14000, 16500, 168000, 198000, 7500, '2-5 years', 'June', 4.7, 38, NOW(), NOW()),
(3, 16000, 18000, 192000, 216000, 10000, '2-6 years', 'April', 4.6, 52, NOW(), NOW()),
(4, 12000, 14000, 144000, 168000, 4000, '2-4 years', 'May', 4.5, 28, NOW(), NOW()),
(5, 11500, 13500, 138000, 162000, 5500, '2-5 years', 'April', 4.7, 35, NOW(), NOW()),
(6, 10000, 12000, 120000, 144000, 3500, '2-5 years', 'June', 4.2, 22, NOW(), NOW()),
(7, 15000, 17000, 180000, 204000, 8000, '2-5 years', 'June', 4.8, 41, NOW(), NOW()),
(8, 14500, 16000, 174000, 192000, 6000, '2-5 years', 'April', 4.6, 38, NOW(), NOW()),
(9, 9500, 11500, 114000, 138000, 3000, '1.5-5 years', 'July', 4.3, 19, NOW(), NOW()),
(10, 13000, 15500, 156000, 186000, 5500, '2-5 years', 'April', 4.7, 33, NOW(), NOW());

-- Insert Sample Reviews
INSERT INTO reviews (preschool_id, parent_name, parent_email, rating, facilities_rating, teachers_rating, curriculum_rating, safety_rating, review_text, verified, created_at, updated_at) VALUES
(1, 'Rajesh Kumar', 'rajesh@email.com', 4.8, 4.9, 4.8, 4.7, 5.0, 'Excellent school with great infrastructure and caring teachers. My child loves going to school.', TRUE, NOW(), NOW()),
(1, 'Priya Sharma', 'priya@email.com', 4.7, 4.6, 4.8, 4.7, 4.9, 'Very good preschool. Staff is attentive and the curriculum is well-designed.', TRUE, NOW(), NOW()),
(2, 'Amit Patel', 'amit@email.com', 4.7, 4.8, 4.6, 4.8, 4.6, 'Great learning environment. Teachers are well-trained and supportive.', TRUE, NOW(), NOW()),
(2, 'Anjali Gupta', 'anjali@email.com', 4.7, 4.7, 4.7, 4.7, 4.8, 'Very satisfied with the quality of education and care provided.', TRUE, NOW(), NOW()),
(3, 'Vikram Singh', 'vikram@email.com', 4.6, 4.5, 4.6, 4.7, 4.6, 'Good school overall. Management is responsive and fees are reasonable.', TRUE, NOW(), NOW()),
(3, 'Meera Iyer', 'meera@email.com', 4.6, 4.7, 4.5, 4.6, 4.7, 'Well-maintained facilities and good teaching staff.', TRUE, NOW(), NOW()),
(4, 'Suresh Desai', 'suresh@email.com', 4.5, 4.4, 4.5, 4.5, 4.6, 'Affordable and good quality education. Recommended for middle-class families.', TRUE, NOW(), NOW()),
(5, 'Neha Nair', 'neha@email.com', 4.7, 4.8, 4.7, 4.6, 4.8, 'Excellent choice for early childhood education. Very happy with our decision.', TRUE, NOW(), NOW()),
(6, 'Ravi Krishnan', 'ravi@email.com', 4.2, 4.1, 4.2, 4.2, 4.4, 'Good school. Some improvements needed in infrastructure.', FALSE, NOW(), NOW()),
(7, 'Divya Reddy', 'divya@email.com', 4.8, 4.9, 4.8, 4.7, 4.9, 'Outstanding preschool. Teachers are very caring and the environment is nurturing.', TRUE, NOW(), NOW()),
(8, 'Arjun Verma', 'arjun@email.com', 4.6, 4.6, 4.7, 4.5, 4.7, 'Solid choice for preschool. Good curriculum and supportive staff.', TRUE, NOW(), NOW()),
(10, 'Sneha Chopra', 'sneha@email.com', 4.7, 4.8, 4.6, 4.7, 4.8, 'Highly recommended. Professional staff and modern facilities.', TRUE, NOW(), NOW());

-- Insert Sample Franchise Details
INSERT INTO franchise_details (preschool_id, franchise_available, initial_investment, royalty_percentage, royalty_type, franchise_terms_json, created_at, updated_at) VALUES
(1, TRUE, 5000000, 5, 'percentage', '{"duration": "10 years", "territory": "city", "support": "training, marketing, operations"}', NOW(), NOW()),
(3, TRUE, 6000000, 6, 'percentage', '{"duration": "10 years", "territory": "district", "support": "training, marketing, curriculum"}', NOW(), NOW()),
(5, TRUE, 4500000, 5, 'percentage', '{"duration": "8 years", "territory": "city", "support": "training, operations"}', NOW(), NOW()),
(7, TRUE, 5500000, 5.5, 'percentage', '{"duration": "10 years", "territory": "district", "support": "full support"}', NOW(), NOW()),
(10, TRUE, 4800000, 5, 'percentage', '{"duration": "10 years", "territory": "city", "support": "training, marketing, hr"}', NOW(), NOW());

-- Insert Sample Preschool Owner
INSERT INTO preschool_owners (preschool_id, owner_name, owner_email, owner_phone, verified_owner, created_at, updated_at) VALUES
(1, 'Rajesh Sharma', 'owner@sunshine.com', '9999999999', TRUE, NOW(), NOW()),
(2, 'Meera Kulkarni', 'owner@littlestars.com', '9999999998', TRUE, NOW(), NOW()),
(3, 'Arun Pillai', 'owner@rainbowkids.com', '9999999997', FALSE, NOW(), NOW()),
(5, 'Priya Singh', 'owner@goldenyears.com', '9999999996', TRUE, NOW(), NOW());
