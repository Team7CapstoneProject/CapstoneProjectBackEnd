const { Client } = require("pg");
console.log("information here!!",process.env.DATABASE_URL)
const client = new Client(process.env.DATABASE_URL || "postgres://localhost:5432/capstoneDev");
//ssl? do we need to add that before deployment

module.exports = client;