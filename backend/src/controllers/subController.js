const subService = require('../services/subService');
const Subscriber = require('../models/subModel');
const emailService = require('../services/emailService');

const getSubscribers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const { subscribers, total } = await subService.fetchPaginatedSubscribers(search, limit, offset);

        res.status(200).json({
            data: subscribers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubscriber = async (req, res) => {
    try {
        const { email, group_name } = req.body;
        if (!email || !group_name) return res.status(400).json({ message: 'Email and Group Name is required' });
        await subService.addSubscriber(email, group_name);
        res.status(201).json({ message: 'Subscriber added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        await subService.removeSubscriber(id);
        res.status(200).json({ message: 'Subscriber deleted' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const sendBulkBroadcast = async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;
        const result = await emailService.sendImperialGazette(subject, htmlContent);
        res.status(200).json({
            message: `Gazette successfully dispatched to ${result.sent} subscribers!`,
            sent: result.sent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Subscriber clicks Unsubscribe link in email
// GET /api/subscribers/unsubscribe?email=abc%40gmail.com
// → directly deletes from DB → shows confirmation page — NO FORM, NO EXTRA STEP
const unsubscribeByEmail = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).send(renderPage(false, 'Invalid Link', 'This unsubscribe link is invalid or has expired.'));
    }

    try {
        await subService.removeSubscriberByEmail(email);
        return res.status(200).send(renderPage(true, 'Unsubscribed Successfully', `<strong>${email}</strong> has been removed from The Vovance Imperial Gazette. You will not receive any further emails.`));
    } catch (error) {
        return res.status(404).send(renderPage(false, 'Already Removed', `<strong>${email}</strong> was not found. You may have already been unsubscribed.`));
    }
};

function renderPage(success, title, message) {
    const accentColor = success ? '#3d6b3e' : '#b8973a';
    const iconBg = success ? '#e8f5e8' : '#fdf5e6';
    const icon = success ? '&#10003;' : '&#10005;';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title} — Vovance Imperial Gazette</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#3a2e18;font-family:Georgia,serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
    .card{background:#f5f0e8;max-width:420px;width:100%;padding:52px 40px;text-align:center;border-top:5px solid ${accentColor};}
    .icon{width:64px;height:64px;border-radius:50%;background:${iconBg};border:2px solid ${accentColor};display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:28px;color:${accentColor};}
    h1{font-size:22px;color:#1a1208;margin-bottom:14px;letter-spacing:.03em;}
    p{font-size:13px;color:#7a6a4a;line-height:1.8;}
    .divider{width:60px;height:1px;background:#c8b882;margin:28px auto;}
    .brand{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#b8973a;}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="divider"></div>
    <div class="brand">The Vovance Imperial Gazette</div>
  </div>
</body>
</html>`;
}

module.exports = { sendBulkBroadcast, getSubscribers, createSubscriber, deleteSubscriber, unsubscribeByEmail };