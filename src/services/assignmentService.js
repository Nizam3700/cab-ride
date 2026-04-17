const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const DistanceService = require('./distanceService');

class AssignmentService {
  static async assignNearestDriver(rideId, pickupX, pickupY) {
    try {
      const availableDrivers = await Driver.getAvailableDrivers();
      
      if (!availableDrivers || availableDrivers.length === 0) {
        throw new Error('No drivers available');
      }

      const nearestDriver = DistanceService.findNearestDriver(
        pickupX, pickupY, availableDrivers
      );

      if (!nearestDriver) {
        throw new Error('No suitable driver found');
      }

      const fare = DistanceService.calculateFare(nearestDriver.distance);

      await Ride.assignDriver(rideId, nearestDriver.id, nearestDriver.distance, fare);
      await Driver.updateAvailability(nearestDriver.id, false);

      return {
        driver: nearestDriver,
        distance: nearestDriver.distance,
        fare: fare,
        estimatedTime: DistanceService.calculateEstimatedTime(nearestDriver.distance)
      };
    } catch (error) {
      console.error('Assignment error:', error);
      throw error;
    }
  }
}

module.exports = AssignmentService;