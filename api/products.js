const express = require("express");
const productsRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllProducts, getProductById } = require("../db");

//GET /api/products/-----------------------------------------------------
productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    res.send(allProducts);
  } catch (error) {
    next(error);
  }
});

//POST /api/products/:productId-----------------------------------------------------
productsRouter.get("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const product = await getProductById(productId);

  try {
    if (product) {
      res.send(product);
    } else {
      res.send({
        name: "ProductNotFoundError",
        message: `Product with ID ${productId} not found.`,
        error: "ProductNotFoundError",
      });
    }

    res.send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
