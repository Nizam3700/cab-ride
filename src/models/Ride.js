const { getDB } = require('./init');

class Ride {
  static async create(rideData) {
    const db = getDB();
    const { user_id, pickup_x, pickup_y } = rideData;
    
    const [result] = await db.execute(
      'INSERT INTO rides (user_id, pickup_x, pickup_y, status) VALUES (?, ?, ?, ?)',
      [user_id, pickup_x, pickup_y, 'pending']
    );
    
    return { id: result.insertId, ...rideData, status: 'pending' };
  }

  static async assignDriver(rideId, driverId, distance, fare) {
    const db = getDB();
    const [result] = await db.execute(
      `UPDATE rides 
       SET driver_id = ?, status = 'assigned', distance = ?, fare = ? 
       WHERE id = ?`,
      [driverId, distance, fare, rideId]
    );
    return { changes: result.affectedRows };
  }

  static async findByUser(userId) {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT r.*, d.name as driver_name, d.vehicle_number 
       FROM rides r 
       LEFT JOIN drivers d ON r.driver_id = d.id 
       WHERE r.user_id = ? 
       ORDER BY r.requested_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findByDriver(driverId) {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT r.*, u.username as user_name 
       FROM rides r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.driver_id = ? 
       ORDER BY r.requested_at DESC`,
      [driverId]
    );
    return rows;
  }

  static async findById(rideId) {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT r.*, d.name as driver_name, u.username as user_name 
       FROM rides r 
       LEFT JOIN drivers d ON r.driver_id = d.id 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [rideId]
    );
    return rows[0];
  }
}

module.exports = Ride;