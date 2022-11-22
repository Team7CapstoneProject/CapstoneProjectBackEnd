const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/capstoneDev");
//ssl? do we need to add that before deployment

async function createUser({ first_name, last_name, password, email }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(first_name, last_name, password, email)
    VALUES($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
    RETURNING *;`,
      [first_name, last_name, password, email]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function createProduct({
  name,
  description,
  price,
  image_url,
  inventory,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        INSERT INTO products(name, description, price, image_url, inventory)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;`,
      [name, description, price, image_url, inventory]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows: productIds } = await client.query(`
        SELECT id
        FROM products`);

    const products = await Promise.all(
      productIds.map((product) => getProductById(product.id))
    );
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        SELECT *
        FROM products
        WHERE id=$1`,
      [productId]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductByName(productName) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
          SELECT *
          FROM products
          WHERE name=$1`,
      [productName]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct({ productId }) {
  try {
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  createProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  client,
};
