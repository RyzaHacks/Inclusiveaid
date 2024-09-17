const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');

// v1 routes
const v1Routes = require('./routes/v1');

// v2 routes
const v2Routes = require('./routes/v2');

// v3 routes
const v3Routes = require('./routes/v3');

// v3 routes
const v4Routes = require('./routes/v4');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

db.sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synced.'))
  .catch(err => console.error('Error syncing database:', err));

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use('/api/v3', v3Routes);
app.use('/api/v4', v4Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;