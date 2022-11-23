const express = require("express");
const adminRouter = express.Router();
const { requireAdmin } = require("./utils");
const { getAllProducts, getProductById, updateProduct } = require("../db");


//GET /api/admin/products
adminRouter.get("/products", requireAdmin, async (req, res, next) => {
    try {
      const allProducts = await getAllProducts();
  
      res.send(allProducts);
    } catch (error) {
      next(error);
    }
  });

//PATCH /api/admin/product/:productId---------------------------------------------------
adminRouter.patch("/product/:productId", requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, image_url, inventory } = req.body;
  const product = await getProductById(productId);

  const  updateFields = {}
  updateFields.name = name
  updateFields.description = description
  updateFields.price = price
  updateFields.image_url = image_url
  updateFields.inventory = inventory

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
});

module.exports = adminRouter;
