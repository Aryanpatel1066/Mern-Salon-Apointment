const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register New User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        let user = new User({ name, email, password: hashedPassword, phone });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Login User 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "email wrong" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "wrong password" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // res.status(200).json({ message: "Login Successful", token ,user});
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone:user.phone,
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//admin side list of user
const getAllUser = async (req, res) => {
    try {
        const user = await User.find().select("-password");
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({
            message: "something went wrong now load user data"
        })
    }
}

//admin side delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

//admin side update data
const updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


module.exports = { registerUser, loginUser, getUserProfile, getAllUser, deleteUser, updateUser };