// src/models/Role.js
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: true,
      },
      dashboardConfig: {
          type: DataTypes.JSON,
          defaultValue: {},
          get() {
              const rawValue = this.getDataValue('dashboardConfig');
              if (typeof rawValue === 'string') {
                  try {
                      return JSON.parse(rawValue);
                  } catch (e) {
                      console.error('Error parsing dashboardConfig:', e);
                      return {};
                  }
              }
              return rawValue || {};
          },
          set(value) {
              this.setDataValue('dashboardConfig', JSON.stringify(value));
          },
      },
      sidebarItems: {
          type: DataTypes.JSON,
          defaultValue: [],
          get() {
              const rawValue = this.getDataValue('sidebarItems');
              if (typeof rawValue === 'string') {
                  try {
                      return JSON.parse(rawValue);
                  } catch (e) {
                      console.error('Error parsing sidebarItems:', e);
                      return [];
                  }
              }
              return rawValue || [];
          },
          set(value) {
              this.setDataValue('sidebarItems', JSON.stringify(value));
          }
      },
  }, {
      tableName: 'roles',
      timestamps: true,
  });

  Role.associate = (models) => {
      Role.belongsToMany(models.User, {
          through: 'UserRoles',
          as: 'users',
          foreignKey: 'roleId'
      });
      Role.belongsToMany(models.Permission, {
          through: 'RolePermissions',
          as: 'permissions',
          foreignKey: 'roleId'
      });
  };

  return Role;
};
