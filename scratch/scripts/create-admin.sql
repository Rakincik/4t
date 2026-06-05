INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") 
VALUES (
  'admin001', 
  'admin@4takademi.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/i/yDH8y8F0O1O5CKq', 
  'Admin', 
  'ADMIN', 
  NOW(), 
  NOW()
);
