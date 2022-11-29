const express = require("express");
const {
  addProductToCart,
  createCart,
  deleteCart,
  getCartByEmail,
  getCartById,
  getCartProductByCart,
  updateCartCompletion,
  getCartsByUserId,
} = require("../db");
const cartRouter = express.Router();
const { requireUser } = require("./utils");

//ADD PRODUCT TO CART : WORKING
//POST /api/carts/:cart_id/products------------------------------------------------
cartRouter.post("/:cart_id/products", requireUser, async (req, res, next) => {
  const { cart_id } = req.params;
  const { product_id, quantity } = req.body;

  const cartArray = await getCartProductByCart(cart_id);
  console.log(cartArray, "this is cart array");
  let exists = false;

  cartArray.forEach((cart_product) => {
    if (cart_product.product_id === product_id) {
      exists = true;
    }
  });
  try {
    if (exists) {
      res.status(400);
      return next({
        name: "ProductExistsInCartError",
        message: `Product with ID ${product_id} already exists in cart with ID ${cart_id}`,
        error: "ProductExistsInCartError",
      });
      //Else it adds the product to the cart.
    } else {
      let addedProductToCart = await addProductToCart({
        cart_id,
        product_id,
        quantity,
      });

      res.send(addedProductToCart);
    }
  } catch (error) {
    throw error;
  }
});


//CREATES NEW CART : WORKING
// POST /api/carts/:userId ---------------------------------------------------------
cartRouter.post("/:user_id", requireUser, async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const cart = await createCart({ user_id });
    res.send(cart);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//GET MY CART BY EMAIL : WORKING
// GET /api/carts/myCartByEmail ---------------------------------------------------------
cartRouter.get("/myCartByEmail", requireUser, async (req, res, next) => {
  try {
    let email = req.user.email;
    const cart = await getCartByEmail(email);
    console.log(cart, `this is all carts by ${req.user.first_name}`);
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

//GET MY CART BY USER ID: WORKING
// GET /api/carts/myCartByUserId---------------------------------------------------------
cartRouter.get("/myCartByUserId", requireUser, async (req, res, next) => {
  try {
    let user_id = req.user.id
    console.log(req.user, "this is req.user")
    const cart = await getCartsByUserId(user_id);
    console.log(cart, `this is all carts by ${req.user.first_name}`);
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

//UPDATE CART COMPLETION : WORKING
// PATCH /api/carts/:cart_id ---------------------------------------------------------
cartRouter.patch("/:cart_id", requireUser, async (req, res, next) => {
  const { cart_id } = req.params;
  try {
    let updatedCartCompletion = await updateCartCompletion(cart_id);
    res.send(updatedCartCompletion);
  } catch (error) {
    next(error);
  }
});

//DELETE CART : WORKING
//DELETE /api/carts/:cartId----------------------------------------------------
cartRouter.delete("/:cartId", requireUser, async (req, res, next) => {
  const { cartId } = req.params;

  let cart = await getCartById(cartId);
  let cartOwner = cart.user_id;

  try {
    if (cartOwner !== req.user.id) {
      res.status(403);
      next({
        name: "OwnerUserError",
        message: `User ${req.user.first_name} is not allowed to delete cart with ID ${cartId}`,
      });
    } else {
      let deletedCart = await deleteCart(cartId);
      res.send(deletedCart);
    }
  } catch (error) {
    throw error;
  }
});

module.exports = cartRouter;
