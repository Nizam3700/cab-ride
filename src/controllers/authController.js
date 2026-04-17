const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password, role, name, phone, vehicle_number } = req.body;
      
      if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password and role are required' });
      }
      
      if (!['user', 'driver'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      
      if (role === 'driver' && (!name || !phone || !vehicle_number)) {
        return res.status(400).json({ error: 'Driver details are required' });
      }
      
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      
      const user = await User.create({ username, password, role });
      
      if (role === 'driver') {
        await Driver.create({
          user_id: user.id,
          name,
          phone,
          vehicle_number
        });
      }
      
      res.status(201).json({
        message: 'Registration successful',
        user: { id: user.id, username: user.username, role }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
  
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }
      
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValid = await User.verifyPassword(user, password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      let driverData = null;
      if (user.role === 'driver') {
        driverData = await Driver.findByUserId(user.id);
      }
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          driver: driverData
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
}

module.exports = AuthController;