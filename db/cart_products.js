const client = require("./client");


async function attachProductsToCart(carts){
  const cartsToReturn = [...carts]
  const binds = carts.map((_, index)=> `$${index + 1}`).join(", ")
  const cartIds = carts.map((cart)=> cart.id);
  if (!cartIds?.length) return [];
  
  try {
    const {rows: products} = await client.query(`
      SELECT products.*, cart_products.quantity, cart_products.id AS "cartProductId", cart_products.cart_id
      FROM products
      JOIN cart_products ON cart_products.product_id = products.id
      WHERE cart_products.cart_id IN (${binds});
    `,
      cartIds
    ); 

    for (const cart of cartsToReturn) {
      const productsToAdd = products.filter(
        (product) => product.cart_id === cart.id)
        cart.products = productsToAdd;
    }
    console.log("cart to return", cartsToReturn)
    return cartsToReturn;
  
  } catch (error) {
    throw error
  }
  }
  
  async function updateCartProducts(){
  
  }
  
  
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

module.exports = { deleteProductFromCart, attachProductsToCart };
