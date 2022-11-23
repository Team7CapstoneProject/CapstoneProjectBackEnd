const {
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  createProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,
} = require("./index");
const client = require("./client");

async function dropTables() {
  try {
    console.log("Dropping all Tables...");

    await client.query(`
            DROP TABLE IF EXISTS cart_products;
            DROP TABLE IF EXISTS cart;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
            `);
    console.log("finished dropping tables...");
  } catch (error) {
    console.error("error dropping tables...");
    throw error;
  }
}

//may need to add a category table for higher tier and link category tags to products
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(225) NOT NULL,
            last_name VARCHAR(225) NOT NULL,
            password VARCHAR(225) NOT NULL,
            email VARCHAR(225) UNIQUE NOT NULL,
            is_admin BOOLEAN DEFAULT false 
            );

        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(225) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price INTEGER,
            image_url VARCHAR(225) NOT NULL,
            inventory INTEGER 
        );

        CREATE TABLE cart(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            is_complete BOOLEAN DEFAULT false
        );
        CREATE TABLE cart_products(
            id SERIAL PRIMARY KEY, 
            cart_id INTEGER REFERENCES cart(id) NOT NULL, 
            product_id INTEGER REFERENCES products(id) NOT NULL, 
            quantity INTEGER 
        );
        `);
    console.log("finished building tables...");
  } catch (error) {
    console.error("error building tables...");
    throw error;
  }
}

//function for making our test admin % regular user
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");
    const admin = await createUser({
      first_name: "admin",
      last_name: "admin",
      password: "admin",
      email: "admin@gmail.com",
      is_admin: true,
    });
    const user = await createUser({
      first_name: "user",
      last_name: "user",
      password: "user",
      email: "user@gmail.com",
      is_admin: false,
    });

    // console.log(admin, "this is admin");
    // console.log(user, "this is user");

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

//function for making mock products for testing
async function createInitialProducts() {
  try {
    console.log("Starting to create products...");
    const guitar = await createProduct({
      name: "guitar",
      description: "test",
      price: 100.0,
      image_url: "www.testurl.com",
      inventory: 1,
    });
    const piano = await createProduct({
      name: "piano",
      description: "test",
      price: 1000.0,
      image_url: "www.testurl.com",
      inventory: 1,
    });
    const violin = await createProduct({
      name: "violin",
      description: "test",
      price: 500.0,
      image_url: "www.testurl.com",
      inventory: 1,
    });

    // console.log(guitar, "this is guitar");
    // console.log(piano, "this is piano");
    // console.log(violin, "this is violin");

    console.log("Finished creating products");
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("starting to test database...");

    // console.log("Calling getUser");
    const user = await getUser({
      email: "admin@gmail.com",
      password: "admin",
    });
    // console.log("Result getUser", user);

    // console.log("Calling getUserByEmail");
    const _user = await getUserByEmail("admin@gmail.com");
    // console.log("Result getUserByEmail", _user);

    // console.log("Calling getAllUsers");
    const users = await getAllUsers();
    // console.log("Result getAllUsers", users);

    // console.log("Calling getUserById");
    const singleUser = await getUserById(1);
    // console.log("Result getUserById", singleUser);

    // console.log("Calling updateUser");
    const updatedUser = await updateUser(1, {
      first_name: "Jong Un",
      last_name: "Kim",
      email: "thisemail@gmail.com",
    });
    // console.log("Result updateUser", updatedUser);

    // console.log("Calling getAllProducts");
    const products = await getAllProducts();
    // console.log("Result getAllProducts", products);

    // console.log("Calling getProductById")
    const product = await getProductById(1);
    // console.log("Result getProductById", product)

    // console.log("Calling getProductByName")
    const productName = await getProductByName("violin");
    // console.log("Result getProductByName", productName)

    // console.log("Calling updateProduct");
    const updatedProduct = await updateProduct(1, {
      name: "banjo",
      description: "a nice banjo",
      price: 100,
      image_url: "www.anotherImageUrl.com",
      inventory: 5,
    });
    // console.log("Result updateProduct", updatedProduct);

    console.log("finished database test....");
  } catch (error) {
    console.error("error testing database...");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
