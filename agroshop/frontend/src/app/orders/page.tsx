'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface OrderItem { quantity: number; price: number; name: string; slug: string; }
interface Order { id: string; status: string; total: number; name: string; phone: string; address?: string; comment?: string; created_at: string; items: OrderItem[]; }

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Новый', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Подтверждён', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Отправлен', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      fetch('http://localhost:4000/api/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(r => r.json()).then(data => { setOrders(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Загрузка...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои заказы</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Заказов пока нет</h3>
          <p className="text-gray-500 mb-6">Оформите первый заказ в каталоге</p>
          <Link href="/catalog" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-gray-900">Заказ #{order.id.slice(0, 8)}</span>
                    <span className="text-sm text-gray-400 ml-3">{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="text-gray-900 font-medium">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{order.name} · {order.phone}</span>
                  <span className="font-bold text-gray-900">{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
