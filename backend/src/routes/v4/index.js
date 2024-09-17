//inclusive-aid\backend\src\routes\v3\index.js
const express = require('express');
const router = express.Router();

const roleRoutes = require('./roles');



router.use('/roles', roleRoutes);
router.use('/permissions', roleRoutes);


module.exports = router;