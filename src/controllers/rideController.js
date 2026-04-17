const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const AssignmentService = require('../services/assignmentService');

class RideController {
  static async requestRide(req, res) {
    try {
      const { pickup_x, pickup_y } = req.body;
      
      if (pickup_x === undefined || pickup_y === undefined) {
        return res.status(400).json({ error: 'Pickup coordinates are required' });
      }
      
      const availableDrivers = await Driver.getAvailableDrivers();
      
      if (!availableDrivers || availableDrivers.length === 0) {
        return res.status(404).json({ error: 'No drivers available' });
      }
      
      const ride = await Ride.create({
        user_id: req.user.id,
        pickup_x,
        pickup_y
      });
      
      const assignment = await AssignmentService.assignNearestDriver(
        ride.id,
        pickup_x,
        pickup_y
      );
      
      res.status(201).json({
        message: 'Ride assigned successfully',
        ride_id: ride.id,
        driver: {
          name: assignment.driver.name,
          phone: assignment.driver.phone,
          vehicle: assignment.driver.vehicle_number
        },
        distance: assignment.distance.toFixed(2),
        fare: assignment.fare
      });
    } catch (error) {
      console.error('Request ride error:', error);
      res.status(500).json({ error: error.message || 'Failed to request ride' });
    }
  }
  
  static async getRideHistory(req, res) {
    try {
      let rides;
      
      if (req.user.role === 'user') {
        rides = await Ride.findByUser(req.user.id);
      } else if (req.user.role === 'driver') {
        const driver = await Driver.findByUserId(req.user.id);
        if (!driver) {
          return res.status(404).json({ error: 'Driver not found' });
        }
        rides = await Ride.findByDriver(driver.id);
      }
      
      res.json(rides);
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Failed to fetch rides' });
    }
  }
  
  static async getActiveRide(req, res) {
    try {
      let ride = null;
      
      if (req.user.role === 'user') {
        const rides = await Ride.findByUser(req.user.id);
        ride = rides.find(r => r.status === 'assigned');
      } else if (req.user.role === 'driver') {
        const driver = await Driver.findByUserId(req.user.id);
        if (driver) {
          const rides = await Ride.findByDriver(driver.id);
          ride = rides.find(r => r.status === 'assigned');
        }
      }
      
      res.json({ active_ride: ride });
    } catch (error) {
      console.error('Get active ride error:', error);
      res.status(500).json({ error: 'Failed to fetch active ride' });
    }
  }
  
  static async completeRide(req, res) {
    try {
      const { id } = req.params;
      const { drop_x, drop_y } = req.body;
      
      const ride = await Ride.findById(id);
      if (!ride) {
        return res.status(404).json({ error: 'Ride not found' });
      }
      
      const driver = await Driver.findByUserId(req.user.id);
      if (!driver || ride.driver_id !== driver.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      await Ride.completeRide(id, drop_x, drop_y);
      await Driver.updateAvailability(driver.id, true);
      
      res.json({ message: 'Ride completed successfully' });
    } catch (error) {
      console.error('Complete ride error:', error);
      res.status(500).json({ error: 'Failed to complete ride' });
    }
  }
}

module.exports = RideController;