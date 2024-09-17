// controllers/v2/clientController.js
const db = require('../../config/database');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [ndisPlan, upcomingServices, supportTeam, notifications, activityLog] = await Promise.all([
      db.NDISPlan.findOne({ where: { userId } }),
      db.ServiceAssignment.findAll({ 
        where: { clientId: userId, status: 'scheduled' },
        include: [{ model: db.Service, as: 'service' }],
        order: [['date', 'ASC']],
        limit: 5
      }),
      db.SupportTeamMember.findAll({ 
        where: { clientId: userId }, 
        include: [{ model: db.User, as: 'member' }] 
      }),
      db.Notification.findAll({ 
        where: { userId }, 
        order: [['createdAt', 'DESC']], 
        limit: 10 
      }),
      db.ActivityLog.findAll({ 
        where: { userId }, 
        order: [['timestamp', 'DESC']], 
        limit: 10 
      })
    ]);

    res.json({
      ndisPlan,
      upcomingServices,
      supportTeam,
      notifications,
      activityLog
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

exports.getNDISPlan = async (req, res) => {
  try {
    const ndisPlan = await db.NDISPlan.findOne({ where: { userId: req.user.id } });
    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }
    res.json(ndisPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NDIS plan', error: error.message });
  }
};

exports.updateNDISPlan = async (req, res) => {
  try {
    const [updatedRows] = await db.NDISPlan.update(req.body, { where: { userId: req.user.id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }
    const updatedPlan = await db.NDISPlan.findOne({ where: { userId: req.user.id } });
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};

exports.getClientServices = async (req, res) => {
  try {
    const services = await db.ServiceAssignment.findAll({ 
      where: { clientId: req.user.id },
      include: [{ model: db.Service, as: 'service' }]
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client services', error: error.message });
  }
};

exports.scheduleService = async (req, res) => {
  try {
    const { serviceId, date, time, supportTeamMemberId, ndisPlanId } = req.body;
    const newServiceAssignment = await db.ServiceAssignment.create({
      serviceId,
      clientId: req.user.id,
      supportTeamMemberId,
      ndisPlanId,
      date,
      time,
      status: 'scheduled'
    });
    res.status(201).json(newServiceAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling service', error: error.message });
  }
};

exports.getSupportTeam = async (req, res) => {
  try {
    const supportTeam = await db.SupportTeamMember.findAll({
      where: { clientId: req.user.id },
      include: [{ model: db.User, as: 'member' }]
    });
    res.json(supportTeam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching support team', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await db.Notification.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await db.Notification.update({ read: true }, { where: { id, userId: req.user.id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const activityLog = await db.ActivityLog.findAll({ 
      where: { userId: req.user.id },
      order: [['timestamp', 'DESC']]
    });
    res.json(activityLog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity log', error: error.message });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const { type, description } = req.body;
    const newActivity = await db.ActivityLog.create({
      userId: req.user.id,
      type,
      description,
      timestamp: new Date()
    });
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error logging activity', error: error.message });
  }
};