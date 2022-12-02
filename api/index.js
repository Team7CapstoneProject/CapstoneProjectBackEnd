const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

//AUTHENTICATION------------------------------------------------------
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

//ROUTES------------------------------------------------------
const adminRouter = require("./admin");
apiRouter.use("/admin", adminRouter);

const cartProductsRouter = require("./cart_products");
apiRouter.use("/cart_products", cartProductsRouter);

const cartsRouter = require("./carts");
apiRouter.use("/carts", cartsRouter);

const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

//ERROR HANDLING-----------------------------------------------------
apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    error: error.error,
  });
});

//ROUTER: /api/unknown
// apiRouter.get("/:any", async (req, res) => {
//   const { any } = req.params;
//   if (any) {
//     res.status(404);
//     res.send({ message: "Darn, we haven't invented this page yet" });
//   }
// });

module.exports = apiRouter;
