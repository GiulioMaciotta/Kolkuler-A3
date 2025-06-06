// Para preparar SQLite
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/app.db');
const db = new Database(dbPath);

export default db;