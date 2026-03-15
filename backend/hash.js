const bcrypt = require("bcrypt");

const password = "Hridya@2047";   // password written directly in code
const saltRounds = 10;

async function generateHash() {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Original Password:", password);
        console.log("Hashed Password:", hash);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

generateHash();