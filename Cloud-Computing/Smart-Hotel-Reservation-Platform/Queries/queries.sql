CREATE DATABASE IF NOT EXISTS smart_hotel;

USE smart_hotel;


-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);


-- ROOMS TABLE

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL,
    room_type VARCHAR(50),
    price INT,
    status VARCHAR(20)
);


-- BOOKINGS TABLE

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100),
    email VARCHAR(100),
    room_id INT,
    check_in DATE,
    check_out DATE,
    status VARCHAR(20),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);


-- INITIAL ROOM DATA

INSERT INTO rooms (room_number, room_type, price, status)
VALUES
(101, 'Deluxe', 3000, 'Available'),
(102, 'Suite', 5000, 'Available'),
(103, 'Single', 2000, 'Available'),
(104, 'Double', 3500, 'Available'),
(105, 'Luxury', 7000, 'Available');