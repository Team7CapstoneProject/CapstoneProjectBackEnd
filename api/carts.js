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

//GET CART_PRODUCTS
//GET /api/carts/:cart_id/cart_products
cartRouter.get("/:cartId/cart_products", async (req, res, next) => {
  const { cartId } = req.params;

  try {
    if (!cartId) {
      res.status(400);
      return next({
        name: "CartIdError",
        message: `There is no cart id.`,
        error: "CartIdError",
      });
    } else {
      const cartProducts = await getCartProductByCart(cartId);
      if (cartProducts) {
        res.send(cartProducts);
      } else {
        res.status(400);
        return next({
          name: "FetchCartProductError",
          message: `Error fetching cart products.`,
          error: "FetchCartProductError",
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

//ADD PRODUCT TO CART : WORKING
//POST /api/carts/:cart_id/products------------------------------------------------
cartRouter.post("/:cart_id/products", requireUser, async (req, res, next) => {
  const { cart_id } = req.params;
  const { product_id, quantity } = req.body;

  try {
    const cartArray = await getCartProductByCart(cart_id);
    let exists = false;

    cartArray.forEach((cart_product) => {
      if (cart_product.product_id === product_id) {
        exists = true;
      }
    });

    if (exists) {
      res.status(409);
      return next({
        name: "ProductExistsInCartError",
        message: `Product with ID ${product_id} already exists in cart with ID ${cart_id}.`,
        error: "ProductExistsInCartError",
      });
    } else {
      await addProductToCart({
        cart_id,
        product_id,
        quantity,
      });

      let cart = await getCartById(cart_id);
      res.send(cart);
    }
  } catch (error) {
    throw error;
  }
});

//attach product to cart
// cartRouter.post("/:cart_id/products", requireUser, async (req, res, next) => {
//   const { cart_id } = req.params;
//   const { product_id } = req.body;

//   const cartArray = await getCartProductByCart(cart_id);
//   console.log(cartArray, "this is cart array");
//   let exists = false;

//   cartArray.forEach((cart_product) => {
//     if (cart_product.product_id === product_id) {
//       exists = true;
//     }
//   });
//   try {
//     if (exists) {
//       res.status(400);
//       return next({
//         name: "ProductExistsInCartError",
//         message: `Product with ID ${product_id} already exists in cart with ID ${cart_id}`,
//         error: "ProductExistsInCartError",
//       });
//       //Else it adds the product to the cart.
//     } else {
//       let addedProductToCart = await attachProductsToCart({
//         cartArray
//       });

//       res.send(addedProductToCart);
//     }
//   } catch (error) {
//     throw error;
//   }
// });

//CREATES NEW CART : WORKING
// POST /api/carts/:userId ---------------------------------------------------------
cartRouter.post("/:user_id", async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const cart = await createCart({ user_id });

    if (cart) {
      res.send(cart);
    } else {
      res.status(400);
      return next({
        name: "CreateCartError",
        message: `Error creating cart.`,
        error: "CreateCartError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET MY CART BY EMAIL : WORKING
// GET /api/carts/myCartByEmail ---------------------------------------------------------
cartRouter.get("/myCartByEmail", requireUser, async (req, res, next) => {
  try {
    let email = req.user.email;
    if (email) {
      const cart = await getCartByEmail(email);
      if (cart) {
        res.send(cart);
      } else {
        res.status(400);
        return next({
          name: "FetchCartError",
          message: `Error fetching cart.`,
          error: "FetchCartError",
        });
      }
    } else {
      res.status(401);
      return next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action.",
        error: "MissingUserError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET MY CART BY USER ID: WORKING
// GET /api/carts/myCartByUserId---------------------------------------------------------
cartRouter.get("/myCartByUserId", requireUser, async (req, res, next) => {
  try {
    let user_id = req.user.id;
    if (user_id) {
      const cart = await getCartsByUserId(user_id);
      if (cart) {
        res.send(cart);
      } else {
        res.status(400);
        return next({
          name: "FetchCartError",
          message: `Error fetching cart.`,
          error: "FetchCartError",
        });
      }
    } else {
      res.status(401);
      return next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action.",
        error: "MissingUserError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//UPDATE CART COMPLETION : WORKING
// PATCH /api/carts/:cart_id ---------------------------------------------------------
cartRouter.patch("/:cart_id", requireUser, async (req, res, next) => {
  const { cart_id } = req.params;
  try {
    let updatedCartCompletion = await updateCartCompletion(cart_id);
    if (updatedCartCompletion) {
      res.send(updatedCartCompletion);
    } else {
      res.status(400);
      return next({
        name: "CompletingCartError",
        message: `Error completing cart.`,
        error: "CompletingCartError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//DELETE CART : WORKING
//DELETE /api/carts/:cartId----------------------------------------------------
cartRouter.delete("/:cartId", requireUser, async (req, res, next) => {
  const { cartId } = req.params;

  try {
    let cart = await getCartById(cartId);
    if (cart) {
      let cartOwner = cart[0].user_id;
      if (cartOwner !== req.user.id) {
        res.status(403);
        return next({
          name: "OwnerUserError",
          message: `User ${req.user.first_name} is not allowed to delete cart with ID ${cartId}`,
          error: "OwnerUserError",
        });
      } else {
        await deleteCart(cartId);
        //THE NEXT 3 LINES CAN BE DELETED IF THE PROBLEM BELOW IS RESOLVED.
        res.send({
          message: `Cart ${cartId} has been deleted`,
        });

        //THE NEXT FEW LINES CHECKS IF THE CART HAS BEEN DELETED.
        //TURNS OUT THAT THE CART IS DELETED BUT BECAUSE PRODUCTS
        //WERE ATTACHED TO IT, THE CART STILL EXISTS BUT ONLY WITH
        //THE ARRAY OF PRODUCTS IN IT. THIS MIGHT CAUSE ISSUES LATER.

        // let _cart = await getCartById(cartId);
        // if (!_cart) {
        //   res.send({
        //     message: `Cart ${cartId} has been deleted`,
        //   });
        // } else {
        //   return next({
        //     name: "DeleteCartError",
        //     message: `Failed to delete cart.`,
        //     error: "DeleteCartError",
        //   });
        // }
      }
    } else {
      res.status(400);
      return next({
        name: "CartExistError",
        message: `Cart does not exist`,
        error: "CartExistError",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = cartRouter;
