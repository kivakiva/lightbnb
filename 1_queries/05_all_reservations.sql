SELECT properties.id, properties.title, reservations.start_date, avg(property_reviews.rating) as average_rating
JOIN reservations ON property_reviews.reservation_id = reservations.id
JOIN properties ON properties.id = reservations.property_id
WHERE reservations.guest_id = 1 
  AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;
