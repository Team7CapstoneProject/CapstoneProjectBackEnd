const { Client } = require("pg")

const client = new Client("postgres://localhost:5432/capstoneDev")
//ssl? do we need to add that before deployment

module.exports = {
    client
}