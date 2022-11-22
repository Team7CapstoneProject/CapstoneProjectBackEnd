const express = require('express');

const apiRouter = express.Router();

//add other routers here later
const productsRouter = require("./products")
apiRouter.use("/products", productsRouter)

apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });

module.exports = apiRouter;