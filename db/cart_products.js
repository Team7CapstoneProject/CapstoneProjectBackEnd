const client = require("./client");


async function deleteProductFromCart(productId) {
  try {
    await client.query(`
    DELETE
    FROM cart_products
    WHERE product_id=${productId}
    RETURNING * `);
  } catch (error) {
    throw error;
  }
}

module.exports = { deleteProductFromCart };
