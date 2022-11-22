const client = require("./client");

async function createUser({
  first_name,
  last_name,
  password,
  email,
  is_admin,
}) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(first_name, last_name, password, email, is_admin)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;`,
      [first_name, last_name, password, email, is_admin]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT * 
        FROM users
        WHERE id=${id}`);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { createUser, getUserById };
