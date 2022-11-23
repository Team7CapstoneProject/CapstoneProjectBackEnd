const client = require("./client");

  async function addProductToCart({cart_id, product_id, quantity}){
    try {
      const {
        rows: [cart_product]
      } = await client.query(`
      INSERT INTO cart_products(cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id) DO NOTHING
      RETURNING *;
      `, [cart_id, product_id, quantity])

      return cart_product;
    } catch (error) {
      throw error;
    }
  }

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

  async function updateCartProductQuantity(id, quantity){
  try {
      const {
        rows: [cart_products]
      } = await client.query(`
      UPDATE cart_products
      SET quantity=$1
      WHERE id=$2
      RETURNING *
      `, [quantity, id]);
    
    return cart_products
  } catch (error) {
    throw error;
  }
  }
  
  

module.exports = { 
  addProductToCart,
  attachProductsToCart,
  deleteProductFromCart,  
  updateCartProductQuantity, };
