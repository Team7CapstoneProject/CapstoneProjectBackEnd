const { Client } = require("pg");
console.log("information here!!",process.env.DATABASE_URL)
const client = new Client("postgres://capstone_dev_user:s0eTYe1iQ8WUMCHz3t7S8ojDEwoFFOv1@dpg-ce2cul9a6gdsa64pur70-a.ohio-postgres.render.com/capstone_dev_5ijo?ssl=true" || "postgres://localhost:5432/capstoneDev");
//ssl? do we need to add that before deployment

module.exports = client;