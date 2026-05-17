'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface Product { id: string; name: string; slug: string; price: number; old_price?: number; image?: string; unit: string; stock: number; category_name?: string; }
interface Category { id: string; slug: string; name: string; }

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(sortParam);

  useEffect(() => {
    fetch('http://localhost:4000/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (searchParam) params.set('search', searchParam);
    if (sort) params.set('sort', sort);
    fetch(`http://localhost:4000/api/products?${params}`).then(r => r.json()).then(data => { setProducts(data); setLoading(false); });
  }, [categoryParam, searchParam, sort]);

  const currentCat = categories.find(c => c.slug === categoryParam);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-green-600">Каталог</Link>
        {currentCat && <><span className="mx-2">/</span><span className="text-gray-900">{currentCat.name}</span></>}
        {searchParam && <><span className="mx-2">/</span><span className="text-gray-900">Поиск: {searchParam}</span></>}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Категории</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/catalog" className={`block px-3 py-2 rounded-lg text-sm transition ${!categoryParam ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Все товары
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/catalog?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition ${categoryParam === cat.slug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentCat?.name || (searchParam ? 'Результаты поиска' : 'Все товары')}
              {!loading && <span className="text-sm font-normal text-gray-400 ml-2">({products.length})</span>}
            </h1>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none">
              <option value="">По названию</option>
              <option value="price_asc">Сначала дешёвые</option>
              <option value="price_desc">Сначала дорогие</option>
              <option value="new">Новинки</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Товары не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Загрузка...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
