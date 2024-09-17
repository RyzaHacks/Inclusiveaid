const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/v2/messageController');
const auth = require('../../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:partnerId', auth, messageController.getMessages);
router.get('/conversations', auth, messageController.getConversations);
router.put('/:messageId/read', auth, messageController.markMessageAsRead);
router.delete('/:messageId', auth, messageController.deleteMessage);
router.get('/unread-count', auth, messageController.getUnreadCount);
router.get('/search', auth, messageController.searchMessages);
router.get('/latest', auth, messageController.getLatestMessages);
router.get('/sent', auth, messageController.getSentMessages);
router.get('/drafts', auth, messageController.getDrafts);

module.exports = router;