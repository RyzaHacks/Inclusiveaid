const db = require('../../config/database');

exports.createActivityLog = async (req, res) => {
  try {
    const { userId, action, description } = req.body;
    const activityLog = await db.ActivityLog.create({ userId, action, description });
    res.status(201).json({ message: 'Activity log created successfully', activityLog });
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ message: 'Error creating activity log', error: error.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const activityLogs = await db.ActivityLog.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(activityLogs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
  }
};