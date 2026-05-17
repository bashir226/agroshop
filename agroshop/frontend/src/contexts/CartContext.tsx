'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem { id: string; quantity: number; product_id: string; name: string; slug: string; price: number; old_price?: number; image?: string; unit: string; stock: number; }
interface CartContextType { items: CartItem[]; total: number; count: number; loading: boolean; addItem: (product_id: string, qty?: number) => Promise<void>; updateItem: (id: string, qty: number) => Promise<void>; removeItem: (id: string) => Promise<void>; refresh: () => Promise<void>; }

const CartContext = createContext<CartContextType>({ items: [], total: 0, count: 0, loading: false, addItem: async () => {}, updateItem: async () => {}, removeItem: async () => {}, refresh: async () => {} });

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setTotal(0); return; }
    setLoading(true);
    try { const data = await api.getCart(); setItems(data.items); setTotal(data.total); }
    catch { setItems([]); setTotal(0); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = async (product_id: string, qty = 1) => {
    await api.addToCart(product_id, qty);
    await refresh();
  };

  const updateItem = async (id: string, qty: number) => {
    await api.updateCart(id, qty);
    await refresh();
  };

  const removeItem = async (id: string) => {
    await api.removeFromCart(id);
    await refresh();
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <CartContext.Provider value={{ items, total, count, loading, addItem, updateItem, removeItem, refresh }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
