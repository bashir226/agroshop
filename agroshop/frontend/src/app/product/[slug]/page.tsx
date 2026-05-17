'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';

interface Product {
  id: string; name: string; slug: string; description: string;
  price: number; old_price?: number; image?: string; stock: number;
  unit: string; category_name?: string; category_slug?: string;
  attributes?: string;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${slug}`).then(r => r.json()).then(data => { setProduct(data); setLoading(false); });
  }, [slug]);

  const handleAdd = async () => {
    if (!user) { router.push('/login'); return; }
    setAdding(true);
    try {
      await addItem(product!.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally { setAdding(false); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Загрузка...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Товар не найден</div>;

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
  const attrs = product.attributes ? JSON.parse(product.attributes) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-green-600">Каталог</Link>
        {product.category_slug && <>
          <span className="mx-2">/</span>
          <Link href={`/catalog?category=${product.category_slug}`} className="hover:text-green-600">{product.category_name}</Link>
        </>}
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center">
          <ProductImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div>
          {product.category_name && <span className="text-sm text-green-600 font-medium">{product.category_name}</span>}
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{product.price.toLocaleString('ru-RU')} ₽</span>
            {product.old_price && (
              <>
                <span className="text-xl text-gray-400 line-through">{product.old_price.toLocaleString('ru-RU')} ₽</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">-{discount}%</span>
              </>
            )}
            <span className="text-sm text-gray-400">за {product.unit}</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Attributes */}
          {attrs && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Характеристики</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(attrs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{k}</span>
                    <span className="font-medium text-gray-900">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `В наличии (${product.stock} ${product.unit})` : 'Нет в наличии'}
            </span>
          </div>

          {/* Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-gray-50 transition text-lg font-medium">−</button>
                <input type="number" value={qty} onChange={e => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                  className="w-14 text-center py-2.5 border-x border-gray-200 outline-none" />
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2.5 hover:bg-gray-50 transition text-lg font-medium">+</button>
              </div>
              <button onClick={handleAdd} disabled={adding}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${added ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'} disabled:opacity-50`}>
                {added ? '✓ Добавлено в корзину' : adding ? 'Добавление...' : 'В корзину'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
