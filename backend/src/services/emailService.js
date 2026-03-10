const nodemailer = require('nodemailer');
const Subscriber = require('../models/subModel');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendImperialGazette = async (subject) => {
    // The full HTML template you provided
    const subscribers = await Subscriber.getAll();
    
    // 2. Extract emails into a simple array
    const emailList = subscribers.map(sub => sub.email);

    if (emailList.length === 0) {
        throw new Error("No subscribers found in database.");
    }
    const templatePath = path.join(__dirname, 'imperial-gazette-email.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    const mailOptions = {
        from: `"The Imperial Court" <${process.env.SMTP_USER}>`,
        bcc: emailList, // Send to everyone at once securely
        subject: subject || "The Vovance Imperial Gazette - Edition No. 111",
        html: htmlTemplate,
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = { sendImperialGazette };