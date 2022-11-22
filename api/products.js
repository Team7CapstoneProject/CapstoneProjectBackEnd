const express = require('express');
const productsRouter = express.Router();

//need to add an async here?
productsRouter.use((req, res, next) => {
    console.log("a request is being made to /products")
    next()
  })

  productsRouter.get("/products", (req, res) => {
    res.send(`
    <h1>Products page</h1>
    `)
  })
  module.exports = productsRouter