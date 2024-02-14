const nodemailer = require('nodemailer')

const sendMail = async function (useremail, password) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASSWORD
        },
    });

    let info = await transporter.sendMail({
        from: '"Shoe Rack" <shoerackshoping@gmail.com>', // sender address
        to: useremail, // list of receivers
        subject: 'Password Updated', // Subject line
        text: `You New Password is:${password}`, // plain text body

    });

}

module.exports = sendMail;