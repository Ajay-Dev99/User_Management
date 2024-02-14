const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const userRoutes = require("./Routes/userRoutes")
const job = require("./utilities/cronjobs")
require("dotenv").config()

//app
const app = express()

//cronjob for changing password in every 5 minutes.
job.start();


// db connection for atlas .....
// mongoose.connect(process.env.MONGODB_URL).then(() => {
//     console.log("DB connection successfull");
// }).catch((err) => {
//     console.log(err);
// })


//db connection for local ....
mongoose.connect("mongodb://0.0.0.0:27017/MaticeTechonologies").then(() => {
    console.log("DB connection successfull");
}).catch((err) => {
    console.log(err.message);
})


//middleware
app.use(morgan("dev"))
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes

app.use("/", userRoutes)

//listener

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Started on PORT ", process.env.PORT || 4000);
});


// Route Not Found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})

//Error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})