const { getDB } = require('./init');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const db = getDB();
    const { username, password, role } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );
    
    return { id: result.insertId, username, role };
  }

  static async findByUsername(username) {
    const db = getDB();
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findById(id) {
    const db = getDB();
    const [rows] = await db.execute('SELECT id, username, role FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;