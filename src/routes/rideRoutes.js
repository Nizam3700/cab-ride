const express = require('express');
const RideController = require('../controllers/rideController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/request', RideController.requestRide);
router.get('/history', RideController.getRideHistory);
router.get('/active', RideController.getActiveRide);
router.post('/:id/complete', RideController.completeRide);

module.exports = router;