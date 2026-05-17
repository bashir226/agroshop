'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, total, refresh } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) { router.push('/login'); return null; }
  if (items.length === 0 && !success) { router.push('/cart'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createOrder({ name, phone, address, comment });
      setSuccess(true);
      await refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Заказ оформлен!</h2>
        <p className="text-gray-500 mb-6">Мы свяжемся с вами для подтверждения</p>
        <div className="flex gap-3 justify-center">
          <Link href="/orders" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Мои заказы</Link>
          <Link href="/catalog" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">В каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Оформление заказа</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition" placeholder="Город, улица, дом" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition resize-none" placeholder="Пожелания к заказу..." />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Оформление...' : `Оплатить ${total.toLocaleString('ru-RU')} ₽`}
          </button>
        </form>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">Ваш заказ</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900 shrink-0">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Итого</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
