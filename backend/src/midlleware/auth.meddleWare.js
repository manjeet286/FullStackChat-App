import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        console.log("JWT from cookies:", token);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodedToken);

        const user = await User.findById(decodedToken.userId).select("-password");
        console.log("User fetched from DB:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Protect Route Error:", error.message);
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};
