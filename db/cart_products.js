const client = require("./client");

async function attachProductsToCart(cart){
const cartToReturn = [...cart]
const binds = cart.map((_, index)=> `$${index + 1}`).join(", ")
const cartIds = cart.map((cart)=> cart.id);
if (!cartIds?.length) return [];

try {
  const {rows: products} = await client.query()

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

module.exports = { deleteProductFromCart };
