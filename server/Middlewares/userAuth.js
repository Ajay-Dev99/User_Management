const jwt = require('jsonwebtoken')
const userDb = require('../model/userModel');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(400).json({ AccessStatus: false, message: "Authentication token is missing." })
        } else {
            const authtoken = authHeader.replace(/^Bearer\s+/i, '');

            if (!authtoken) return res.status(400).json({ AccessStatus: false, message: "Invalid token format." })

            //decoding the token
            const decoded = jwt.verify(authtoken, process.env.JWT_SECRETE_KEY)
            //checking whether user exist or not
            const user = await userDb.findOne({ _id: decoded.id }).select("-password")
            if (!user) return res.status(400).json({ AccessStatus: false, message: "Unauthorized access. user not found." })
            req.user = user
            next()
        }

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" })
    }
}