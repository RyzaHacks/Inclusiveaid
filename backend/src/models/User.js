module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'away'),
      defaultValue: 'offline',
    },
    phoneNumber: DataTypes.STRING(20),
    address: DataTypes.TEXT,
    dateOfBirth: DataTypes.DATE,
    emergencyContact: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLoginAt: DataTypes.DATE,
    lastLogoutAt: DataTypes.DATE,
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.hasOne(models.ServiceWorker, { foreignKey: 'userId', as: 'serviceWorkerProfile' });
    User.hasMany(models.ServiceAssignment, {
      foreignKey: 'clientId',
      as: 'clientAssignments',
    });
    User.hasMany(models.SupportTeamMember, {
      foreignKey: 'userId',
      as: 'supportTeamMemberships',
    });
    User.hasMany(models.SupportTeamMember, {
      foreignKey: 'clientId',
      as: 'supportTeam',
    });
    User.hasOne(models.NDISPlan, { 
      foreignKey: 'userId', 
      as: 'ndisPlan', 
    });
    User.hasMany(models.Notification, { 
      foreignKey: 'userId', 
      as: 'notifications', 
    });
    User.hasMany(models.ActivityLog, {
      foreignKey: 'userId',
      as: 'activityLogs',
    });
    User.belongsToMany(models.Course, {
      through: models.UserCourse,
      as: 'enrolledCourses',
      foreignKey: 'userId',
    });
    User.hasMany(models.Course, {
      foreignKey: 'createdBy',
      as: 'createdCourses',
    });
    User.hasMany(models.Course, {
      foreignKey: 'updatedBy',
      as: 'updatedCourses',
    });
    User.hasMany(models.Message, {
      foreignKey: 'senderId',
      as: 'sentMessages',
    });
    User.hasMany(models.Message, {
      foreignKey: 'receiverId',
      as: 'receivedMessages',
    });
  };

  return User;
};