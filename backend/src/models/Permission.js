// src/models/Permission.js
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
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
  }, {
      tableName: 'permissions',
      timestamps: true,
  });

  Permission.associate = (models) => {
      Permission.belongsToMany(models.Role, {
          through: 'RolePermissions',
          as: 'roles',
          foreignKey: 'permissionId'
      });
  };

  return Permission;
};
