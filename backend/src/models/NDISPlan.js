module.exports = (sequelize, DataTypes) => {
  const NDISPlan = sequelize.define('NDISPlan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    planNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ndisNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalBudget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    usedBudget: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'expired'),
      defaultValue: 'active',
    },
    reviewDate: {
      type: DataTypes.DATE,
    },
    goals: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    fundingCategories: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  }, {
    tableName: 'ndis_plans',
    timestamps: true,
  });

  NDISPlan.associate = models => {
    NDISPlan.belongsTo(models.User, { foreignKey: 'userId', as: 'client' });
    NDISPlan.belongsTo(models.ServiceWorker, { foreignKey: 'leaderId', as: 'leader' });
    NDISPlan.hasMany(models.ServiceAssignment, {
      foreignKey: 'ndisPlanId',
      as: 'serviceAssignments',
    });
  };

  return NDISPlan;
};