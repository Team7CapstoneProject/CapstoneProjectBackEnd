const client = require("./client");
const { attachProductsToCart } = require("./cart_products");

//may need to add attachProductsToCart for these two functions later
async function getCartById(id) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `SELECT *
        FROM cart
        WHERE id=$1`,
      [id]
    );
    return cart;
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

async function getAllCarts() {
  try {
    const { rows } = await client.query(`
    SELECT cart.*, users.email AS "email"
    FROM cart
    JOIN users ON cart.user_id = users.id
        `);
    const carts = await attachProductsToCart(rows);
    return carts;
  } catch (error) {
    throw error;
  }
}

async function createCart({user_id}) {
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

async function deleteCart(id) {
  try {
    await client.query(`
       DELETE
       FROM cart_products
       WHERE cart_id=${id}
       RETURNING *`);

    await client.query(`
       DELETE
       FROM cart
       WHERE id=${id}
       RETURNING *`);

  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCart,
  updateCartCompletion,
  deleteCart,
  getCartById,
  getCartByEmail,
  getAllCarts,
  getCartsByUserId,
};
