'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';

export default function CartPage() {
  const { items, total, loading, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Войдите в аккаунт</h2>
        <p className="text-gray-500 mb-6">Чтобы добавлять товары в корзину</p>
        <Link href="/login" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Войти</Link>
      </div>
    );
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Загрузка...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
        <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
        <Link href="/catalog" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">Перейти в каталог</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
                <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-semibold text-gray-900 hover:text-green-600 transition line-clamp-1">{item.name}</Link>
                <div className="text-sm text-gray-400">{item.price.toLocaleString('ru-RU')} ₽ / {item.unit}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)} className="px-2.5 py-1 hover:bg-gray-50 transition">−</button>
                    <span className="px-3 py-1 border-x border-gray-200 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-2.5 py-1 hover:bg-gray-50 transition">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Итого</h3>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Товары ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>К оплате</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <button onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">
              Оформить заказ
            </button>
            <Link href="/catalog" className="block text-center text-sm text-green-600 font-medium mt-3 hover:underline">Продолжить покупки</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
