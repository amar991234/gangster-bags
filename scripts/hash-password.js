const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "admin123"; // The password you want to hash
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  console.log("Hashed password:", hashedPassword);
}

hashPassword();