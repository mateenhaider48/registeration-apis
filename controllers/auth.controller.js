const userModal = require("../models/user.model");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new userModal({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while registering, please try again"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await userModal.findOne({ email });
        console.log("This is user from login", user);

        // user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // password check (plain text)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // login success
        res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while logging in, please try again"
        });
    }
};

module.exports = { registerUser, loginUser };
