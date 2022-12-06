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
      first_name: "Admin",
      last_name: "Admin",
      password: "admin",
      email: "admin",
      is_admin: true,
    });

    const guestUser = await createUser({
      first_name: "Guest",
      last_name: "Guest",
      password: "guestuser",
      email: "guestuser",
      is_admin: false,
    });

    const user = await createUser({
      first_name: "User",
      last_name: "User",
      password: "user",
      email: "user@gmail.com",
      is_admin: false,
    });

    const admin2 = await createUser({
      first_name: "Rebecca",
      last_name: "Baldwin",
      password: "admin",
      email: "becca@gmail.com",
      is_admin: true,
    });
    const admin3 = await createUser({
      first_name: "Isabella",
      last_name: "Pinkerman",
      password: "admin",
      email: "bella@gmail.com",
      is_admin: true,
    });
    const admin4 = await createUser({
      first_name: "Robby",
      last_name: "Bacus",
      password: "admin",
      email: "robby@gmail.com",
      is_admin: true,
    });
    const admin5 = await createUser({
      first_name: "Grant",
      last_name: "Foster",
      password: "admin",
      email: "grant@gmail.com",
      is_admin: true,
    });

    const katherine = await createUser({
      first_name: "Katherine",
      last_name: "Moss",
      password: "123abc",
      email: "kathy@kathy.net",
      is_admin: false,
    });
    const gus = await createUser({
      first_name: "Gustavo",
      last_name: "Lamont",
      password: "123abc",
      email: "gus@gus.net",
      is_admin: false,
    });
    const marcel = await createUser({
      first_name: "Marcel",
      last_name: "Greenwichivitz",
      password: "123abc",
      email: "marcel@marcel.net",
      is_admin: false,
    });
    const larry = await createUser({
      first_name: "Lary",
      last_name: "Dubvouski",
      password: "123abc",
      email: "lary@lary.net",
      is_admin: false,
    });
    const mia = await createUser({
      first_name: "Mia",
      last_name: "Thermopolis",
      password: "123abc",
      email: "mia@mia.net",
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
    const electricGuitar = await createProduct({
      name: "EPIPHONE LES PAUL TRADITIONAL PRO-III",
      description:
        "Les Paul's connection with Epiphone dates back to the after-hours work at their factory in the 1940s that led to his original Log solidbody design. Given that, it's no wonder this Les Paul Traditional Pro III is so tightly connected to that history. The Traditional Pro III is available in some cool new colors and comes packed with features that belie its price. Sustain and playability are guaranteed from its all-mahogany body and '60s profile neck. And you'll be proud of the way it looks too in the finish of your choice. Sound matters and you will be impressed by the power and versatility of the electronics found on this Epiphone Les Paul. With alnico humbuckers and coil-splitting via push/pull pots, you will be able to play any style and kick it into overdrive at the push of a knob when it's your turn to solo. If you are looking for an affordable starter electric, or a backup you can rely on at any gig, the Les Paul Traditional Pro III is a great choice. You will enjoy classic Les Paul sounds, as well as more modern tones. Case sold separately.",
      price: 600.99,
      image_url: "https://i.imgur.com/CBhhDSY.png",
      inventory: 0,
      on_sale: true,
      sale_percentage: 20,
    });
    const electricGuitar2 = await createProduct({
      name: "ACOUSTASONIC® PLAYER JAZZMASTER®",
      description:
        "Fender continues to explore the sonic possibilities of an acoustic-electric hybrid guitar with the Acoustasonic® Player Jazzmaster®. Purposefully streamlined and equally versatile, this guitar intuitively transitions from acoustic to electric voices with the 3-way switch, or from clean to driven with a turn of the Blend Knob. The Acoustasonic® Player Jazzmaster® delivers unlimited inspiration, versatility, and accessibility for the next generation of modern musicians.",
      price: 1199.99,
      image_url: "https://i.imgur.com/l6RFydk.png",
      inventory: 9,
      on_sale: false,
      sale_percentage: null,
    });
    const electricGuitar3 = await createProduct({
      name: "AMERICAN ULTRA STRATOCASTER® HSS",
      description:
        "American Ultra is our most advanced series of guitars and basses for discerning players who demand the ultimate in precision, performance and tone. The American Ultra Stratocaster HSS features a unique “Modern D” neck profile with Ultra rolled fingerboard edges for hours of playing comfort, and the tapered neck heel allows easy access to the highest register. A speedy 10”-14” compound-radius fingerboard with 22 medium-jumbo frets means effortless and accurate soloing, while the Ultra Noiseless™ Hot single-coil pickups and Ultra Double Tap™ humbucking pickup, along with advanced wiring options, provide endless tonal possibilities – without hum. The sculpted rear body contours are as beautiful as they are functional. This versatile, state-of-the-art instrument will inspire you to push your playing to new heights. Other features include sealed locking tuning machines, chrome hardware and bone nut. Includes premium molded hardshell case.",
      price: 2149.99,
      image_url: "https://i.imgur.com/ilajlxy.png",
      inventory: 253,
      on_sale: false,
      sale_percentage: null,
    });
    const bassGuitar = await createProduct({
      name: "CLASSIC VIBE BASS VI",
      description:
        "The Classic Vibe Bass VI is a faithful tribute to the secret weapon of producers and adventurous players that have dared to explore it since its original production from 1961 to 1975. Tuned an octave lower than a guitar and featuring a vintage-style tremolo, the Bass VI is the perfect companion to accompany any guitar or bass player into uncharted territory. Player-friendly features include a slim, comfortable “C”-shaped neck profile with an easy-playing 9.5”-radius fingerboard and narrow-tall frets, as well as a floating bridge with barrel saddles for solid string stability. This throwback Squier model also features 1960s-inspired headstock markings, rich-looking nickel-plated hardware and a slick vintage-tint gloss neck finish for an old-school vibe.",
      price: 499.99,
      image_url: "https://i.imgur.com/x2xzLqG.png",
      inventory: 800,
      on_sale: false,
      sale_percentage: 10,
    });
    const bassGuitar2 = await createProduct({
      name: "MONONEON JAZZ BASS® V",
      description:
        "The MonoNeon Jazz Bass® V features an alder body finished in an eye-popping neon yellow urethane finish, complemented by a neon orange painted headstock and pickguard. The 22-fret one-piece roasted maple neck features a 10”-14” compound radius fingerboard and elegant white pearl block inlays. Custom-wound Fireball™ 5-string Bass Humbucking pickups deliver fat, punchy tone while the 18v active preamp with 3-band EQ provides flexible tone-shaping for any style of music. The Fender HiMass™ string-through/top-load bridge provides increased resonance and sustain, and the gold hardware adds to the distinctive look of this stunning bass. Also Included are a MonoNeon sticker pack and custom headstock sock. The MonoNeon Jazz Bass V makes a statement – equal parts swagger and serious business.",
      price: 1549.99,
      image_url: "https://i.imgur.com/2XPDCfa.png",
      inventory: 323,
      on_sale: false,
      sale_percentage: 20,
    });
    const bassGuitar3 = await createProduct({
      name: "AMERICAN VINTAGE II 1954 PRECISION BASS®",
      description:
        "The Fender® American Vintage II series presents a remarkably accurate take on the revolutionary designs that altered the course of musical history. Built with period-accurate bodies, necks and hardware, premium finishes and meticulously voiced, year-specific pickups, each instrument captures the essence of authentic Fender craftsmanship and tone. The Precision Bass®, the world’s first electric bass, represents one of the most important developments in music history. For the first time, bass players had access to a portable, precisely intonated, amplified instrument. Although it initially shared many design cues with the Telecaster®, such as an oversized Tele® headstock, slab body and chrome control plate, by 1954, the P-Bass® had been updated with the same sweeping curves and contoured edges of the newly launched Stratocaster®. The American Vintage II 1954 Precision Bass reproduces the quintessential tone and feel of the original and is offered in two colors over ash: Vintage Blonde and 2-Color Sunburst mated to a single-ply white pickguard. Other key features include a substantial ‘54 “C”-shape maple neck with a 7.25” radius fingerboard and vintage tall frets. The Pure Vintage 2-saddle bridge with fiber saddles, reverse open-gear tuners, finger rest and '54 Single-Coil Precision Bass® pickup deliver classic Fender thump and style. The instruments in the American Vintage II series are direct descendants of the original Fenders: designed for players with a fine appreciation for vintage Fender tone and feel and built with unmatched quality, down to the last screw. These are Fender electrics in their purest form: Fender American Vintage II, the stuff of legends.",
      price: 1549.99,
      image_url: "https://i.imgur.com/e9uAfkn.png",
      inventory: 355,
      on_sale: false,
      sale_percentage: null,
    });
    const acousticGuitar = await createProduct({
      name: "TIM ARMSTRONG HELLCAT LEFT-HAND",
      description:
        "Available in a left-handed version (appropriately, considering its designer is a southpaw), the Tim Armstrong Hellcat is designed by its namesake, the founder of influential U.S. punk band Rancid. As a songwriter, Armstrong has always turned to his old Fender concert-style acoustic for inspiration. The Hellcat was based on that classic instrument, with modern appointments such as high-quality onboard electronics. A great guitar for pop, rock, folk and more, it has a solid mahogany top for a sweet sound and a satin-finish maple neck for smooth playability.",
      price: 459.99,
      image_url: "https://i.imgur.com/TKgrpSg.png",
      inventory: 409,
      on_sale: false,
      sale_percentage: null,
    });
    const acousticGuitar2 = await createProduct({
      name: "CD-60SCE DREADNOUGHT, ALL-MAHOGANY",
      description:
        "Combining powerful onboard electronics—including a built-in tuner—with great tone and easy playability, the CD-60SCE All-Mahogany is ideal for beginning to intermediate level players who are ready to plug in. Featuring a single-cutaway body for easy upper-fret access, warm-sounding solid mahogany top, easy-to-play neck and mahogany back and sides, the CD-60SCE is perfect for the couch, the beach or the coffeehouse—anywhere you want classic Fender playability and sound.",
      price: 349.99,
      image_url: "https://i.imgur.com/YDfsEjl.png",
      inventory: 771,
      on_sale: true,
      sale_percentage: 30,
    });
    const acousticGuitar3 = await createProduct({
      name: "AMERICAN ACOUSTASONIC® JAZZMASTER® ALL-MAHOGANY",
      description:
        "The American Acoustasonic® Jazzmaster® All-Mahogany offers players even more tonal possibilities to the seemingly endless sonic range of our groundbreaking Acoustasonic® platform. Equipped with the revolutionary Fender and Fishman®-designed Acoustic Engine and constructed entirely of mahogany, this powerful guitar goes from acoustic shape-shifting to electric rhythm tones, all with balanced highs, focused mid-range, and pronounced bass response. Continuing our legacy of purposeful innovation, this guitar represents a new alternative for artist expression from the studio to the stage.",
      price: 1999.99,
      image_url: "https://i.imgur.com/Fxc9VCv.png",
      inventory: 89,
      on_sale: false,
      sale_percentage: null,
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
    //cart 1, banjo, x1.
    

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

    // console.log("Calling canEditCartProduct");
    // const canEditIsTrue = await canEditCartProduct(1, 1);
    // console.log("Result canEditCartProduct should be true?", canEditIsTrue);

    // console.log("Calling canEditCartProduct");
    // const canEditIsFalse = await canEditCartProduct(4, 1);
    // console.log("Result canEditCartProduct should be false?", canEditIsFalse);

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
