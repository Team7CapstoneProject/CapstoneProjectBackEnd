const {
  //USER FUNCTIONS----------

  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  getUserById,
  updateUser,

  //PRODUCT FUNCTIONS----------

  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  updateProduct,

  //CART FUNCTIONS----------

  addProductToCart,
  createCart,
  deleteCart,
  getAllCarts,
  getCartByEmail,
  getCartById,
  getCartsByUserId,
  updateCartCompletion,

  //CART PRODUCT FUNCTIONS----------

  // attachProductsToCart,
  canEditCartProduct,
  deleteCartProduct,
  getCartProductByCart,
  getCartProductById,
  updateCartProductQuantity,
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
    console.log("Finished dropping Tables!");
  } catch (error) {
    console.error("Error dropping Tables...");
    throw error;
  }
}

//may need to add a category table for higher tier and link category tags to products
async function createTables() {
  try {
    console.log("Starting to build Tables...");

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
            description TEXT,
            price DECIMAL,
            image_url VARCHAR(225),
            inventory INTEGER,
            on_sale BOOLEAN DEFAULT false,
            sale_percentage INTEGER
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
            UNIQUE (cart_id, product_id),
            quantity INTEGER 
        );
        `);
    console.log("Finished building Tables!");
  } catch (error) {
    console.error("Error building Tables...");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create Users...");
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
    const userForDeletion = await createUser({
      first_name: "userForDeletion",
      last_name: "userForDeletion",
      password: "userForDeletion",
      email: "userForDeletion@gmail.com",
      is_admin: false,
    });

    console.log("Finished creating Users!");
  } catch (error) {
    console.error("Error creating Users...");
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("Starting to create Products...");
    const guitar = await createProduct({
      name: "Fender Guitar",
      description: "test",
      price: 100.0,
      image_url: "https://res.cloudinary.com/dd92xuflc/image/upload/v1669835778/20221130_131343_f7rbcb.jpg",
      inventory: 1,
      on_sale: true,
      sale_percentage: 20,
    });
    const bassGuitar = await createProduct({
      name: "Bass Guitar",
      description: "The bassiest of bass guitars",
      price: 800.9,
      image_url: "www.testurl.com",
      inventory: 87,
      on_sale: true,
      sale_percentage: 90,
    });
    const piano = await createProduct({
      name: "Steinway Piano",
      description: "Sounds like angels farting",
      price: 1000.0,
      image_url: "www.testurl.com",
      inventory: 1,
      on_sale: false,
      sale_percentage: null,
    });
    const violin = await createProduct({
      name: "violin",
      description: "test",
      price: 500.0,
      image_url: "www.testurl.com",
      inventory: 1,
      on_sale: false,
      sale_percentage: 0,
    });
    const cello = await createProduct({
      name: "cello",
      description: "test",
      price: 800.0,
      image_url: "www.testurl.com",
      inventory: 8,
      on_sale: false,
      sale_percentage: 0,
    });

    // console.log(guitar, "this is guitar");
    // console.log(piano, "this is piano");
    // console.log(violin, "this is violin");
    // console.log(cello, "this is cello");

    console.log("Finished creating Products");
  } catch (error) {
    console.error("Error creating Products...");
    throw error;
  }
}

async function createInitialCarts() {
  try {
    console.log("Starting to create Carts...");
    const cart1 = await createCart({
      user_id: 1,
      // is_complete: false
    });
    const cart2 = await createCart({
      user_id: 2,
      // is_complete: false
    });
    const cart3 = await createCart({
      user_id: 3,
      // is_complete: true
    });

    console.log("Finished creating Carts!");
  } catch (error) {
    console.error("Error creating Carts...");
    throw error;
  }
}

async function createInitialCartProducts() {
  try {
    console.log("Starting to create CartProducts...");

    const cartProduct1 = await addProductToCart({
      cart_id: 1,
      product_id: 1,
      quantity: 1,
    });
    //cart 1, banjo, x1

    const cartProduct2 = await addProductToCart({
      cart_id: 1,
      product_id: 2,
      quantity: 2,
    });
    //cart 1, piano, x1

    const cartProduct3 = await addProductToCart({
      cart_id: 1,
      product_id: 3,
      quantity: 3,
    });
    //cart 1, violin, x3

    const cartProduct4 = await addProductToCart({
      cart_id: 2,
      product_id: 1,
      quantity: 1,
    });
    //cart 2, banjo, x4

    const cartProductForDeletion = await addProductToCart({
      cart_id: 2,
      product_id: 1,
      quantity: 1,
    });
    //cart 2, banjo, x4

    // console.log(cartProduct1)
    console.log("Finished creating CartProducts!");
  } catch (error) {
    console.error("Error creating CartProducts...");
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCarts();
    await createInitialCartProducts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    //USER TESTS---------------------------------------------------

    // console.log("Calling deleteUser");
    // const deletedUser = await deleteUser(3);
    // console.log("Result deleteUser should be undefined", deletedUser);

    // console.log("Calling getAllUsers");
    // const users = await getAllUsers();
    // console.log("Result getAllUsers", users);

    // console.log("Calling getUser");
    // const user = await getUser({
    //   email: "admin@gmail.com",
    //   password: "admin",
    // });
    // console.log("Result getUser", user);

    // console.log("Calling getUserByEmail");
    // const _user = await getUserByEmail("admin@gmail.com");
    // console.log("Result getUserByEmail", _user);

    // console.log("Calling getUserById");
    // const singleUser = await getUserById(1);
    // console.log("Result getUserById", singleUser);

    // console.log("Calling updateUser");
    // const updatedUser = await updateUser(1, {
    //   first_name: "Jong Un",
    //   last_name: "Kim",
    //   email: "thisemail@gmail.com",
    // });
    // console.log("Result updateUser", updatedUser);

    //PRODUCT TESTS---------------------------------------------------

    // console.log("calling deleteProduct")
    // const deletedProduct = await deleteProduct(4);
    // console.log("Result of deleteProduct should be undefined", deletedProduct)

    // console.log("Calling getAllProducts");
    // const products = await getAllProducts();
    // console.log("Result getAllProducts", products);

    // console.log("Calling getProductById")
    // const product = await getProductById(1);
    // console.log("Result getProductById", product)

    // console.log("Calling getProductByName")
    // const productName = await getProductByName("violin");
    // console.log("Result getProductByName", productName)

    // console.log("Calling updateProduct");
    // const updatedProduct = await updateProduct(1, {
    //   name: "banjo",
    //   description: "a nice banjo",
    //   price: 100,
    //   image_url: "www.anotherImageUrl.com",
    //   inventory: 5,
    //   on_sale: false,
    //   sale_percentage: 0
    // });
    // console.log("Result updateProduct", updatedProduct);

    //CART TESTS---------------------------------------------------

    // console.log("calling deleteCart")
    // const deletedCart = await deleteCart(3);
    // console.log("Result of deleteCart should be undefined", deletedCart)

    // console.log("Calling getAllCarts");
    // const allCarts = await getAllCarts();
    // console.log("Result getAllCarts", allCarts);
    // const productData = allCarts[0].products
    // console.log("product data for cart 1!!", productData)

    // console.log("calling getCartByEmail");
    // const cartByEmail = await getCartByEmail("user@gmail.com");
    // console.log("result getCartByEmail", cartByEmail);

    // console.log("calling getCartById");
    // const cartById = await getCartById(1);
    // console.log("result getCartById", cartById);

    // console.log("Calling getCartsByUserId");
    // const cartsByUserId = await getCartsByUserId(2);
    // console.log("Result getCartsByUserId", cartsByUserId);

    // console.log("calling updateCartCompletion");
    // const updateCart = await updateCartCompletion(2);
    // console.log("result updateCartCompletion", updateCart);

    //CART PRODUCT TESTS---------------------------------------------------

    console.log("Calling canEditCartProduct");
    const canEditIsTrue = await canEditCartProduct(1, 1);
    console.log("Result canEditCartProduct should be true?", canEditIsTrue);

    console.log("Calling canEditCartProduct");
    const canEditIsFalse = await canEditCartProduct(4, 1);
    console.log("Result canEditCartProduct should be false?", canEditIsFalse);

    // console.log("Calling deleteCartProduct");
    // const deletedCartProduct = await deleteCartProduct(4);
    // console.log("Result deleteCartProduct:", deletedCartProduct);
    // const deletedCartProductCheck = await getCartProductByCart(4);
    // console.log("check for cartProduct deleted:", deletedCartProductCheck)

    // console.log("Calling getCartProductByCart");
    // const cartProduct = await getCartProductByCart(1);
    // console.log("Result getCartProductByCart", cartProduct);

    // console.log("Calling getCartProductById");
    // const cartByProductId = await getCartProductById(1);
    // console.log("Result getCartProductById", cartByProductId);

    // console.log("Calling updateCartProduct...")
    // const updatedCartProducts = await updateCartProductQuantity(1, 4);
    // console.log("result of updateCartProduct", updatedCartProducts)

    console.log("Finished database test!");
  } catch (error) {
    console.error("Error testing database...");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
