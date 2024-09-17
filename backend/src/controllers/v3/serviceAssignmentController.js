const db = require('../../config/database');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await db.ServiceAssignment.findAll({
      include: [
        { model: db.User, as: 'client', attributes: ['id', 'name'] },
        { model: db.User, as: 'serviceWorkerUser', attributes: ['id', 'name'] },
        { model: db.Service, as: 'service', attributes: ['id', 'name'] },
        { 
          model: db.ServiceWorker, 
          as: 'serviceWorker', 
          include: [{ model: db.User, as: 'user', attributes: ['id', 'name'] }] 
        }
      ]
    });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await db.ServiceAssignment.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'client', attributes: ['id', 'name'] },
        { model: db.User, as: 'serviceWorker', attributes: ['id', 'name'] },
        { model: db.Service, attributes: ['id', 'name'] }
      ]
    });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment by id:', error);
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = await db.ServiceAssignment.create(req.body);
    const createdAssignment = await db.ServiceAssignment.findByPk(newAssignment.id, {
      include: [
        { model: db.User, as: 'client', attributes: ['id', 'name'] },
        { model: db.User, as: 'serviceWorker', attributes: ['id', 'name'] },
        { model: db.Service, attributes: ['id', 'name'] }
      ]
    });
    res.status(201).json(createdAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const [updated] = await db.ServiceAssignment.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAssignment = await db.ServiceAssignment.findByPk(req.params.id, {
        include: [
          { model: db.User, as: 'client', attributes: ['id', 'name'] },
          { model: db.User, as: 'serviceWorker', attributes: ['id', 'name'] },
          { model: db.Service, attributes: ['id', 'name'] }
        ]
      });
      return res.json(updatedAssignment);
    }
    throw new Error('Assignment not found');
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await db.ServiceAssignment.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Assignment deleted successfully' });
    }
    throw new Error('Assignment not found');
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};