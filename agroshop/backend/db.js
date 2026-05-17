import initSqlJs from 'sql.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const dbFile = 'agroshop.db';

let SQL;
async function getSQL() {
  if (!SQL) SQL = await initSqlJs();
  return SQL;
}

async function loadDb() {
  const SQL = await getSQL();
  let db;
  try {
    const buffer = fs.readFileSync(dbFile);
    db = new SQL.Database(buffer);
  } catch {
    db = new SQL.Database();
  }
  return db;
}

function saveDb(db) {
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

let dbInstance = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await loadDb();
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
        name TEXT NOT NULL, phone TEXT, created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
        description TEXT, image TEXT
      );
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY, category_id TEXT NOT NULL, name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL, description TEXT, price INTEGER NOT NULL,
        old_price INTEGER, image TEXT, stock INTEGER DEFAULT 0, unit TEXT DEFAULT 'шт',
        attributes TEXT, created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, status TEXT DEFAULT 'pending',
        total INTEGER NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL,
        address TEXT, comment TEXT, created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL, price INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY, user_id TEXT NOT NULL, product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE(user_id, product_id)
      );
    `);
    saveDb(dbInstance);
  }
  return dbInstance;
}

// Wrapper to make sql.js work like better-sqlite3
export const db = {
  prepare(sql) {
    return {
      run: async (...params) => {
        const d = await getDb();
        d.run(sql, params);
        saveDb(d);
        return { changes: d.getRowsModified() };
      },
      get: async (...params) => {
        const d = await getDb();
        const stmt = d.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all: async (...params) => {
        const d = await getDb();
        const rows = [];
        d.each(sql, params, (row) => rows.push(row), () => {});
        return rows;
      }
    };
  },
  exec: async (sql) => {
    const d = await getDb();
    d.run(sql);
    saveDb(d);
  },
  transaction: (fn) => {
    return async (...args) => {
      const d = await getDb();
      try {
        d.run('BEGIN');
        const result = await fn(...args);
        d.run('COMMIT');
        saveDb(d);
        return result;
      } catch (e) {
        d.run('ROLLBACK');
        throw e;
      }
    };
  }
};

export { uuidv4 };
