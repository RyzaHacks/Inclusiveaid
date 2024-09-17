//inclusive-aid\backend\src\config\database.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('../models/User')(sequelize, DataTypes);
db.Role = require('../models/Role')(sequelize, DataTypes);
db.Permission = require('../models/Permission')(sequelize, DataTypes); // Add this line
db.Service = require('../models/Service')(sequelize, DataTypes);
db.ServiceAssignment = require('../models/ServiceAssignment')(sequelize, DataTypes);
db.SupportTeamMember = require('../models/SupportTeamMember')(sequelize, DataTypes);
db.NDISPlan = require('../models/NDISPlan')(sequelize, DataTypes);
db.Notification = require('../models/Notification')(sequelize, DataTypes);
db.Message = require('../models/Message')(sequelize, DataTypes);
db.ActivityLog = require('../models/ActivityLog')(sequelize, DataTypes);
db.Resource = require('../models/Resource')(sequelize, DataTypes);
db.ServiceWorker = require('../models/ServiceWorker')(sequelize, DataTypes);

// Import course-related models
db.Course = require('../models/course/Course')(sequelize, DataTypes);
db.Module = require('../models/course/Module')(sequelize, DataTypes);
db.Unit = require('../models/course/Unit')(sequelize, DataTypes);
db.UserCourse = require('../models/course/UserCourse')(sequelize, DataTypes);

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
