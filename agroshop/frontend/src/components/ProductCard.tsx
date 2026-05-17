'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';

interface Props {
  product: {
    id: string; name: string; slug: string; price: number; old_price?: number;
    image?: string; unit: string; stock: number; category_name?: string;
  };
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push('/login'); return; }
    setAdding(true);
    try {
      await addItem(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally { setAdding(false); }
  };

  return (
    <Link href={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">Нет в наличии</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.category_name && <span className="text-xs text-green-600 font-medium mb-1">{product.category_name}</span>}
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition line-clamp-2 mb-2">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">{product.price.toLocaleString('ru-RU')} ₽</span>
            {product.old_price && <span className="ml-2 text-sm text-gray-400 line-through">{product.old_price.toLocaleString('ru-RU')} ₽</span>}
            <span className="block text-xs text-gray-400">за {product.unit}</span>
          </div>
          <button onClick={handleAdd} disabled={adding || product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all ${added ? 'bg-green-100 text-green-600' : 'bg-green-600 text-white hover:bg-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {added ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
