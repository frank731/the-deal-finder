// Sourced from https://github.com/kelektiv/node.bcrypt.js#readme

const bcrypt = require('bcryptjs')
const saltRounds = 10;

export async function HashPassword(password){
    // Hash the password using bcrpyt with salting
    const hash = bcrypt.hash(password, saltRounds)
    return hash
}

export async function CheckPassword(password){
    bcrypt.compare(password)
}
