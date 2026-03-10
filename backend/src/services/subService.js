const Subscriber = require('../models/subModel');

// const fetchAllSubscribers = async () => {
//     return await Subscriber.getAll();
// };
const fetchPaginatedSubscribers = async (search, limit, offset) => {
    return await Subscriber.getPaginated(search, limit, offset);
};


const addSubscriber = async (email, group_name) => {
    // Check if subscriber already exists
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

module.exports = { fetchPaginatedSubscribers, addSubscriber, removeSubscriber };