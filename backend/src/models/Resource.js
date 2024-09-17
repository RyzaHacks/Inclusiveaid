// models/Resource.js
module.exports = (sequelize, DataTypes) => {
    const Resource = sequelize.define('Resource', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,  // Updated to allow null since we have the content
        },
        content: {
            type: DataTypes.TEXT,  // New field for full content
            allowNull: false,
        },
        videoUrl: {
            type: DataTypes.STRING,  // New field for video URL
            allowNull: true,
        },
    }, {
        tableName: 'resources',
        timestamps: true,
    });

    return Resource;
};
