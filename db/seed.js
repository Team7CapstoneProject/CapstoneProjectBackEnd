const { client, createUser, createProduct } = require("./index")

//function for making our test admin % regular user
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        const admin = await createUser({first_name: 'admin', last_name: 'admin', password: 'admin', email: 'admin@gmail.com', is_admin: true});
        const user = await createUser({first_name: 'user', last_name: 'user', password: 'user', email: 'user@gmail.com', is_admin: false});
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
        const guitar = await createProduct({name: 'guitar', description: 'test', price: 100.00, image_url: 'www.testurl.com', inventory: 1})
        const piano = await createProduct({name: 'piano', description: 'test', price: 1000.00, image_url: 'www.testurl.com', inventory: 1})
        const violin = await createProduct({name: 'violin', description: 'test', price: 500.00, image_url: 'www.testurl.com', inventory: 1})
    } catch (error) {

    }
}


async function dropTables(){
    try {
        console.log("Dropping all Tables...")

        await client.query(`
        DROP TABLE IF EXISTS cart_products;
        DROP TABLE IF EXISTS cart;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        `)
        console.log("finished dropping tables...")
    } catch (error) {
        console.error("error dropping tables...")
        throw error;
    }
}

//may need to add a category table for higher tier and link category tags to products
async function createTables(){
    try {
        console.log('Starting to build tables...')

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
        `)
            console.log("finished building tables...")
    } catch (error) {
        console.error("error building tables...")
        throw error;
    }
}

async function rebuildDB(){
    try {
    client.connect()

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProducts();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

async function testDB(){
    try {
        console.log("starting to test database...")

        console.log("finished database test....")
    } catch (error) {
        console.error("error testing database...")
        throw error;
    }
}


rebuildDB()
.then(testDB)
.catch(console.error)
.finally(()=> client.end());