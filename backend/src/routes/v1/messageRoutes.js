// messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/v1/messageController');
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', messageController.sendMessage);
router.get('/:partnerId', messageController.getMessages);
router.get('/conversations', messageController.getConversations);
router.put('/:messageId/read', messageController.markMessageAsRead);
router.delete('/:messageId', messageController.deleteMessage);
router.get('/unread-count', messageController.getUnreadCount);
router.get('/search', messageController.searchMessages);
router.get('/latest', messageController.getLatestMessages);
router.get('/sent', messageController.getSentMessages);
router.get('/drafts', messageController.getDrafts);

module.exports = router;