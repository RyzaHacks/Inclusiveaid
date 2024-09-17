//controllers/v2/supportTeamController.js:

const db = require('../../config/database');

exports.getSupportTeamForClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const supportTeam = await db.SupportTeamMember.findAll({
      where: { clientId },
      include: [
        {
          model: db.User,
          as: 'member',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(supportTeam);
  } catch (error) {
    console.error('Error fetching support team for client:', error);
    res.status(500).json({ message: 'Error fetching support team for client', error: error.message });
  }
};

exports.addSupportTeamMember = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { memberId, role } = req.body;
    const supportTeamMember = await db.SupportTeamMember.create({
      clientId,
      memberId,
      role
    });
    res.status(201).json({ message: 'Support team member added successfully', supportTeamMember });
  } catch (error) {
    console.error('Error adding support team member:', error);
    res.status(500).json({ message: 'Error adding support team member', error: error.message });
  }
};

exports.updateSupportTeamMember = async (req, res) => {
  try {
    const { clientId, memberId } = req.params;
    const { role } = req.body;
    const supportTeamMember = await db.SupportTeamMember.findOne({
      where: { clientId, memberId }
    });
    if (!supportTeamMember) {
      return res.status(404).json({ message: 'Support team member not found' });
    }
    await supportTeamMember.update({ role });
    res.json({ message: 'Support team member updated successfully', supportTeamMember });
  } catch (error) {
    console.error('Error updating support team member:', error);
    res.status(500).json({ message: 'Error updating support team member', error: error.message });
  }
};

exports.removeSupportTeamMember = async (req, res) => {
  try {
    const { clientId, memberId } = req.params;
    const supportTeamMember = await db.SupportTeamMember.findOne({
      where: { clientId, memberId }
    });
    if (!supportTeamMember) {
      return res.status(404).json({ message: 'Support team member not found' });
    }
    await supportTeamMember.destroy();
    res.json({ message: 'Support team member removed successfully' });
  } catch (error) {
    console.error('Error removing support team member:', error);
    res.status(500).json({ message: 'Error removing support team member', error: error.message });
  }
};