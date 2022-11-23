const express = require("express");
const adminRouter = express.Router();
const { requireAdmin } = require("./utils");
const {
  getAllProducts,
  getProductById,
  updateProduct,
  getProductByName,
  createProduct,
  getAllUsers,
  getUserById,
  deleteProduct,
  getAllCarts,
} = require("../db");

//GET /api/admin/users-------------------------------------------------------------
adminRouter.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

//GET /api/admin/users/:userId--------------------------------------------------------
adminRouter.get("/users/:userId", requireAdmin, async (req, res, next) => {
  const { userId } = req.params;
  const user = await getUserById(userId);

  try {
    if (user) {
      res.send(user);
    } else {
      res.send({
        name: "UserNotFoundError",
        message: `User with ID ${userId} not found.`,
        error: "UserNotFoundError",
      });
    }
  } catch (error) {
    next(error);
  }
});

//POST /api/admin/products-------------------------------------------------------------
adminRouter.post("/products", requireAdmin, async (req, res, next) => {
  const { name, description, price, image_url, inventory } = req.body;

  const existingProduct = await getProductByName(name);
  if (existingProduct) {
    next({
      name: "ProductExistsError",
      message: `A product with name "${name}" already exists`,
    });
  }

  try {
    const product = await createProduct({
      name,
      description,
      price,
      image_url,
      inventory,
    });

    res.send(product);
  } catch (error) {
    next(error);
  }
});

//GET /api/admin/products
adminRouter.get("/products", requireAdmin, async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    res.send(allProducts);
  } catch (error) {
    next(error);
  }
});

//PATCH /api/admin/products/:productId--------------------------------------------------
adminRouter.patch(
  "/products/:productId",
  requireAdmin,
  async (req, res, next) => {
    const { productId } = req.params;
    const { name, description, price, image_url, inventory } = req.body;
    const product = await getProductById(productId);

    const updateFields = {};
    updateFields.name = name;
    updateFields.description = description;
    updateFields.price = price;
    updateFields.image_url = image_url;
    updateFields.inventory = inventory;

    try {
      if (!product) {
        next({
          name: "ProductNotFoundError",
          message: `Product with ID ${productId} not found.`,
          error: "ProductNotFoundError",
        });
      } else {
        const updatedProduct = await updateProduct(productId, updateFields);
        res.send(updatedProduct);
      }
    } catch (error) {
      throw error;
    }
  }
);

//DELETE /api/admin/products/:productId------------------------------------------------
adminRouter.delete(
  "/products/:productId",
  requireAdmin,
  async (req, res, next) => {
    const { productId } = req.params;
    const product = await getProductById(productId);

    try {
      if (product) {
        await deleteProduct(productId);
        res.send(`Product with ID "${productId}" was deleted.`);
      } else {
        res.send({
          name: "ProductNotFoundError",
          message: `Product with ID ${productId} not found.`,
          error: "ProductNotFoundError",
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

//GET /api/admin/cart -----------------------------------------------------------------

adminRouter.get("/cart", requireAdmin, async (res, req, next) => {
  try {
    const allCarts = await getAllCarts();

    res.send(allCarts);
  } catch (error) {
    next(error);
  }
});

module.exports = adminRouter;
