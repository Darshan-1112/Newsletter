const express = require('express');
const router = express.Router();
const { getSubscribers, createSubscriber, deleteSubscriber, sendBulkBroadcast, unsubscribeByEmail } = require('../controllers/subController');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC — no login needed (subscriber clicks from their email)
router.get('/unsubscribe', unsubscribeByEmail);

// Protected routes (admin only)
router.get('/', protect, getSubscribers);
router.post('/', protect, createSubscriber);
router.delete('/:id', protect, deleteSubscriber);
router.post('/send-broadcast', protect, sendBulkBroadcast);

module.exports = router;