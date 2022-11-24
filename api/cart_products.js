const express = require("express");
const { getAllCarts } = require("../db");
const cartProductsRouter = express.Router();
const { createCart } = require("../db");

const { requireUser } = require("./utils");


//PATCH /api/cart_products/:cartProductId------------------------------------------

router.patch("/:cartProductId", requireUser, async (req, res, next) => {
    const { cartProductId } = req.params;
    const { product_id } = req.body;
  
    const fields = {};
    if (typeof product_id != "undefined") {
      fields.product_id = product_id;
  
      const routineOwner = await canEditRoutineActivity(
        routineActivityId,
        req.user.id
      );
  
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routineId = routineActivity.routineId;
      const routine = await getRoutineById(routineId);
      const routineName = routine.name;
  
      try {
        if (routineOwner) {
          let updatedRoutineActivity = await updateRoutineActivity({
            id: routineActivityId,
            ...fields,
          });
          res.send(updatedRoutineActivity);
        } else {
          res.status(403);
          next({
            name: "OwnerUserError",
            message: `User ${req.user.username} is not allowed to update ${routineName}`,
          });
        }
      } catch (error) {
        next(error);
      }
    }
  });


//DELETE /api/cart_products/:cartProductId------------------------------------------

