const API = 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setToken(token: string) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeToken?.() ?? localStorage.removeItem('token');
}

async function fetchApi(url: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${url}`, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name: string, phone?: string) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, phone }) }),
  getProfile: () => fetchApi('/auth/me'),

  // Categories
  getCategories: () => fetchApi('/categories'),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchApi(`/products${qs}`);
  },
  getProduct: (slug: string) => fetchApi(`/products/${slug}`),

  // Cart
  getCart: () => fetchApi('/cart'),
  addToCart: (product_id: string, quantity = 1) => fetchApi('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateCart: (id: string, quantity: number) => fetchApi(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeFromCart: (id: string) => fetchApi(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => fetchApi('/cart', { method: 'DELETE' }),

  // Orders
  createOrder: (data: { name: string; phone: string; address?: string; comment?: string }) =>
    fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => fetchApi('/orders'),
  getOrder: (id: string) => fetchApi(`/orders/${id}`),
};

export { getToken, setToken, removeToken };
