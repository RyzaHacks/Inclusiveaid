module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'modules',
    timestamps: true,
  });

  Module.associate = (models) => {
    Module.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
    Module.hasMany(models.Unit, {
      as: 'units',
      foreignKey: 'moduleId',
      onDelete: 'CASCADE',
    });
  };

  return Module;
};