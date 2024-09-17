const db = require('../config/database');

exports.addServiceNote = async (req, res) => {
  try {
    const { serviceId, content } = req.body;
    const userId = req.user.id;
    const newNote = await db.ServiceNote.create({ serviceId, userId, content });
    res.status(201).json({ message: 'Service note added successfully', note: newNote });
  } catch (error) {
    console.error('Error adding service note:', error);
    res.status(500).json({ message: 'Error adding service note', error: error.message });
  }
};

exports.getServiceNotes = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const notes = await db.ServiceNote.findAll({
      where: { serviceId },
      include: [{ model: db.User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching service notes:', error);
    res.status(500).json({ message: 'Error fetching service notes', error: error.message });
  }
};