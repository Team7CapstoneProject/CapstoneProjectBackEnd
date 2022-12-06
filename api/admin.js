const express = require("express");
const adminRouter = express.Router();
const { requireAdmin, requireUser } = require("./utils");
const {
  createProduct,
  deleteProduct,
  deleteUser,
  getAllCarts,
  getAllProducts,
  getAllUsers,
  getProductById,
  getProductByName,
  getUserById,
  updateProduct,
  updateUser,
} = require("../db");

//POST A PRODUCT : WORKING
//POST /api/admin/products-------------------------------------------------------------
adminRouter.post("/products", requireAdmin, async (req, res, next) => {
  let {
    name,
    description,
    price,
    image_url,
    inventory,
    on_sale,
    sale_percentage,
  } = req.body;

  try {
    const existingProduct = await getProductByName(name);

    if (existingProduct) {
      res.status(409);
      return next({
        name: "ProductExistsError",
        message: `A product ${name} already exists.`,
        error: "ProductExistsError",
      });
    }

    if (on_sale === false) {
      sale_percentage = null;
    }

    if (sale_percentage && (sale_percentage > 100 || sale_percentage < 0)) {
      res.status(400);
      return next({
        name: "SalePercentageError",
        message: `Sale percentage must be between 0-100.`,
        error: "SalePercentageError",
      });
    }

    const product = await createProduct({
      name,
      description,
      price,
      image_url,
      inventory,
      on_sale,
      sale_percentage,
    });

    res.send({ message: `${name} successfully posted!`, product });
  } catch (error) {
    throw error;
  }
});

//GET ALL CARTS : WORKING
//GET /api/admin/cart-----------------------------------------------------------------

adminRouter.get("/carts", requireAdmin, async (req, res, next) => {
  try {
    const allCarts = await getAllCarts();

    if (allCarts) {
      res.send(allCarts);
    } else {
      res.status(400);
      return next({
        name: "AllCartsError",
        message: "Error fetching all carts.",
        error: "AllCartsError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET ALL PRODUCTS : WORKING
//GET /api/admin/products-----------------------------------------------------------------

adminRouter.get("/products", requireAdmin, async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    if (allProducts) {
      res.send(allProducts);
    } else {
      res.status(400);
      return next({
        name: "AllProductsError",
        message: "Error fetching all products.",
        error: "AllProductsError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET ALL USERS : WORKING
//GET /api/admin/users-----------------------------------------------------------
adminRouter.get("/users", requireUser, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();
    if (allUsers) {
      res.send(allUsers);
    } else {
      res.status(400);
      return next({
        name: "AllUsersError",
        message: "Error fetching all users.",
        error: "AllUsersError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//PROMOTE USER TO ADMIN: WORKING
//PATCH /api/admin/user/:userId--------------------------------------------------
adminRouter.patch("/user/:userId", requireAdmin, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(400);
      next({
        name: "UserNotFoundError",
        message: `User with ID ${userId} not found.`,
        error: "UserNotFoundError",
      });
    } else {
      const updateFields = {};
      updateFields.first_name = user.first_name;
      updateFields.last_name = user.last_name;
      updateFields.password = user.password;
      updateFields.email = user.email;
      updateFields.is_admin = true;

      const promotedUser = await updateUser(userId, updateFields);
      res.send({
        message: `User ${user.first_name} successfully promoted!`,
        promotedUser,
      });
    }
  } catch (error) {
    throw error;
  }
});

//UPDATE PRODUCT : WORKING
//PATCH /api/admin/products/:productId--------------------------------------------------
adminRouter.patch(
  "/products/:productId",
  requireAdmin,
  async (req, res, next) => {
    const { productId } = req.params;
    let {
      name,
      description,
      price,
      image_url,
      inventory,
      on_sale,
      sale_percentage,
    } = req.body;

    try {
      //Checks to see if the product exists in the first place. If not then throw error message.
      const product = await getProductById(productId);

      if (!product) {
        res.status(400);
        next({
          name: "ProductNotFoundError",
          message: `Product with ID ${productId} not found.`,
          error: "ProductNotFoundError",
        });
      }

      //Goes through all the products first and filters out the un-edited name of the product. This results in a new array with every other product that does not include itself. The reason why we're excluding itself is because the name of the product is a unique key in the database. If we don't exclude itself, then updating the product but not updating the product name will error itself out.
      let allProducts = await getAllProducts();
      let filteredProducts = allProducts.filter(
        (singleProduct) => singleProduct.name !== product.name
      );

      //Goes through the filtered products and checks to see if the edited name of the product is the same as the name of an existing product. If it's the same then the product already exists and throws an error. If no error pops up, then the code proceeds.
      filteredProducts.filter((singleProduct) => {
        if (singleProduct.name === name) {
          res.status(409);
          return next({
            name: "ProductExistsError",
            message: `A product ${name} already exists.`,
            error: "ProductExistsError",
          });
        }
      });

      //If the product is not on sale, then it sets the sale percentage to null
      if (on_sale === false) {
        sale_percentage = null;
      }

      //If the product is on sale, it checks if sale percentage is within 0-100
      if (sale_percentage && (sale_percentage > 100 || sale_percentage < 0)) {
        res.status(400);
        return next({
          name: "SalePercentageError",
          message: `Sale percentage must be between 0-100.`,
          error: "SalePercentageError",
        });
      }

      //If no error has come up to this point, all the fields update to the new product information.
      const updateFields = {};
      updateFields.name = name;
      updateFields.description = description;
      updateFields.price = price;
      updateFields.image_url = image_url;
      updateFields.inventory = inventory;
      updateFields.on_sale = on_sale;
      updateFields.sale_percentage = sale_percentage;

      //Product updates with new information and sends a success message.
      const updatedProduct = await updateProduct(productId, updateFields);
      res.send({
        message: `Product ${name} successfully updated!`,
        updatedProduct,
      });
    } catch (error) {
      throw error;
    }
  }
);

//DELETE PRODUCT : WORKING
//DELETE /api/admin/products/:productId------------------------------------------------
adminRouter.delete(
  "/products/:productId",
  requireAdmin,
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await getProductById(productId);
      if (product) {
        await deleteProduct(productId);
        const _product = await getProductById(productId);
        if (!_product) {
          res.send({ message: `Product ${productId} was deleted.`, product });
        } else {
          res.status(400);
          return next({
            name: "ProductFailedToDeleteError",
            message: `Failed to delete product.`,
            error: "ProductFailedToDeleteError",
          });
        }
      } else {
        res.status(400);
        return next({
          name: "ProductNotFoundError",
          message: `Product not found.`,
          error: "ProductNotFoundError",
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

//DELETE USER ACCOUNT : WORKING
//DELETE /api/admin/users/:userId-----------------------------------------------------
adminRouter.delete("/users/:userId", requireAdmin, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);

    if (user) {
      await deleteUser(userId);
      let _user = await getUserById(userId);
      if (!_user) {
        delete user.password;
        res.send({
          message: `User ${userId} has been deleted`,
          user,
        });
      } else {
        res.status(400);
        return next({
          name: "UserDeleteError",
          message: "Failed to delete user",
          error: "UserDeleteError",
        });
      }
    } else {
      res.status(400);
      return next({
        name: "UserNotFoundError",
        message: "This user does not exist",
        error: "UserNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = adminRouter;
