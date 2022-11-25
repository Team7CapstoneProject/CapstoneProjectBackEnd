const express = require("express");
const {
  getAllCarts,
  canEditCartProduct,
  getCartProductByCart,
  addProductToCart,
} = require("../db");
const cartRouter = express.Router();
const { requireUser } = require("./utils");

//ADD PRODUCT TO CART : NOT WORKING
//POST /api/carts/:cartId/products
cartRouter.post("/:cartId/products", requireUser, async (req, res, next) => {
  const { cartId } = req.params;
  const { product_id, quantity } = req.body;

  //Gets the cart and arrays all the products
  const cartArray = await getCartProductByCart(cartId);
  console.log(cartArray, "this is cart array")
  //Declare exists variable
  let exists = false;
  //Goes through all the products in the cart and checks if the product that's being put in already exists
  cartArray.forEach((cart_product) => {
    if (cart_product.product_id === product_id) {
      exists = true;
    }
  });
  try {
    //If the product already exists in the cart, it throws an error.
    if (exists) {
      return next({
        name: "ProductExistsInCartError",
        message: `Product with ID ${product_id} already exists in cart with ID ${cartId}`,
        error: "ProductExistsInCartError",
      });
      //Else it adds the product to the cart.
    } else {
      let addedProductToCart = await addProductToCart({
        cartId,
        product_id,
        quantity,
      });

      res.send(addedProductToCart);
    }
  } catch (error) {
    next();
  }
});

//POST /api/cart/:userId ---------------------------------------------------------
// cartRouter.post("/:user_id", requireUser, async (req, res, next) => {
//   const { user_id } = req.params;

// const allUserCarts = await getAllCarts()
// const userCarts = allUserCarts.filter((cart)=>cart.user_id=user_id)

// if(!userCarts.length>1){}

//   if(req.body)

//   try {
//     const cart = await createCart({user_id});

//     res.send({
//       cart
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

//POST /

module.exports = cartRouter;
