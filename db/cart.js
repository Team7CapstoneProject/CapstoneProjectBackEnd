const client = require("./client");

//WORKING IN SEED.JS
async function addProductToCart({ cart_id, product_id, quantity }) {
  try {
    const {
      rows: [cart_product],
    } = await client.query(
      `
      INSERT INTO cart_products(cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id) DO NOTHING
      RETURNING *;
      `,
      [cart_id, product_id, quantity]
    );

    return cart_product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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
      console.log(`Cart with ID ${cartId} was deleted`);
    } else {
      `Cart with cartId ${cartId} was not deleted`;
    }

    return cart;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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

//WORKING IN SEED.JS
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
    return cart;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addProductToCart,
  createCart,
  deleteCart,
  getAllCarts,
  getCartByEmail,
  getCartById,
  getCartsByUserId,
  updateCartCompletion,
};
