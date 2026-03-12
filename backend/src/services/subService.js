const Subscriber = require('../models/subModel');

const fetchPaginatedSubscribers = async (search, limit, offset) => {
    return await Subscriber.getPaginated(search, limit, offset);
};

const addSubscriber = async (email, group_name) => {
    const existing = await Subscriber.findByEmail(email);
    if (existing) {
        throw new Error('Subscriber already exists with this email');
    }
    return await Subscriber.create(email, group_name);
};

const removeSubscriber = async (id) => {
    const affectedRows = await Subscriber.delete(id);
    if (affectedRows === 0) {
        throw new Error('Subscriber not found');
    }
    return true;
};

// Called when subscriber clicks unsubscribe link in email
const removeSubscriberByEmail = async (email) => {
    const existing = await Subscriber.findByEmail(email);
    if (!existing) {
        throw new Error('Email not found');
    }
    const affectedRows = await Subscriber.delete(existing.id);
    if (affectedRows === 0) {
        throw new Error('Could not remove subscriber');
    }
    return true;
};

module.exports = { fetchPaginatedSubscribers, addSubscriber, removeSubscriber, removeSubscriberByEmail };
