const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModels");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check agar email already exist karta hai
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password hash karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya user create karna
    const newUser = await createUser(name, email, hashedPassword, role);

    res.status(201).json({
      message: "User registered successfully. Waiting for admin approval.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
