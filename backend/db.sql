-- Run this in your MySQL server to create the database and table
CREATE DATABASE IF NOT EXISTS crud_db;
USE crud_db;
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
