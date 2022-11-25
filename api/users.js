const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const { getUserByEmail, createUser, getUser } = require("../db");

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
    console.log(error);
    next(error);
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//GET MY ACCOUNT INFO : WORKING
//GET /api/users/me-----------------------------------------------------
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
