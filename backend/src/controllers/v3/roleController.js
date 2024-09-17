// src/controllers/v3/roleController.js
const db = require('../../config/database');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      include: [{ model: db.Permission, as: 'permissions' }]
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions, dashboardConfig, sidebarItems } = req.body;
    const newRole = await db.Role.create({ name, description, dashboardConfig, sidebarItems });
    
    if (permissions && permissions.length > 0) {
      await newRole.setPermissions(permissions);
    }
    
    const roleWithPermissions = await db.Role.findByPk(newRole.id, {
      include: [{ model: db.Permission, as: 'permissions' }]
    });
    
    res.status(201).json(roleWithPermissions);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, dashboardConfig, sidebarItems } = req.body;
    
    const [updated] = await db.Role.update({ name, description, dashboardConfig, sidebarItems }, { where: { id } });
    if (updated) {
      const role = await db.Role.findByPk(id);
      if (permissions) {
        await role.setPermissions(permissions);
      }
      const updatedRole = await db.Role.findByPk(id, {
        include: [{ model: db.Permission, as: 'permissions' }]
      });
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.Role.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Error deleting role', error: error.message });
  }
};

exports.updateRoleDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { dashboardConfig } = req.body;
    
    const [updated] = await db.Role.update({ dashboardConfig }, { where: { id } });
    if (updated) {
      const updatedRole = await db.Role.findByPk(id);
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error updating role dashboard:', error);
    res.status(500).json({ message: 'Error updating role dashboard', error: error.message });
  }
};

exports.updateRoleSidebar = async (req, res) => {
  try {
    const { id } = req.params;
    const { sidebarItems } = req.body;
    
    const [updated] = await db.Role.update({ sidebarItems }, { where: { id } });
    if (updated) {
      const updatedRole = await db.Role.findByPk(id);
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error updating role sidebar:', error);
    res.status(500).json({ message: 'Error updating role sidebar', error: error.message });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.User.findByPk(userId, {
      include: [{
        model: db.Role,
        attributes: ['id', 'name', 'sidebarItems']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = user.Role;
    if (!role) {
      return res.status(404).json({ message: 'Role not found for this user' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Error fetching user role', error: error.message });
  }
};

exports.getDashboardConfig = async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await db.Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role.dashboardConfig || {});
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    res.status(500).json({ message: 'Error fetching dashboard configuration', error: error.message });
  }
};

exports.updateDashboardConfig = async (req, res) => {
  try {
    const { roleName } = req.params;
    const { dashboardConfig } = req.body;

    const [updated] = await db.Role.update(
      { dashboardConfig },
      { where: { name: roleName } }
    );

    if (updated) {
      const updatedRole = await db.Role.findOne({ where: { name: roleName } });
      res.json(updatedRole.dashboardConfig);
    } else {
      res.status(400).json({ message: 'Dashboard configuration update failed' });
    }
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    res.status(500).json({ message: 'Error updating dashboard configuration', error: error.message });
  }
};
exports.getDashboardConfigByUser = async (req, res) => {
  try {
    const user = req.user; // Ensure req.user is populated by the auth middleware

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const role = user.role;

    if (!role) {
      return res.status(404).json({ message: 'Role not found for user' });
    }

    res.json({
      dashboardConfig: role.dashboardConfig || {},
      sidebarItems: role.sidebarItems || [],
    });
  } catch (error) {
    console.error('Error fetching dashboard configuration:', error);
    res.status(500).json({ message: 'Error fetching dashboard configuration' });
  }
};

// roleController.js
exports.getDashboardConfigByRole = async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await db.Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({
      dashboardConfig: role.dashboardConfig || {},
      sidebarItems: role.sidebarItems || [],
    });
  } catch (error) {
    console.error('Error fetching dashboard configuration:', error);
    res.status(500).json({ message: 'Error fetching dashboard configuration' });
  }
};


exports.getRoleSidebar = async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await db.Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role.sidebarItems || []);
  } catch (error) {
    console.error('Error fetching role sidebar:', error);
    res.status(500).json({ message: 'Error fetching role sidebar', error: error.message });
  }
};

// This function can be used to get both dashboard config and sidebar items for a specific role
exports.getRoleConfigAndSidebar = async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await db.Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({
      dashboardConfig: role.dashboardConfig || {},
      sidebarItems: role.sidebarItems || []
    });
  } catch (error) {
    console.error('Error fetching role config and sidebar:', error);
    res.status(500).json({ message: 'Error fetching role configuration and sidebar', error: error.message });
  }
};

// This function can be used to update both dashboard config and sidebar items for a specific role
exports.updateRoleConfigAndSidebar = async (req, res) => {
  try {
    const { roleName } = req.params;
    const { dashboardConfig, sidebarItems } = req.body;

    const [updated] = await db.Role.update(
      { dashboardConfig, sidebarItems },
      { where: { name: roleName } }
    );

    if (updated) {
      const updatedRole = await db.Role.findOne({ where: { name: roleName } });
      res.json({
        dashboardConfig: updatedRole.dashboardConfig,
        sidebarItems: updatedRole.sidebarItems
      });
    } else {
      res.status(404).json({ message: 'Role not found or update failed' });
    }
  } catch (error) {
    console.error('Error updating role config and sidebar:', error);
    res.status(500).json({ message: 'Error updating role configuration and sidebar', error: error.message });
  }
};

// This function can be used to get all roles with their associated permissions
exports.getAllRolesWithPermissions = async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      include: [{ model: db.Permission, as: 'permissions' }]
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles with permissions:', error);
    res.status(500).json({ message: 'Error fetching roles with permissions', error: error.message });
  }
};

// This function can be used to assign a role to a user
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const user = await db.User.findByPk(userId);
    const role = await db.Role.findByPk(roleId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await user.setRole(role);
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Error assigning role to user:', error);
    res.status(500).json({ message: 'Error assigning role to user', error: error.message });
  }
};

module.exports = exports;