const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); // Corrected model import

// Middleware to verify JWT token (Protect Routes)
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Middleware to Validate Signup Request
const verifySignupBody = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "User name is required" });
        }
        if (!req.body.email) {
            return res.status(400).send({ message: "User email is required" });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: "User password is required" });
        }

        // Check if email already exists
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User email already exists" });
        }

        next(); // Proceed to the next middleware/controller
    } catch (err) {
        res.status(500).send({ message: "Error while verifying signup body" });
    }
     
};
const verifySignInBody = async (req,res,next) =>{
    try {
        if (!req.body.email) {
            return res.status(400).send({ message: "User email is required" });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: "User password is required" });
        }
        next()
    }
    catch(err){
        res.status(500).send({
            message:"internal error while checking signin body"
        })
    }
}
// Export both middlewares correctly
module.exports = {
    authMiddleware,
    verifySignupBody,
    verifySignInBody
};
