INSERT INTO users (name, email, password)
VALUES ('john', 'a@a.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('ankara', 'a@aa.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('arundhati', 'a@ar.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties 
(owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES (1, 'home sweet', 'very', 'a.ca', 'ab.ca', 'cana', '55 hoe', 'big big city', 'qc', '1f1kkd'),
(2, 'home sweet', 'very', 'a.ca', 'ab.ca', 'cana', '55 hoe', 'big big city', 'qc', '1f1kkd'),
(3, 'home sweet', 'very', 'a.ca', 'ab.ca', 'cana', '55 hoe', 'big big city', 'qc', '1f1kkd');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 5, 'lovely lovely'),
(2, 2, 2, 5, 'very nice'),
(3, 3, 3, 1, 'eurgh');
