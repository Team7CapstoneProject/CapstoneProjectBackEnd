const { getCartById } = require("./cart");
const client = require("./client");

//check later to ensure functionality on this function
//this is for any functions that are calling for cart data that need products included in data result
//added this function to cart.js because export/import was not working
// async function attachProductsToCart(carts) {
//   const cartsToReturn = [...carts];
//   const binds = carts.map((_, index) => `$${index + 1}`).join(", ");
//   const cartIds = carts.map((cart) => cart.id);
//   if (!cartIds?.length) return [];

//   try {
//     const { rows: products } = await client.query(
//       `
//       SELECT products.*, cart_products.quantity, cart_products.id AS "cartProductId", cart_products.cart_id
//       FROM products
//       JOIN cart_products ON cart_products.product_id = products.id
//       WHERE cart_products.cart_id IN (${binds});
//     `,
//       cartIds
//     );

//     for (const cart of cartsToReturn) {
//       const productsToAdd = products.filter(
//         (product) => product.cart_id === cart.id
//       );
//       cart.products = productsToAdd;
//     }
//     return cartsToReturn;
//   } catch (error) {
//     throw error;
//   }
// }




//WORKING IN SEED.JS
async function canEditCartProduct(cartProductId, userId) {
  try {
    const selectedCartProduct = await getCartProductById(cartProductId);
    let selectedCart = await getCartById(selectedCartProduct.cart_id);
    let cartOwner = selectedCart.user_id;

    if (cartOwner === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
}

//WORKING IN SEED.JS
async function deleteCartProduct(cartProductId) {
  try {
    await client.query(
      `
      DELETE
      FROM cart_products
      WHERE id=$1
      RETURNING * `,
      [cartProductId]
    );

    let cartProduct = await getCartProductById(cartProductId);
    if (!cartProduct) {
      console.log(`CartProduct with ID ${cartProductId} was deleted`);
    } else {
      `CartProduct with ID ${cartProductId} was not deleted`;
    }

    return cartProduct;
  } catch (error) {
    throw error;
  }
}


//WORKING IN SEED.JS //keeping just in case
async function getCartProductByCart(cartId) {
  try {
    const { rows: cart_product } = await client.query(`
    SELECT *
    FROM cart_products
    WHERE "cart_id" = ${cartId}`);

    return cart_product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
async function getCartProductById(cartProductId) {
  try {
    const {
      rows: [cart_product],
    } = await client.query(`
  SELECT *
  FROM cart_products
  WHERE id = ${cartProductId}`);

    return cart_product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
async function updateCartProductQuantity(cartProductId, quantity) {
  try {
    const {
      rows: [cart_products],
    } = await client.query(
      `
      UPDATE cart_products
      SET quantity=$1
      WHERE id=$2
      RETURNING *
      `,
      [quantity, cartProductId]
    );

    return cart_products;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  attachProductsToCart,
  canEditCartProduct,
  deleteCartProduct,
  getCartProductByCart,
  getCartProductById,
  updateCartProductQuantity,
};
