const express = require("express");
const { getAllCarts } = require("../db");
const cartRouter = express.Router();
const { createCart } = require("../db");

const { requireUser } = require("./utils");

//POST /api/cart/:userId ---------------------------------------------------------
// cartRouter.post("/:user_id", requireUser, async (req, res, next) => {
//   const { user_id } = req.params;


// const allUserCarts = await getAllCarts()
// const userCarts = allUserCarts.filter((cart)=>cart.user_id=user_id)

// if(!userCarts.length>1){}

//   if(req.body)



//   try {
//     const cart = await createCart({user_id});

//     res.send({
//       cart
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

//POST /

module.exports = cartRouter;
