const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, ApprovedUser } = require("../models/userModels");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

      
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

     
        const newUser = await createUser(name, email, hashedPassword, role);

        res.status(201).json({
            message: "User registered successfully. Waiting for admin approval.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

       
        if (!user.is_approved) {
            return res.status(403).json({ message: "Contact admin to approve your request" });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};





module.exports = { registerUser, loginUser };
