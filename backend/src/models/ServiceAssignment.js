module.exports = (sequelize, DataTypes) => {
  const ServiceAssignment = sequelize.define('ServiceAssignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    notes: DataTypes.TEXT,
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    supportTeamMemberId: DataTypes.INTEGER,
    ndisPlanId: DataTypes.INTEGER,
    serviceWorkerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'service_assignments',
    timestamps: true,
  });

  ServiceAssignment.associate = (models) => {
    ServiceAssignment.belongsTo(models.User, { 
      foreignKey: 'clientId', 
      as: 'client' 
    });
    
    ServiceAssignment.belongsTo(models.Service, { 
      foreignKey: 'serviceId', 
      as: 'service' 
    });
    
    ServiceAssignment.belongsTo(models.SupportTeamMember, { 
      foreignKey: 'supportTeamMemberId', 
      as: 'supportTeamMember' 
    });
    
    ServiceAssignment.belongsTo(models.ServiceWorker, { 
      foreignKey: 'serviceWorkerId', 
      as: 'serviceWorker' 
    });
    
    ServiceAssignment.belongsTo(models.NDISPlan, { 
      foreignKey: 'ndisPlanId', 
      as: 'ndisPlan' 
    });
    
    // Association to link directly to User model for service worker
    ServiceAssignment.belongsTo(models.User, { 
      foreignKey: 'serviceWorkerId', 
      as: 'serviceWorkerUser' 
    });
  };

  return ServiceAssignment;
};