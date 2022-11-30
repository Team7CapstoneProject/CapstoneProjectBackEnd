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
//func for getting the specific cart_product by its id in database
//a cart_product id is passed in as a param
//operation is contained in a try/catch block
//destructured into rows key in return object from client query as const cart_product
//client query is selecting all key data from cart_products table
//where the id key in the table = the cartProductId passed in as param
//passed param cartProductId in via $1 as sql injection avoidance method
//returning cart_product (object)
//console logs in seed: 395-397
async function getCartProductById(cartProductId) {
  try {
    const {
      rows: [cart_product],
    } = await client.query(`
  SELECT *
  FROM cart_products
  WHERE id = $1`,
  [cartProductId]
  );
    return cart_product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
//function for checking if a user has authority to edit a product in cart
//this was written before we added user_id to carts table, so may need some adjusting as we could just do a direct check for users.id and user_id (in carts) values
//will address this change with group later because it is being used in the PATCH/DELETE parts of our cart_products file in API and possible blocker
async function canEditCartProduct(cartProductId, userId) {
  try {
    const selectedCartProduct = await getCartProductById(cartProductId);
    const selectedCart = await getCartById(selectedCartProduct.cart_id);
    const cartOwner = selectedCart.user_id;
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
//func for deleting a product in the cart
//cart_product id is passed in as param
//client query to delete fields from cart_products table where cart_product id = the cartProductId passed in as param
//next, const cartProduct awaits result of getCartProductById
//console logs (lines 385-389)
async function deleteCartProduct(cartProductId) {
  try {
    const {
      rows: [cart_product]
    } = await client.query(
      `
      DELETE
      FROM cart_products
      WHERE id=$1
      RETURNING * `,
      [cartProductId]
    );
    return cart_product;
  } catch (error) {
    throw error;
  }
}


//WORKING IN SEED.JS 
//func to get the associated cart products with a cart
//we may have circumvented this by creating our attachCartProductsToCart function and calling it when we call for cart data in the cart db functions
//keeping in program just in case we need it
//pass in cart id as param, run client query for all data in cart_products table where 
//console logs in seed lines 391-393
async function getCartProductByCart(cartId) {
  try {
    const { rows: cart_product } = await client.query(`
    SELECT *
    FROM cart_products
    WHERE cart_id = $1`,
    [cartId]
    );

    return cart_product;
  } catch (error) {
    throw error;
  }
}

//WORKING IN SEED.JS
//function for updating the quantity of a selected product in a cart
//cart product and quantity passed as params
//client query to update the integer in the quantity field of cart_products
//where the cart_product id = the cartProductId param
//returning cart_products
//console logs in seed 395-401
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
  canEditCartProduct,
  deleteCartProduct,
  getCartProductByCart,
  getCartProductById,
  updateCartProductQuantity,
};
