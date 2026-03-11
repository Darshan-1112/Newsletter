const nodemailer = require('nodemailer');
const Subscriber = require('../models/subModel');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendImperialGazette = async (subject, htmlContent) => {
    // 1. Fetch all subscribers
    const subscribers = await Subscriber.getAll();

    // 2. Extract emails
    const emailList = subscribers.map(sub => sub.email);

    if (emailList.length === 0) {
        throw new Error("No subscribers found in database.");
    }

    // 3. htmlContent MUST come from the editor (live rendered template).
    //    We never fall back to any static file — what you edit = what gets sent.
    if (!htmlContent) {
        throw new Error("No email content provided. Please compose your gazette in the editor before sending.");
    }

    const mailOptions = {
        from: `"The Imperial Court" <${process.env.SMTP_USER}>`,
        bcc: emailList,
        subject: subject || "The Vovance Imperial Gazette",
        html: htmlContent,
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = { sendImperialGazette };