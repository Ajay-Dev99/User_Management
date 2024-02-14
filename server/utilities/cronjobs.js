
const cron = require('cron');
const userDb = require("../model/userModel");
const trackActivity = require('./trackActivity');
const sendMail = require("./nodemailer");



// Function to generate a random password
const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};

// Function to generate and update password
const updatePassword = async () => {
    try {
        const users = await userDb.find()
        if (users.length) {
            for (const user of users) {
                const newPassword = generateRandomPassword();

                user.password = newPassword;
                await user.save();

                sendMail(user.email, newPassword)
                trackActivity(user._id, "password_change");
            }
        }
    } catch (error) {
        console.error('Error updating password:', error);
    }
};

// Create a cron job to run every 5 minutes

const job = new cron.CronJob('*/5 * * * *', updatePassword); 

module.exports = job