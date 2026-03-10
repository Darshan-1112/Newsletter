const express = require('express');
const router = express.Router();
const { getSubscribers, createSubscriber, deleteSubscriber, sendBulkBroadcast } = require('../controllers/subController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.get('/', protect, getSubscribers);
router.post('/', protect, createSubscriber);
router.delete('/:id', protect, deleteSubscriber);
router.post('/send-broadcast', protect, sendBulkBroadcast);

module.exports = router;