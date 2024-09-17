// controllers/serviceAssignmentController.js
const db = require('../../config/database');

exports.createServiceAssignment = async (req, res) => {
  try {
    const { serviceId, clientId, supportTeamMemberId, ndisPlanId, date, time } = req.body;
    const serviceAssignment = await db.ServiceAssignment.create({
      serviceId,
      clientId,
      supportTeamMemberId,
      ndisPlanId,
      date,
      time,
      status: 'scheduled'
    });
    res.status(201).json(serviceAssignment);
  } catch (error) {
    console.error('Error creating service assignment:', error);
    res.status(400).json({ message: 'Error creating service assignment', error: error.message });
  }
};

exports.getServiceAssignmentsForClient = async (req, res) => {
  try {
    const clientId = req.params.clientId || req.user.id;
    const serviceAssignments = await db.ServiceAssignment.findAll({
      where: { clientId },
      include: [
        { model: db.Service, as: 'service' },
        { 
          model: db.SupportTeamMember, 
          as: 'assignedTeamMember',
          include: [{ model: db.User, as: 'member', attributes: ['id', 'name', 'email'] }]
        },
        { model: db.NDISPlan, as: 'ndisPlan', attributes: ['id', 'ndisNumber'] }
      ]
    });
    res.json(serviceAssignments);
  } catch (error) {
    console.error('Error fetching service assignments:', error);
    res.status(500).json({ message: 'Error fetching service assignments', error: error.message });
  }
};

exports.updateServiceAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, status, notes } = req.body;
    const serviceAssignment = await db.ServiceAssignment.findByPk(id);
    if (!serviceAssignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    await serviceAssignment.update({ date, time, status, notes });
    res.json(serviceAssignment);
  } catch (error) {
    console.error('Error updating service assignment:', error);
    res.status(400).json({ message: 'Error updating service assignment', error: error.message });
  }
};

exports.deleteServiceAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceAssignment = await db.ServiceAssignment.findByPk(id);
    if (!serviceAssignment) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    await serviceAssignment.destroy();
    res.json({ message: 'Service assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting service assignment:', error);
    res.status(500).json({ message: 'Error deleting service assignment', error: error.message });
  }
};

module.exports = exports;