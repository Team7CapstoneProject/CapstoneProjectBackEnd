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

async function getAllUsers() {
  try {
    const { rows: userIds } = await client.query(`
        SELECT id
        FROM users`);

    const users = await Promise.all(
      userIds.map((user) => getUserById(user.id))
    );

    return users;
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
        WHERE id=${userId}`);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${userId}
        RETURNING *`,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    await client.query(`
        DELETE
        from cart
        WHERE user_id=${userId}
        RETURNING *`);

    await client.query(`
        DELETE
        from users
        WHERE id=${userId}
        RETURNING *`);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
