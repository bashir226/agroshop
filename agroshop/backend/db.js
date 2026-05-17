import { v4 as uuidv4 } from 'uuid';

const USE_PG = !!process.env.DATABASE_URL;

let pgPool = null;

async function getPgPool() {
  if (!pgPool) {
    const { Pool } = await import('pg');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pgPool;
}

async function initPgDb() {
  const pool = await getPgPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
      name TEXT NOT NULL, phone TEXT, created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      description TEXT, image TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id),
      name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT,
      price INTEGER NOT NULL, old_price INTEGER, image TEXT, stock INTEGER DEFAULT 0,
      unit TEXT DEFAULT 'шт', attributes TEXT, created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      status TEXT DEFAULT 'pending', total INTEGER NOT NULL, name TEXT NOT NULL,
      phone TEXT NOT NULL, address TEXT, comment TEXT, created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL, price INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, product_id)
    );
  `);
}

// SQLite fallback for local dev
let sqlJsDb = null;

async function getSqlJsDb() {
  if (!sqlJsDb) {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    const fs = (await import('fs')).default;
    const dbFile = 'agroshop.db';
    try {
      const buffer = fs.readFileSync(dbFile);
      sqlJsDb = new SQL.Database(buffer);
    } catch {
      sqlJsDb = new SQL.Database();
    }
    sqlJsDb.run(`
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
    saveSqlDb();
  }
  return sqlJsDb;
}

function saveSqlDb() {
  if (sqlJsDb) {
    const fs = require('fs');
    const data = sqlJsDb.export();
    fs.writeFileSync('agroshop.db', Buffer.from(data));
  }
}

function rowToObj(row, columns) {
  if (!row) return undefined;
  const obj = {};
  columns.forEach((col, i) => { obj[col] = row[i]; });
  return obj;
}

function rowsToArr(rows) {
  if (!rows || rows.length === 0) return [];
  return rows.map(r => rowToObj(r, r.__columns || Object.keys(r)));
}

// Unified db interface
export const db = {
  prepare(sql) {
    // Convert SQLite-style ? placeholders to $1, $2, etc for PG
    let pgSql = sql;
    let paramIndex = 0;
    pgSql = pgSql.replace(/\?/g, () => `$${++paramIndex}`);

    return {
      run: async (...params) => {
        if (USE_PG) {
          const pool = await getPgPool();
          const result = await pool.query(pgSql, params);
          return { changes: result.rowCount };
        } else {
          const d = await getSqlJsDb();
          d.run(sql, params);
          saveSqlDb();
          return { changes: d.getRowsModified() };
        }
      },
      get: async (...params) => {
        if (USE_PG) {
          const pool = await getPgPool();
          const result = await pool.query(pgSql, params);
          return result.rows[0];
        } else {
          const d = await getSqlJsDb();
          const stmt = d.prepare(sql);
          stmt.bind(params);
          if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return row;
          }
          stmt.free();
          return undefined;
        }
      },
      all: async (...params) => {
        if (USE_PG) {
          const pool = await getPgPool();
          const result = await pool.query(pgSql, params);
          return result.rows;
        } else {
          const d = await getSqlJsDb();
          const rows = [];
          d.each(sql, params, (row) => rows.push(row), () => {});
          return rows;
        }
      }
    };
  },
  exec: async (sql) => {
    if (USE_PG) {
      const pool = await getPgPool();
      await pool.query(sql);
    } else {
      const d = await getSqlJsDb();
      d.run(sql);
      saveSqlDb();
    }
  },
  transaction: (fn) => {
    return async (...args) => {
      if (USE_PG) {
        const pool = await getPgPool();
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const result = await fn(...args);
          await client.query('COMMIT');
          return result;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      } else {
        const d = await getSqlJsDb();
        try {
          d.run('BEGIN');
          const result = await fn(...args);
          d.run('COMMIT');
          saveSqlDb();
          return result;
        } catch (e) {
          d.run('ROLLBACK');
          throw e;
        }
      }
    };
  }
};

export async function initDb() {
  if (USE_PG) {
    await initPgDb();
  } else {
    await getSqlJsDb();
  }
}

export { uuidv4 };
