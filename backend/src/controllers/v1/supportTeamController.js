const db = require('../../config/database');

exports.getSupportTeamForClient = async (req, res) => {
  try {
    const clientId = req.params.clientId || req.user.id;
    const supportTeam = await db.SupportTeamMember.findAll({
      where: { clientId },
      include: [{ model: db.User, as: 'member', attributes: ['id', 'name', 'email', 'role'] }]
    });
    
    const formattedSupportTeam = supportTeam.map(member => ({
      id: member.id,
      name: member.member ? member.member.name : 'Unknown',
      email: member.member ? member.member.email : 'Unknown',
      role: member.role
    }));
    
    res.json(formattedSupportTeam);
  } catch (error) {
    console.error('Error fetching support team:', error);
    res.status(500).json({ message: 'Error fetching support team', error: error.message });
  }
};

exports.getAssignedServiceWorkers = async (req, res) => {
  try {
    const userId = req.user.id;
    const assignedServiceWorkers = await db.sequelize.query(`
      SELECT 
        u.id, u.name, u.email, u.status, r.name as role, u.phoneNumber,
        ust.id as supportTeamId
      FROM users u
      JOIN usersupportteams ust ON u.id = ust.support_worker_id
      JOIN roles r ON u.roleId = r.id
      WHERE ust.user_id = :userId
    `, {
      replacements: { userId },
      type: db.Sequelize.QueryTypes.SELECT
    });

    if (assignedServiceWorkers.length === 0) {
      return res.json({ message: 'No assigned service workers found', workers: [] });
    }

    const formattedWorkers = assignedServiceWorkers.map(worker => ({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      status: worker.status,
      role: worker.role,
      phoneNumber: worker.phoneNumber,
      supportTeamId: worker.supportTeamId
    }));

    res.json({ message: 'Assigned service workers fetched successfully', workers: formattedWorkers });
  } catch (error) {
    console.error('Error fetching assigned service workers:', error);
    res.status(500).json({ message: 'Error fetching assigned service workers', error: error.message });
  }
};

exports.addSupportTeamMember = async (req, res) => {
  try {
    const { clientId, userId, role } = req.body;
    const supportTeamMember = await db.SupportTeamMember.create({ clientId, userId, role });
    res.status(201).json(supportTeamMember);
  } catch (error) {
    console.error('Error adding support team member:', error);
    res.status(400).json({ message: 'Error adding support team member', error: error.message });
  }
};

exports.updateSupportTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const supportTeamMember = await db.SupportTeamMember.findByPk(id);
    if (!supportTeamMember) {
      return res.status(404).json({ message: 'Support team member not found' });
    }
    await supportTeamMember.update({ role });
    res.json(supportTeamMember);
  } catch (error) {
    console.error('Error updating support team member:', error);
    res.status(400).json({ message: 'Error updating support team member', error: error.message });
  }
};

exports.removeSupportTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const supportTeamMember = await db.SupportTeamMember.findByPk(id);
    if (!supportTeamMember) {
      return res.status(404).json({ message: 'Support team member not found' });
    }
    await supportTeamMember.destroy();
    res.json({ message: 'Support team member removed successfully' });
  } catch (error) {
    console.error('Error removing support team member:', error);
    res.status(500).json({ message: 'Error removing support team member', error: error.message });
  }
};exports.updateAdminSupportTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const supportTeamMember = await db.SupportTeamMember.findByPk(id);
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