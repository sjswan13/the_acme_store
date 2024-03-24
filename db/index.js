const pg = require('pg')
const uuid = require('uuid')
const bcrypt = require('bcrypt')


const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`)

const createTables = async () => {
  const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS user_favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(100)
    );
    CREATE TABLE user_favorites(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL
    );
  `

  await client.query(SQL);
}

const createUser = async ({username, password}) => {
  const SQL = /*SQL*/ `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
  `
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 10)]);
  return response.rows[0];
}

const createProducts = async ({ name }) => {
  const SQL = /*SQL*/ `
  INSERT into products(id, name) VALUES($1, $2) RETURNING *;
  `
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0]
}

const createUserFavorites = async ({user_id, product_id}) => {
  const SQL = /*SQL*/ `
  INSERT into user_favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *;
  `
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id])
  return response.rows[0]
}

const fetchUsers = async () => {
  const SQL = /*SQL*/ `SELECT * from users`
  const response = await client.query(SQL);
  return response.rows
}

const fetchProducts = async () => {
  const SQL = /*SQL*/ `SELECT * from products`
  const response = await client.query(SQL);
  return response.rows
}

const fetchUserFavorites = async (user_id) => {
  const SQL = /*SQL*/ `SELECT * from user_favorites WHERE user_id='${user_id}'`
  const response = await client.query(SQL);
  return response.rows
}

const destroyFavorite = async ({user_id, product_id}) => {
  const SQL = /*SQL*/ `DELETE from user_favorites WHERE user_id=$1 AND product_id=$2`;
  const response = await client.query(SQL[user_id, product_id]);
}

const seed = async () => {
  await Promise.all([
    createUser({username: 'turntablist', password: 'vrboMike4'}),
    createUser({username: 'suz*eQue', password: 'lmtcb*7'}),
    createUser({username: 'shirleytemple', password: 'noName9'}),
    createUser({username: 'jacksprat', password: 'jackandjill'}),
    createUser({username: 'billmurray', password: 'whoyougunnacall?'}),
    createProducts({name: 'tomato'}),
    createProducts({name: 'cheese'}),
    createProducts({name: 'spatula'}),
    createProducts({name: 'bom box'}),
    createProducts({name: 'broom'}),
  ]);

  const users= await fetchUsers()
  console.log('Users are ', await fetchUsers())
  const products= await fetchProducts()
  console.log('Products are', await fetchProducts())
  await Promise.all([
    createUserFavorites({user_id: users[0].id, product_id: products[1].id}), 
    createUserFavorites({user_id: users[1].id, product_id: products[2].id}), 
    createUserFavorites({user_id: users[2].id, product_id: products[3].id}), 
    createUserFavorites({user_id: users[3].id, product_id: products[4].id}), 
    createUserFavorites({user_id: users[4].id, product_id: products[0].id}), 
  ])
  console.log('User Favorites ', await fetchUserFavorites(users[0].id))
}

module.exports = {
  client, 
  createTables,
  createUser,
  createProducts,
  createUserFavorites, 
  fetchUsers,
  fetchProducts, 
  fetchUserFavorites,
  destroyFavorite,
  seed
}