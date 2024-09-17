module.exports = (sequelize, DataTypes) => {
  const SupportTeamMember = sequelize.define('SupportTeamMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM('support_worker', 'service_worker', 'care_coordinator'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isNdisPlanManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'support_team_members',
    timestamps: true,
  });

  SupportTeamMember.associate = models => {
    SupportTeamMember.belongsTo(models.User, { as: 'member', foreignKey: 'userId' });
    SupportTeamMember.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' });
    SupportTeamMember.hasMany(models.ServiceAssignment, { foreignKey: 'supportTeamMemberId', as: 'assignments' });
  };

  return SupportTeamMember;
};