module.exports = (sequelize, DataTypes) => {
  const ServiceWorker = sequelize.define('ServiceWorker', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    qualifications: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    specialties: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    availability: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  }, {
    tableName: 'service_workers',
    timestamps: true,
  });

  ServiceWorker.associate = (models) => {
    ServiceWorker.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    ServiceWorker.hasMany(models.ServiceAssignment, { 
      foreignKey: 'serviceWorkerId', 
      as: 'assignments' 
    });
    ServiceWorker.hasMany(models.NDISPlan, { foreignKey: 'leaderId', as: 'managedPlans' });
    
    // Many-to-Many relationship with Service through ServiceAssignment
    ServiceWorker.belongsToMany(models.Service, {
      through: models.ServiceAssignment,
      foreignKey: 'serviceWorkerId',
      otherKey: 'serviceId',
      as: 'assignedServices'
    });
  };

  return ServiceWorker;
};