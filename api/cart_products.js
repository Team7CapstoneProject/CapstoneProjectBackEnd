const express = require("express");
const cartProductsRouter = express.Router();
const { requireUser } = require("./utils");
const {
  canEditCartProduct,
  deleteCartProduct,
  getCartProductByCart,
  getCartProductById,
  updateCartProductQuantity,
} = require("../db");

// //GET CART_PRODUCTS
// //GET /api/cart_products/:cart_id
// cartProductsRouter.get("/:cartId", async (req, res, next) => {
//   const { cartId } = req.params;
//   const cartProducts = await getCartProductByCart(cartId);

//   res.send(cartProducts);
// });

//UPDATE CART PRODUCT QUANTITY : WORKING
//PATCH /api/cart_products/:cartProductId------------------------------------------
cartProductsRouter.patch(
  "/:cartProductId",
  requireUser,
  async (req, res, next) => {
    const { cartProductId } = req.params;
    const { quantity } = req.body;

    try {
      const isCartOwner = await canEditCartProduct(cartProductId, req.user.id);

      if (isCartOwner) {
        let updatedCartProduct = await updateCartProductQuantity(
          cartProductId,
          quantity
        );
        res.send(updatedCartProduct);
      } else {
        res.status(403);
        return next({
          name: "OwnerUserError",
          message: `User ${req.user.id} does not own this cart product`,
          error: "OwnerUserError",
        });
      }
    } catch (error) {
      throw error;
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
    try {
      const isCartOwner = await canEditCartProduct(cartProductId, req.user.id);

      if (isCartOwner) {
        await deleteCartProduct(cartProductId);

        let cartProduct = await getCartProductById(cartProductId);
        if (!cartProduct) {
          res.send({
            message: `Cart product ${cartProductId} has been deleted`,
          });
        } else {
          return next({
            name: "DeleteCartProductError",
            message: `Error deleting cart product.`,
            error: "DeleteCartProductError",
          });
        }
      } else {
        res.status(403);
        return next({
          name: "OwnerUserError",
          message: `User ${req.user.id} does not own this cart product`,
          error: "OwnerUserError",
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

module.exports = cartProductsRouter;
