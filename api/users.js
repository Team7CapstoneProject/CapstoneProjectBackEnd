const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

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

//POST /api/users/register-----------------------------------------------------

usersRouter.post("/register", async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

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
        message: "Password Too Short!",
        error: "This is the error message",
      });
    }

    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
    });

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

module.exports = usersRouter;
