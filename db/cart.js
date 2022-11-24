const client = require("./client");
const { attachProductsToCart } = require("./cart_products");

async function createCart({ user_id }) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
    INSERT INTO cart( user_id)
    VALUES ($1)
    RETURNING *`,
      [user_id]
    );

    return cart;
  } catch (error) {
    throw error;
  }
}

async function deleteCart(cartId) {
  try {
    await client.query(`
       DELETE
       FROM cart_products
       WHERE cart_id=${cartId}
       RETURNING *`);

    await client.query(`
       DELETE
       FROM cart
       WHERE id=${cartId}
       RETURNING *`);

    let cart = await getCartById(cartId);
    if (!cart) {
      console.log(`Cart with cartId ${cartId} was deleted`);
    } else {
      `Cart with cartId ${cartId} was not deleted`;
    }

    return cart;
  } catch (error) {
    throw error;
  }
}

async function getAllCarts() {
  try {
    const { rows: cartIds } = await client.query(`
    SELECT id
    FROM cart`);

    const carts = await Promise.all(
      cartIds.map((cart) => getCartById(cart.id))
    );

    return carts;
  } catch (error) {
    throw error;
  }
}

async function getCartByEmail(email) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
        SELECT cart.*, users.email AS "email"
        FROM cart
        JOIN users ON cart.user_id = users.id
        WHERE email=$1`,
      [email]
    );

    return cart;
  } catch (error) {
    throw error;
  }
}

async function getCartById(cartId) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `SELECT *
        FROM cart
        WHERE id=$1`,
      [cartId]
    );
    return cart;
  } catch (error) {
    throw error;
  }
}

async function getCartsByUserId(user_id) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
          SELECT cart.*, users.id AS "user_id"
          FROM cart
          JOIN users ON cart.user_id = users.id
          WHERE user_id=$1`,
      [user_id]
    );

    return cart;
  } catch (error) {
    throw error;
  }
}

async function updateCartCompletion(id) {
  try {
    const {
      rows: [cart],
    } = await client.query(`
        UPDATE cart
        SET is_complete=true
        WHERE id=${id}
        RETURNING *
        `);

    // const cartStatus = await getCartById(id)
    return cart;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCart,
  deleteCart,
  getAllCarts,
  getCartByEmail,
  getCartById,
  getCartsByUserId,
  updateCartCompletion,
};
