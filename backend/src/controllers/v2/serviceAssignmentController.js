// controllers/v3/serviceAssignmentController.js
const db = require('../../config/database');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await db.ServiceAssignment.findAll({
      include: [
        {
          model: db.Service,
          as: 'service',
          attributes: ['id', 'name', 'description', 'category', 'price', 'duration', 'status'],
        },
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: db.SupportTeamMember,
          as: 'supportTeamMember',
          include: [{ model: db.User, as: 'member', attributes: ['id', 'name', 'email'] }],
        },
        {
          model: db.NDISPlan,
          as: 'ndisPlan',
          attributes: ['id', 'totalBudget', 'usedBudget', 'startDate', 'endDate', 'status'],
        },
      ],
    });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching service assignments:', error);
    res.status(500).json({ message: 'Error fetching service assignments', error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { serviceId, clientId, supportTeamMemberId, ndisPlanId, dateTime, notes } = req.body;
    const assignment = await db.ServiceAssignment.create({
      serviceId,
      clientId,
      supportTeamMemberId,
      ndisPlanId,
      dateTime,
      notes,
      status: 'scheduled',
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating service assignment:', error);
    res.status(400).json({ message: 'Error creating service assignment', error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, clientId, supportTeamMemberId, ndisPlanId, dateTime, notes, status } = req.body;
    const assignment = await db.ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    await assignment.update({ serviceId, clientId, supportTeamMemberId, ndisPlanId, dateTime, notes, status });
    res.json(assignment);
  } catch (error) {
    console.error('Error updating service assignment:', error);
    res.status(400).json({ message: 'Error updating service assignment', error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await db.ServiceAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    await assignment.destroy();
    res.json({ message: 'Service assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting service assignment:', error);
    res.status(500).json({ message: 'Error deleting service assignment', error: error.message });
  }
};