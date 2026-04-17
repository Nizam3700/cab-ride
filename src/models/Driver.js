const { getDB } = require('./init');

class Driver {
  static async create(driverData) {
    const db = getDB();
    const { user_id, name, phone, vehicle_number } = driverData;
    
    const [result] = await db.execute(
      `INSERT INTO drivers (user_id, name, phone, vehicle_number) VALUES (?, ?, ?, ?)`,
      [user_id, name, phone, vehicle_number]
    );
    
    return { id: result.insertId, ...driverData };
  }

  static async findByUserId(userId) {
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM drivers WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async findById(driverId) {
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM drivers WHERE id = ?', [driverId]);
    return rows[0];
  }

  static async updateLocation(driverId, x, y) {
    const db = getDB();
    const [result] = await db.execute(
      'UPDATE drivers SET current_x = ?, current_y = ? WHERE id = ?',
      [x, y, driverId]
    );
    return { changes: result.affectedRows };
  }

  static async updateAvailability(driverId, isAvailable) {
    const db = getDB();
    const [result] = await db.execute(
      'UPDATE drivers SET is_available = ? WHERE id = ?',
      [isAvailable ? 1 : 0, driverId]
    );
    return { changes: result.affectedRows };
  }

  static async getAvailableDrivers() {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT d.*, u.username 
       FROM drivers d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.is_available = 1`
    );
    return rows;
  }
}

module.exports = Driver;