// models/ActivityLog.js
module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define('ActivityLog', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      activityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'activity_logs',
      timestamps: true,
    });
  
    ActivityLog.associate = (models) => {
      ActivityLog.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Ensure this alias matches how you reference it in queries
      });
    };
  
    return ActivityLog;
  };
  