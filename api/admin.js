const express = require("express");
const adminRouter = express.Router();
const { requireAdmin } = require("./utils");
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
      res.status(400);
      return next({
        name: "ProductExistsError",
        message: `A product with name "${name}" already exists`,
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

    res.send(product);
  } catch (error) {
    throw error;
  }
});

//GET ALL CARTS : WORKING
//GET /api/admin/cart-----------------------------------------------------------------

adminRouter.get("/carts", requireAdmin, async (req, res, next) => {
  try {
    const allCarts = await getAllCarts();

    res.send(allCarts);
  } catch (error) {
    next(error);
  }
});

//GET ALL PRODUCTS : WORKING
//GET /api/admin/products-----------------------------------------------------------------

adminRouter.get("/products", requireAdmin, async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    res.send(allProducts);
  } catch (error) {
    next(error);
  }
});

//GET ALL USERS : WORKING
//GET /api/admin/users-----------------------------------------------------------
adminRouter.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.send(allUsers);
  } catch (error) {
    next(error);
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
    const product = await getProductById(productId);

    if (on_sale === false) {
      sale_percentage = null;
    }

    if (sale_percentage && (sale_percentage > 100 || sale_percentage < 0)) {
      res.status(400);
      return next({
        name: "SalePercentageError",
        message: `Sale percentage must be between 0-100.`,
      });
    }

    const updateFields = {};
    updateFields.name = name;
    updateFields.description = description;
    updateFields.price = price;
    updateFields.image_url = image_url;
    updateFields.inventory = inventory;
    updateFields.on_sale = on_sale;
    updateFields.sale_percentage = sale_percentage;

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

//DELETE PRODUCT : WORKING
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

//DELETE USER ACCOUNT : WORKING
//DELETE /api/admin/users/:userId-----------------------------------------------------
adminRouter.delete("/users/:userId", requireAdmin, async (req, res, next) => {
  const {userId} = req.params
  try {
    await deleteUser(userId);
    res.send({
      message: `User with ID ${userId} has been deleted`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = adminRouter;
