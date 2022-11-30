const client = require("./client");

//WORKING IN SEED.JS
async function createProduct({
  name,
  description,
  price,
  image_url,
  inventory,
  on_sale,
  sale_percentage,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
          INSERT INTO products(name, description, price, image_url, inventory, on_sale, sale_percentage)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;`,
      [name, description, price, image_url, inventory, on_sale, sale_percentage]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
async function deleteProduct(productId) {
  try {
    await client.query(`
          DELETE
          FROM cart_products
          WHERE product_id=${productId}
          RETURNING * `);

    await client.query(`
          DELETE
          FROM products
          WHERE id=${productId}
          RETURNING *`);
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
async function updateProduct(productId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [product],
    } = await client.query(
      `
      UPDATE products
      SET ${setString}
      WHERE id=${productId}
      RETURNING *`,
      Object.values(fields)
    );

    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,
};
