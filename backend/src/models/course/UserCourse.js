module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    progress: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'user_courses',
    timestamps: true,
  });

  UserCourse.associate = (models) => {
    UserCourse.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    UserCourse.belongsTo(models.Course, {
      foreignKey: 'courseId',
    });
  };

  return UserCourse;
};