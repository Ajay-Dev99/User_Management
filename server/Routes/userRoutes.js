const router = require("express").Router()
const userAuth = require("../Middlewares/userAuth");
const { login, register, getProfileData, userActivity, listActivities, logout } = require("../controllers/userControllers");
const limiter = require("../utilities/limiter");

router.post("/register", register)
router.post("/login", login)
router.get("/profileData", limiter, userAuth, getProfileData)
router.get("/userActivity", userAuth, userActivity)
router.get("/logout", userAuth, logout)
router.get("/allactivies", listActivities)




module.exports = router;