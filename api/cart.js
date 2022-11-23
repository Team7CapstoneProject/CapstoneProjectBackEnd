const express = require("express");
const { getAllCarts } = require("../db");
const cartRouter = express.Router();

const { requireUser } = require("./utils");

//GET /api/:userId/cart --------------------------------------------------------- 
