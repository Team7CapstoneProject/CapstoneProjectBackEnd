const client = require("./client");

async function createUser({ first_name, last_name, password, email }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(first_name, last_name, password, email)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;`,
      [first_name, last_name, password, email]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { createUser };
