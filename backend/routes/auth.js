import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import wrapAsync from "../utils/wrapAsync.js"

const router = express.Router();

// Signup API
router.post(
    "/signup",
    wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("User already exists");
        error.status = 400;
        throw error;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully ✅" });
    })
);


// 🔹 Login API
router.post(
    "/login",
    wrapAsync(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            throw error;
        }

        // generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful ✅",
            token,
        });
    })
);

export default router;
