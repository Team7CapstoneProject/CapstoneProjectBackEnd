const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const {
  getUserByEmail,
  createUser,
  getUser,
  deleteUser,
  getUserById,
} = require("../db");

//LOGIN USER : WORKING
//POST /api/users/login-----------------------------------------------------
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password",
    });
  }
  try {
    const user = await getUser({ email, password });

    if (user) {
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({ message: "you're logged in!", token, user });
      return token;
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    throw error;
  }
});

//REGISTER USER : WORKING
//POST /api/users/register-----------------------------------------------------
usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, password, is_admin } = req.body;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    next({
      name: "UserExistsError",
      message: `User with email ${email} is already taken.`,
    });
  }

  try {
    if (password.length < 8) {
      next({
        name: "PasswordError",
        message: "Password must be 8 characters or more.",
        error: "This is the error message",
      });
    }

    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
      is_admin,
    });

    if (!user.error) {
      console.log(`${first_name} has successfully registered an account`);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch (error) {
    throw error;
  }
});

//GET MY ACCOUNT INFO : WORKING
//GET /api/users/me-----------------------------------------------------
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    throw error;
  }
});

//GET USER BY USER ID : WORKING
//GET /api/users/:userId--------------------------------------------------------
usersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await getUserById(userId);

  try {
    if (user) {
      res.send(user);
    } else {
      res.send({
        name: "UserNotFoundError",
        message: `User with ID ${userId} not found.`,
        error: "UserNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//DELETE MY ACCOUNT : WORKING
//DELETE /api/users/me-----------------------------------------------------
usersRouter.delete("/me", requireUser, async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.send({
      message: `User with ID ${req.user.id} has been deleted`,
    });
  } catch (error) {
    throw error;
  }
});

module.exports = usersRouter;
