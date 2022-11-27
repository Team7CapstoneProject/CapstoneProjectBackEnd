const express = require("express");
const {
  canEditCartProduct,
  deleteCartProduct,
  getCartById,
  getCartProductById,
  updateCartProductQuantity,
} = require("../db");
const cartProductsRouter = express.Router();
const { requireUser } = require("./utils");




//DELETE PRODUCT FROM CART
//DELETE /api/cart_products/:productId


//UPDATE CART PRODUCT QUANTITY : WORKING
//PATCH /api/cart_products/:cartProductId------------------------------------------
cartProductsRouter.patch(
  "/:cartProductId",
  requireUser,
  async (req, res, next) => {
    const { cartProductId } = req.params;
    const { quantity } = req.body;

    const isCartOwner = await canEditCartProduct(cartProductId, req.user.id);

    const selectedCartProduct = await getCartProductById(cartProductId);
    const cart = await getCartById(selectedCartProduct.cart_id);
    const originalCartOwner = cart.user_id;
    console.log(
      `User with ID ${originalCartOwner} is the original cart owner. User with ID ${req.user.id} is trying to update cartProducts`
    );

    try {
      if (isCartOwner) {
        let updatedCartProduct = await updateCartProductQuantity(
          cartProductId,
          quantity
        );
        res.send(updatedCartProduct);
      } else {
        res.status(403);
        next({
          name: "OwnerUserError",
          message: `User with ID ${req.user.id} is not allowed to update cart owned by user with ID ${originalCartOwner}`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE CART PRODUCT : WORKING
//DELETE /api/cart_products/:cartProductId------------------------------------------
cartProductsRouter.delete(
  "/:cartProductId",
  requireUser,
  async (req, res, next) => {
    const { cartProductId } = req.params;

    const isCartOwner = await canEditCartProduct(cartProductId, req.user.id);

    const selectedCartProduct = await getCartProductById(cartProductId);
    const cart = await getCartById(selectedCartProduct.cart_id);
    const originalCartOwner = cart.user_id;
    console.log(
      `User with ID ${originalCartOwner} is the original cart owner. User with ID ${req.user.id} is trying to delete cartProducts. Is cart owner: ${isCartOwner}`
    );

    try {
      if (isCartOwner) {
        let deletedCartProduct = await deleteCartProduct(cartProductId);
        res.send(deletedCartProduct);
      } else {
        res.status(403);
        next({
          name: "OwnerUserError",
          message: `User with ID ${req.user.id} is not allowed to delete cart owned by user with ID ${originalCartOwner}`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = cartProductsRouter;
