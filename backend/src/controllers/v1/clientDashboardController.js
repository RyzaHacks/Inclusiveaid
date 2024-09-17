// controllers/clientDashboardController.js

const db = require('../config/database');

exports.getNDISPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const ndisPlan = await db.NDISPlan.findOne({
      where: { userId },
      include: [
        {
          model: db.User,
          as: 'assignedCareCoordinator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }
    res.json(ndisPlan);
  } catch (error) {
    console.error('Error fetching NDIS plan:', error);
    res.status(500).json({ message: 'Error fetching NDIS plan', error: error.message });
  }
};

exports.updateNDISPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalBudget, usedBudget, startDate, endDate, goals, fundingCategories } = req.body;
    const [ndisPlan, created] = await db.NDISPlan.findOrCreate({
      where: { userId },
      defaults: { totalBudget, usedBudget, startDate, endDate, goals, fundingCategories }
    });
    if (!created) {
      await ndisPlan.update({ totalBudget, usedBudget, startDate, endDate, goals, fundingCategories });
    }
    res.json(ndisPlan);
  } catch (error) {
    console.error('Error updating NDIS plan:', error);
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};

exports.getUpcomingServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const upcomingServices = await db.ServiceAssignment.findAll({
      where: {
        clientId: userId,
        date: {
          [db.Sequelize.Op.gte]: new Date()
        }
      },
      include: [
        { model: db.Service, as: 'service' },
        { 
          model: db.User, 
          as: 'assignedWorker',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(upcomingServices);
  } catch (error) {
    console.error('Error fetching upcoming services:', error);
    res.status(500).json({ message: 'Error fetching upcoming services', error: error.message });
  }
};

exports.getSupportTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const supportTeam = await db.SupportTeamMember.findAll({
      where: { clientId: userId },
      include: [
        { 
          model: db.User, 
          as: 'member',
          attributes: ['id', 'name', 'email', 'role', 'phoneNumber']
        }
      ]
    });
    res.json(supportTeam);
  } catch (error) {
    console.error('Error fetching support team:', error);
    res.status(500).json({ message: 'Error fetching support team', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await db.Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const activityLog = await db.ActivityLog.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']]
    });
    res.json(activityLog);
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ message: 'Error fetching activity log', error: error.message });
  }
};

exports.scheduleService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId, date, time, workerId } = req.body;
    const newServiceAssignment = await db.ServiceAssignment.create({
      clientId: userId,
      serviceId,
      date,
      time,
      supportTeamMemberId: workerId,
      status: 'scheduled'
    });
    res.status(201).json(newServiceAssignment);
  } catch (error) {
    console.error('Error scheduling service:', error);
    res.status(400).json({ message: 'Error scheduling service', error: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await db.Notification.findOne({
      where: { id, userId: req.user.id }
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.update({ read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityType, description } = req.body;
    const newActivity = await db.ActivityLog.create({
      userId,
      activityType,
      description,
      timestamp: new Date()
    });
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(400).json({ message: 'Error logging activity', error: error.message });
  }
};

module.exports = exports;