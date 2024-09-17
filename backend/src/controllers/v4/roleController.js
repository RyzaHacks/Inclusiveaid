const db = require('../../config/database');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await db.Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
};

exports.createRole = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { name, description, permissions = [], dashboardConfig = {}, sidebarItems = [] } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const newRole = await db.Role.create({ name, description, dashboardConfig, sidebarItems }, { transaction });

    if (permissions.length) {
      const permissionIds = permissions.map(permission => 
        typeof permission === 'object' ? permission.id : permission
      ).filter(id => id != null);

      if (permissionIds.length > 0) {
        await newRole.setPermissions(permissionIds, { transaction });
      }
    }

    await transaction.commit();

    const roleWithPermissions = await db.Role.findOne({
      where: { id: newRole.id },
      include: ['permissions'],
    });

    res.status(201).json(roleWithPermissions);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions = [], dashboardConfig, sidebarItems } = req.body;

    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.update({ name, description, dashboardConfig, sidebarItems });

    const permissionIds = permissions.map(permission => 
      typeof permission === 'object' ? permission.id : permission
    ).filter(id => id != null);

    await role.setPermissions(permissionIds);

    const updatedRole = await db.Role.findOne({
      where: { id },
      include: ['permissions'],
    });

    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Error deleting role', error: error.message });
  }
};

exports.updateRoleDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { dashboardConfig } = req.body;

    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.update({ dashboardConfig });
    res.json(role);
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    res.status(500).json({ message: 'Error updating dashboard config', error: error.message });
  }
};

exports.updateRoleSidebar = async (req, res) => {
  try {
    const { id } = req.params;
    const { sidebarItems } = req.body;

    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.update({ sidebarItems });
    res.json(role);
  } catch (error) {
    console.error('Error updating sidebar items:', error);
    res.status(500).json({ message: 'Error updating sidebar items', error: error.message });
  }
};