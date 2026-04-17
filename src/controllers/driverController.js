const Driver = require('../models/Driver');

class DriverController {
  static async updateLocation(req, res) {
    try {
      const { x, y } = req.body;
      
      if (x === undefined || y === undefined) {
        return res.status(400).json({ error: 'X and Y coordinates are required' });
      }
      
      const driver = await Driver.findByUserId(req.user.id);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
      
      await Driver.updateLocation(driver.id, x, y);
      
      res.json({
        message: 'Location updated',
        location: { x, y }
      });
    } catch (error) {
      console.error('Update location error:', error);
      res.status(500).json({ error: 'Failed to update location' });
    }
  }
  
  static async updateAvailability(req, res) {
    try {
      const { is_available } = req.body;
      
      if (is_available === undefined) {
        return res.status(400).json({ error: 'Availability status required' });
      }
      
      const driver = await Driver.findByUserId(req.user.id);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
      
      await Driver.updateAvailability(driver.id, is_available);
      
      res.json({
        message: `Driver is now ${is_available ? 'available' : 'unavailable'}`,
        is_available
      });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ error: 'Failed to update availability' });
    }
  }
  
  static async getDriverProfile(req, res) {
    try {
      const driver = await Driver.findByUserId(req.user.id);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
      
      res.json(driver);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}

module.exports = DriverController;