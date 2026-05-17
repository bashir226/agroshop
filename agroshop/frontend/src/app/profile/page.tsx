'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ id: string; email: string; name: string; phone?: string; created_at: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      fetch('http://localhost:4000/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(r => r.json()).then(setProfile);
    }
  }, [user, authLoading, router]);

  if (authLoading || !profile) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold text-2xl">
            {profile.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Телефон</span>
            <span className="text-gray-900 font-medium">{profile.phone || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Дата регистрации</span>
            <span className="text-gray-900 font-medium">{new Date(profile.created_at).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <Link href="/orders" className="block w-full text-center py-2.5 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition">
            Мои заказы
          </Link>
          <Link href="/cart" className="block w-full text-center py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition">
            Корзина
          </Link>
        </div>
      </div>
    </div>
  );
}
