//controllers/v2/messageController.js:
const db = require('../../config/database');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;
    const message = await db.Message.create({ senderId, receiverId, content });
    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user.id;
    const messages = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      attributes: [
        [db.Sequelize.fn('DISTINCT', db.Sequelize.col('senderId')), 'senderId'],
        [db.Sequelize.fn('DISTINCT', db.Sequelize.col('receiverId')), 'receiverId']
      ],
      include: [
        {
          model: db.User,
          as: 'sender',
          attributes: ['id', 'name']
        },
        {
          model: db.User,
          as: 'receiver',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await message.update({ read: true });
    res.json({ message: 'Message marked as read', message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await db.Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
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
    const unreadCount = await db.Message.count({
      where: {
        receiverId: userId,
        read: false
      }
    });
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    res.status(500).json({ message: 'Error fetching unread message count', error: error.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;
    const messages = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }],
        content: {
          [db.Sequelize.Op.like]: `%${query}%`
        }
      },
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
        [db.Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(latestMessages);
  } catch (error) {
    console.error('Error fetching latest messages:', error);
    res.status(500).json({ message: 'Error fetching latest messages', error: error.message });
  }
};

exports.getSentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const sentMessages = await db.Message.findAll({
      where: {
        senderId: userId
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(sentMessages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ message: 'Error fetching sent messages', error: error.message });
  }
};

exports.getDrafts = async (req, res) => {
  try {
    const userId = req.user.id;
    const drafts = await db.Message.findAll({
      where: {
        senderId: userId,
        draft: true
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ message: 'Error fetching drafts', error: error.message });
  }
};