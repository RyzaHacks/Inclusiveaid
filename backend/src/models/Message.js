module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    draft: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'messages',
    timestamps: true,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
    Message.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });
  };

  return Message;
};