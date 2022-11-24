const client = require("./client");

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

    let product = await getProductById(productId);
    if (!product) {
      console.log(`Product with productId ${productId} was deleted`);
    } else {
      `Product with productId ${productId} was not deleted`;
    }

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
