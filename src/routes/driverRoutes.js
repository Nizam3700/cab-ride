const express = require('express');
const DriverController = require('../controllers/driverController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['driver']));

router.post('/location', DriverController.updateLocation);
router.put('/availability', DriverController.updateAvailability);
router.get('/profile', DriverController.getDriverProfile);

module.exports = router;