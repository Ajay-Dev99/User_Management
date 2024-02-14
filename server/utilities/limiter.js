
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per 
  message: "Too many requests from this Device, please try again after 5 minutes",
});

module.exports = limiter;