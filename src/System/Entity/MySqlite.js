import sqlite3 from 'sqlite3';
const sqlite3_instance = sqlite3.verbose();

export default class Model {
  constructor(tableName, fields) {
    this.tableName = tableName;
    this.fields = fields;
  }

  static db = new sqlite3_instance.Database('bot.sqlite');

  static async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async createTable() {
    const fieldDefinitions = this.fields.map(field => `${field} TEXT`).join(', ');
    const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${fieldDefinitions})`;
    return this.query(sql);
  }

  static async initialize() {
    await this.createTable();
  }

  static async create(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    
    return this.query(sql, values);
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await this.query(sql, [id]);
    return rows[0];
  }

  static async findAll() {
    const sql = `SELECT * FROM ${this.tableName}`;
    return this.query(sql);
  }

  static async update(id, data) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    
    return this.query(sql, values);
  }

  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return this.query(sql, [id]);
  }
}