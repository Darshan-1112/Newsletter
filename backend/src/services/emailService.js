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
    const subscribers = await Subscriber.getAll();

    if (subscribers.length === 0) {
        throw new Error("No subscribers found in database.");
    }
    if (!htmlContent) {
        throw new Error("No email content provided. Please compose your gazette in the editor before sending.");
    }

    // Send to every subscriber — each gets their own unique unsubscribe link
    // {{EMAIL}} in the HTML is replaced with each subscriber's actual email address
    for (const subscriber of subscribers) {
        const personalizedHtml = htmlContent.replace(
            /\{\{EMAIL\}\}/g,
            encodeURIComponent(subscriber.email)
        );

        await transporter.sendMail({
            from: `"The Imperial Court" <${process.env.SMTP_USER}>`,
            to: subscriber.email,
            subject: subject || "The Vovance Imperial Gazette",
            html: personalizedHtml,
        });
    }

    return { sent: subscribers.length };
};

module.exports = { sendImperialGazette };