module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    duration: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'requested', 'assigned', 'scheduled', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
  }, {
    tableName: 'services',
    timestamps: true,
  });

  Service.associate = models => {
    Service.hasMany(models.ServiceAssignment, {
      foreignKey: 'serviceId',
      as: 'assignments',
    });

    // Many-to-Many relationship with ServiceWorker through ServiceAssignment
    Service.belongsToMany(models.ServiceWorker, {
      through: models.ServiceAssignment,
      foreignKey: 'serviceId',
      otherKey: 'serviceWorkerId',
      as: 'serviceWorkers'
    });
  };

  return Service;
};