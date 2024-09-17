const db = require('../../config/database');

exports.addSupportTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const { memberId, role } = req.body;
    const member = await db.SupportTeamMember.create({ userId, memberId, role });
    res.status(201).json({ message: 'Support team member added successfully', member });
  } catch (error) {
    console.error('Error adding support team member:', error);
    res.status(500).json({ message: 'Error adding support team member', error: error.message });
  }
};

exports.updateSupportTeam = async (req, res) => {
  try {
    const { userId } = req.params;
    const { members } = req.body;
    await db.SupportTeamMember.destroy({ where: { userId } });
    const updatedMembers = await Promise.all(
      members.map(async (member) => {
        return await db.SupportTeamMember.create({ userId, memberId: member.id, role: member.role });
      })
    );
    res.json({ message: 'Support team updated successfully', members: updatedMembers });
  } catch (error) {
    console.error('Error updating support team:', error);
    res.status(500).json({ message: 'Error updating support team', error: error.message });
  }
};

exports.removeSupportTeamMember = async (req, res) => {
  try {
    const { userId, workerId } = req.params;
    await db.SupportTeamMember.destroy({ where: { userId, memberId: workerId } });
    res.json({ message: 'Support team member removed successfully' });
  } catch (error) {
    console.error('Error removing support team member:', error);
    res.status(500).json({ message: 'Error removing support team member', error: error.message });
  }
};