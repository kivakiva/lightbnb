const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require("pg");

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  values = [`${email}`];

  return pool
    .query(
      `SELECT *
      FROM users
      WHERE email = $1;`,
      values
    )
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => err.message);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  values = [`${id}`];

  return pool
    .query(
      `SELECT *
      FROM users
      WHERE id = $1;`,
      values
    )
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => err.message);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {
  const values = [`${user.name}`, `${user.email}`, `${user.password}`, ]

  return pool
    .query(
      `INSERT INTO users
      (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`, values
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => err.message);

}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  const values = [guest_id, limit]

  return pool
  .query(
    `SELECT reservations.*
    FROM reservations
    JOIN users ON reservations.guest_id = users.id
    WHERE reservations.guest_id = $1
    LIMIT $2;`, values
  )
  .then((res) => {
    return res.rows;
  })
  .catch((err) => err.message);
}



exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // 3
  if (options.owner_id) {
    if (queryParams.length === 0) {
      queryParams.push(options.owner_id);
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  // 3
  if (options.minimum_price_per_night) {
    if (queryParams.length === 0) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `WHERE cost_per_night > $${queryParams.length} `;
    } else {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `AND cost_per_night > $${queryParams.length} `;
    }
  }

  // 3
  if (options.maximum_price_per_night) {
    if (queryParams.length === 0) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `WHERE cost_per_night < $${queryParams.length} `;
    } else {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `AND cost_per_night < $${queryParams.length} `;
    }
  }

  queryString += `
  GROUP BY properties.id `

  // 3
  if (options.minimum_rating) {
      queryParams.push( options.minimum_rating * 1 );
      queryString += `
    HAVING avg(property_reviews.rating) > $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
