const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use 'host' and 'port' from env if not gmail
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `The Cosmetic Shop <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
