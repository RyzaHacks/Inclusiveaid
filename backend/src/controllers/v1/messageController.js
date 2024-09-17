const db = require('../../config/database');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Validate that both sender and receiver exist
    const [sender, receiver] = await Promise.all([
      db.User.findByPk(senderId),
      db.User.findByPk(receiverId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    const message = await db.Message.create({
      senderId,
      receiverId,
      content
    });

    const fullMessage = await db.Message.findByPk(message.id, {
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'name'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};
// Fetch sent messages
exports.getSentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const sentMessages = await db.Message.findAll({
      where: { senderId: userId },
      include: [
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(sentMessages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ message: 'Error fetching sent messages', error: error.message });
  }
};

// Fetch drafts
exports.getDrafts = async (req, res) => {
  try {
    const userId = req.user.id;
    const drafts = await db.Message.findAll({
      where: { senderId: userId, draft: true },
      include: [
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ message: 'Error fetching drafts', error: error.message });
  }
};

// Fetch conversation messages between the logged-in user and a partner
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    const messages = await db.Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'name'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};
exports.getUnreadCount = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Fetching unread count for user:', userId);
  
      const count = await db.Message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });
  
      console.log('Unread count:', count);
      res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Error getting unread count', error: error.message, stack: error.stack });
    }
  };
  exports.getConversations = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Fetching conversations for user:', userId);
  
      const conversations = await db.sequelize.query(`
        SELECT 
          CASE 
            WHEN senderId = :userId THEN receiverId
            ELSE senderId
          END as partnerId,
          MAX(createdAt) as lastMessageAt,
          COUNT(*) as messageCount
        FROM messages
        WHERE senderId = :userId OR receiverId = :userId
        GROUP BY partnerId
        ORDER BY lastMessageAt DESC
      `, {
        replacements: { userId },
        type: db.Sequelize.QueryTypes.SELECT
      });
  
      const processedConversations = await Promise.all(conversations.map(async (conv) => {
        const partner = await db.User.findByPk(conv.partnerId, {
          attributes: ['id', 'name', 'role']
        });
        return {
          partnerId: conv.partnerId,
          partnerName: partner ? partner.name : 'Unknown User',
          partnerRole: partner ? partner.role : 'unknown',
          lastMessageAt: conv.lastMessageAt,
          messageCount: conv.messageCount
        };
      }));
  
      res.json(processedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
  };

exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await db.Message.findOne({
      where: { id: messageId, receiverId: userId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await db.Message.findOne({
      where: { id: messageId, senderId: userId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found or you do not have permission to delete it' });
    }

    await message.destroy();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
    try {
      const userId = req.user.id;
      const count = await db.Message.count({
        where: {
          receiverId: userId,
          read: false  // Changed from isRead to read
        }
      });
      res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ message: 'Error getting unread count', error: error.message });
    }
  };

exports.searchMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    const messages = await db.Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        content: { [Op.like]: `%${query}%` }
      },
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'name'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ message: 'Error searching messages', error: error.message });
  }
};

exports.getLatestMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestMessages = await db.Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      attributes: [
        [db.Sequelize.fn('DISTINCT', db.Sequelize.col('senderId')), 'userId'],
        'content',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json(latestMessages);
  } catch (error) {
    console.error('Error getting latest messages:', error);
    res.status(500).json({ message: 'Error getting latest messages', error: error.message });
  }
};

exports.sendFile = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${file.filename}`;

    const message = await db.Message.create({
      senderId,
      receiverId,
      content: 'File attachment',
      fileUrl
    });

    const fullMessage = await db.Message.findByPk(message.id, {
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'name'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error('Error sending file:', error);
    res.status(500).json({ message: 'Error sending file', error: error.message });
  }
};

module.exports = exports;