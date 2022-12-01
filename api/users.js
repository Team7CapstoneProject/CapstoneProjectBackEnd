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

  try {
    if (!email || !password) {
      res.status(400);
      return next({
        name: "MissingCredentialsError",
        message: "Please supply both an email and password.",
        error: "MissingCredentialsError",
      });
    }

    const userEmailCheck = await getUserByEmail(email);
    if (!userEmailCheck) {
      res.status(403);
      return next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect.",
        error: "IncorrectCredentialsError",
      });
    }

    const user = await getUser({ email, password });
    if (user) {
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({ message: `Welcome back, ${user.first_name}`, token, user });
      return token;
    } else {
      res.status(403);
      return next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect.",
        error: "IncorrectCredentialsError",
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

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(409);
      return next({
        name: "UserExistsError",
        message: `User with email ${email} is already taken.`,
        error: "UserExistsError",
      });
    }
    if (password.length < 8) {
      res.status(400);
      return next({
        name: "PasswordError",
        message: "Password must be 8 characters or more.",
        error: "PasswordError",
      });
    }

    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
      is_admin,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    const _user = await getUserByEmail(email);

    if (_user) {
      res.send({
        message: `Hey ${_user.first_name}! Thanks for signing up!`,
        token,
        user,
      });
    } else {
      res.status(400);
      return next({
        name: "UserRegisterError",
        message: "Registration failed.",
        error: "UserRegisterError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET MY ACCOUNT INFO : WORKING
//GET /api/users/me-----------------------------------------------------
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    if (req.user) {
      delete req.user.password;
      res.send(req.user);
    } else {
      res.status(401);
      return next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action.",
        error: "MissingUserError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//GET USER BY USER ID : WORKING
//GET /api/users/:userId--------------------------------------------------------
usersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  
  try {
    const user = await getUserById(userId);

    if (user) {
      res.send(user);
    } else {
      res.status(400);
      return next({
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
    if (req.user.id) {
      await deleteUser(req.user.id);
      let _user = await getUserById(req.user.id);
      if (!_user) {
        res.send({
          message: `Your account has been deleted.`,
        });
      } else {
        res.status(400);
        return next({
          name: "UserDeleteError",
          message: "Failed to delete user.",
          error: "UserDeleteError",
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

module.exports = usersRouter;
