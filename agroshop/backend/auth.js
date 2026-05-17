import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, uuidv4 } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agroshop-secret-key-change-in-production';

export async function register(req, res) {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Заполните обязательные поля' });
    }
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = uuidv4();
    await db.prepare('INSERT INTO users (id, email, password, name, phone) VALUES (?, ?, ?, ?, ?)')
      .run(id, email, hashedPassword, name, phone || null);
    const token = jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id, email, name, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' });
    }
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Невалидный токен' });
  }
}

export async function getProfile(req, res) {
  const user = await db.prepare('SELECT id, email, name, phone, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(user);
}
