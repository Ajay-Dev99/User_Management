const userDb = require("../model/userModel")
const activityDb = require("../model/activityModel")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const trackActivity = require("../utilities/trackActivity");
const jwt = require("jsonwebtoken")
const maxAge = 3 * 24 * 60 * 60;




const createToken = (id) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id }, process.env.JWT_SECRETE_KEY, { expiresIn: maxAge }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "All Fields Are Required" })
        const emailExist = await userDb.findOne({ email })
        if (emailExist) {
            return res.status(409).json({ error: "Email Already Exist" })
        }
        const newUser = new userDb({
            name, email, password
        })

        newUser.save().then((response) => {

            trackActivity(response._id, 'registration')
            return res.status(200).json({ message: "UserAdded Succesfully" })

        }).catch((err) => {
            return res.status(err.status || 500).json({ status: 0, error: err.message || "Unable to Register now" })
        })

    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}


const login = async (req, res, next) => {
    try {

        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ error: "All Fields Are Required" })

        const userExist = await userDb.findOne({ email })
        if (userExist) {
            const passwordMatch = await bcrypt.compare(password, userExist.password)
            if (passwordMatch) {
                const token = await createToken(userExist._id)
                trackActivity(userExist._id, "login")
                return res.status(200).json({ message: "Login Successfully", token })
            } else {
                return res.status(400).json({ error: "Password Not Match" })
            }
        } else {
            return res.status(404).json({ error: "No user Found" })
        }

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error" })
    }
}

const getProfileData = async (req, res) => {
    try {
        const userId = req.user._id;

        const userData = await userDb.findById(new mongoose.Types.ObjectId(userId)).select("-password")

        if (userData) {
            trackActivity(userId, "profile_api_access")
            return res.status(200).json(userData)
        } else {
            return res.status(404).json({ error: "No user found" })
        }
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" })
    }
}

const userActivity = async (req, res) => {
    try {
        const userId = req.user._id


        const user = await userDb.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "No user found" })
        }
        const activities = await activityDb.find({ user: userId }).select("-user")

        //This is the code which is for populate(if userdetails neccessary).
        // const activities = await activityDb.find({user:userId}).populate("user")

        trackActivity(userId, "activity_api_access")
        return res.status(200).json({ activities })
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "internal Server Error" })
    }
}

const listActivities = async (req, res) => {
    try {
        const activities = await activityDb.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            {
                $group: {
                    _id: '$userDetails._id',
                    userDetails: { $first: '$userDetails' },
                    activities: { $push: { activity: '$activity', timestamp: '$createdAt' } }
                }
            },
            {
                $project: {
                    _id: 0,
                    userDetails: 1,
                    activities: 1
                }
            }
        ])

        res.status(200).json(activities)
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" })
    }
}

const logout = (req, res) => {
    try {
        //if there is session we have to destroy that.
        //Here its JWT token so we can remove the token from front end. (from local storage or session Storage)
        trackActivity(req.user._id, "logout")
        res.status(200).json({ message: "Logged Out" })
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "internal Server Error" })
    }
}



module.exports = {
    register,
    login,
    getProfileData,
    userActivity,
    listActivities,
    logout
}