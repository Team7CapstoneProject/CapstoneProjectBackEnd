const express = require("express");
const productsRouter = express.Router();
const { getAllProducts, getProductById } = require("../db");

//GET ALL PRODUCTS : WORKING
//GET /api/products/-----------------------------------------------------
productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    if (allProducts) {
      res.send(allProducts);
    } else {
      res.status(400);
      return next({
        name: "AllProductsError",
        message: `Error fetching all products.`,
        error: "ProductNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET PRODUCT BY PRODUCT ID : WORKING
//GET /api/products/:productId-----------------------------------------------------
productsRouter.get("/:productId", async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await getProductById(productId);

    if (product) {
      res.send(product);
    } else {
      res.status(400);
      return next({
        name: "ProductNotFoundError",
        message: `Product with ID ${productId} not found.`,
        error: "ProductNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = productsRouter;
