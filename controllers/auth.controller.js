const userModal = require("../models/user.model");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 2. Validate password length
        if (password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 5 characters"
            });
        }

        // 3. Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // 4. Check if user already exists
        const existingUser = await userModal.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 5. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6. Create new user
        const newUser = new userModal({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Something went wrong while registering user", error);

        if (error.message.includes("timeout")) {
            return res.status(500).json({
                success: false,
                message: "It looks like your internet is slow, please try again"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Ye hamari ghalti hai"
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
