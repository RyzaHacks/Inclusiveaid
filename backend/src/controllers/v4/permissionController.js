const db = require('../../config/database');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await db.Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions = [] } = req.body;

    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

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
    console.error('Error updating role permissions:', error);
    res.status(500).json({ message: 'Error updating role permissions', error: error.message });
  }
};