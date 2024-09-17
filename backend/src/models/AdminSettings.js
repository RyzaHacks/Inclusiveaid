// models/AdminSettings.js
module.exports = (sequelize, DataTypes) => {
  const AdminSettings = sequelize.define('AdminSettings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    settingKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'admin_settings',
    timestamps: true,
  });

  return AdminSettings;
};