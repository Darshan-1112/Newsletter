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
        
        // Pass both subject AND the custom HTML from the editor
        const result = await emailService.sendImperialGazette(subject, htmlContent);

        res.status(200).json({ 
            message: `Gazette successfully dispatched to all subscribers!`,
            messageId: result.messageId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendBulkBroadcast, getSubscribers, createSubscriber, deleteSubscriber };