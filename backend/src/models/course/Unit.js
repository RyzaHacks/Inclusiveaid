module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.ENUM('text', 'video', 'audio', 'quiz'),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: 'units',
    timestamps: true,
  });

  Unit.associate = (models) => {
    Unit.belongsTo(models.Module, {
      foreignKey: 'moduleId',
      as: 'module',
    });
  };

  return Unit;
};