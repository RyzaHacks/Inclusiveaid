module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'courses',
    timestamps: true,
  });

  Course.associate = (models) => {
    Course.belongsToMany(models.User, { 
      through: models.UserCourse,
      foreignKey: 'courseId',
      otherKey: 'userId',
      as: 'enrolledUsers'
    });
    Course.hasMany(models.Module, {
      as: 'modules',
      foreignKey: 'courseId',
      onDelete: 'CASCADE',
    });
    Course.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
    Course.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'lastUpdatedBy',
    });
  };

  return Course;
};