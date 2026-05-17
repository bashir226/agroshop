'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Зелёный<span className="text-green-600">Мир</span></span>
          </Link>

          {/* Search */}
          <form className="hidden md:flex flex-1 max-w-lg mx-8" onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/catalog?search=${encodeURIComponent(search)}`; }}>
            <div className="relative w-full">
              <input type="text" placeholder="Поиск товаров..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition" />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </form>

          {/* Nav */}
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link href="/catalog" className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              Каталог
            </Link>

            <Link href="/cart" className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="hidden sm:inline">Корзина</span>
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{count}</span>}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50 transition">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">{user.name[0].toUpperCase()}</div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50" onClick={() => setMenuOpen(false)}>Профиль</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50" onClick={() => setMenuOpen(false)}>Мои заказы</Link>
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Выйти</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
