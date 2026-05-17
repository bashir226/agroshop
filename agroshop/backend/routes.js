import { db, uuidv4 } from './db.js';
import { authMiddleware } from './auth.js';

export async function getCategories(req, res) {
  const categories = await db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories);
}

export async function getProducts(req, res) {
  const { category, search, sort, limit = 50, offset = 0 } = req.query;
  let sql = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND c.slug = ?'; params.push(category); }
  if (search) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (sort === 'price_asc') sql += ' ORDER BY p.price ASC';
  else if (sort === 'price_desc') sql += ' ORDER BY p.price DESC';
  else if (sort === 'new') sql += ' ORDER BY p.created_at DESC';
  else sql += ' ORDER BY p.name ASC';
  sql += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  const products = await db.prepare(sql).all(...params);
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
}

export async function getCart(req, res) {
  const items = await db.prepare(`
    SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.slug, p.price, p.old_price, p.image, p.unit, p.stock
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.user.id);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.json({ items, total });
}

export async function addToCart(req, res) {
  const { product_id, quantity = 1 } = req.body;
  const product = await db.prepare('SELECT id, stock FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  const existing = await db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) return res.status(400).json({ error: 'Недостаточно на складе' });
    await db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
  } else {
    if (quantity > product.stock) return res.status(400).json({ error: 'Недостаточно на складе' });
    await db.prepare('INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)')
      .run(uuidv4(), req.user.id, product_id, quantity);
  }
  res.json({ success: true });
}

export async function updateCartItem(req, res) {
  const { quantity } = req.body;
  const item = await db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!item) return res.status(404).json({ error: 'Не найдено' });
  if (quantity <= 0) {
    await db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
  } else {
    const product = await db.prepare('SELECT stock FROM products WHERE id = ?').get(item.product_id);
    if (quantity > product.stock) return res.status(400).json({ error: 'Недостаточно на складе' });
    await db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  }
  res.json({ success: true });
}

export async function removeFromCart(req, res) {
  await db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
}

export async function clearCart(req, res) {
  await db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
}

export async function createOrder(req, res) {
  const { name, phone, address, comment } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Укажите имя и телефон' });

  const cartItems = await db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.price, p.stock, p.name
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.user.id);

  if (cartItems.length === 0) return res.status(400).json({ error: 'Корзина пуста' });

  for (const item of cartItems) {
    if (item.quantity > item.stock) {
      return res.status(400).json({ error: `Недостаточно "${item.name}" на складе` });
    }
  }

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderId = uuidv4();

  await db.transaction(async () => {
    await db.prepare('INSERT INTO orders (id, user_id, total, name, phone, address, comment) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(orderId, req.user.id, total, name, phone, address || null, comment || null);
    for (const item of cartItems) {
      await db.prepare('INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)')
        .run(uuidv4(), orderId, item.product_id, item.quantity, item.price);
      await db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
    }
    await db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
  })();

  res.status(201).json({ id: orderId, total, message: 'Заказ успешно оформлен' });
}

export async function getOrders(req, res) {
  const orders = await db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  for (const order of orders) {
    order.items = await db.prepare(`
      SELECT oi.quantity, oi.price, p.name, p.slug, p.image
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
  }
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });
  order.items = await db.prepare(`
    SELECT oi.quantity, oi.price, p.name, p.slug, p.image
    FROM order_items oi JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(order.id);
  res.json(order);
}
