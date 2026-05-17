import Link from 'next/link';

const categories = [
  { slug: 'seeds-watermelon',    name: 'Семена арбузов',          emoji: '🍉', gradient: 'from-red-500 to-pink-600',    desc: 'Syngenta, Sakata' },
  { slug: 'seeds-vegetables',    name: 'Семена овощных культур',  emoji: '🌱', gradient: 'from-green-500 to-emerald-600', desc: 'Томаты, перцы, огурцы' },
  { slug: 'plant-protection',    name: 'СЗР',                     emoji: '🛡️', gradient: 'from-orange-500 to-amber-600',  desc: 'Гербициды, фунгициды' },
  { slug: 'fertilizers',         name: 'Удобрения',               emoji: '💧', gradient: 'from-blue-500 to-cyan-600',    desc: 'NPK, азот, калий' },
  { slug: 'humates',             name: 'Гуматы',                   emoji: '🧪', gradient: 'from-purple-500 to-violet-600', desc: 'Гумат калия' },
  { slug: 'drip-irrigation',    name: 'Капельное орошение',      emoji: '💦', gradient: 'from-sky-500 to-blue-600',    desc: 'Ленты, трубки, фитинги' },
  { slug: 'motopumps',           name: 'Мотопомпы',               emoji: '⛽', gradient: 'from-gray-600 to-gray-800',    desc: 'Санрека, Вашер' },
  { slug: 'electric-fence',      name: 'Электропастух',           emoji: '⚡', gradient: 'from-yellow-500 to-orange-600', desc: 'Электроизгородь' },
  { slug: 'cover-material',      name: 'Укрывной материал',       emoji: '🌾', gradient: 'from-lime-500 to-green-600',   desc: 'Спанбонд, лутрасил' },
  { slug: 'mulch-film',          name: 'Бахчевая плёнка',         emoji: '🫑', gradient: 'from-amber-500 to-yellow-600', desc: 'Мульчирование' },
  { slug: 'agrospan',            name: 'Агроспан',                 emoji: '🧱', gradient: 'from-stone-500 to-stone-700',  desc: 'Геотекстиль' },
  { slug: 'arcs',                name: 'Дуги',                     emoji: '🔩', gradient: 'from-zinc-500 to-zinc-700',    desc: 'Для парников' },
  { slug: 'greenhouse-film',     name: 'Тепличная плёнка',         emoji: '🏠', gradient: 'from-teal-500 to-emerald-600', desc: 'Полиэтиленовые' },
  { slug: 'peat',                name: 'Торф',                     emoji: '🪵', gradient: 'from-amber-700 to-amber-900',  desc: 'Верховой, низинный' },
  { slug: 'soils',               name: 'Грунты',                   emoji: '🌍', gradient: 'from-brown-500 to-amber-700',  desc: 'Почвогрунты' },
  { slug: 'leaflets',            name: 'Лайфлеты',                emoji: '📄', gradient: 'from-indigo-500 to-blue-700',  desc: 'Печать листовок' },
];

const features = [
  { icon: '🚚', title: 'Доставка по России', desc: 'Быстрая доставка в любой регион' },
  { icon: '✅', title: 'Гарантия качества',   desc: 'Только сертифицированная продукция' },
  { icon: '💰', title: 'Лучшие цены',         desc: 'Прямые поставки от производителей' },
  { icon: '📞', title: 'Консультации',        desc: 'Поможем с выбором 24/7' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Всё для вашего<br />
              <span className="text-yellow-300">урожая</span> и хозяйства
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-lg">
              Семена Syngenta и Sakata, СЗР, удобрения, капельное орошение, мотопомпы, укрывные материалы — с доставкой по всей России.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog" className="px-8 py-3.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition shadow-lg shadow-green-800/20">
                Перейти в каталог
              </Link>
              <Link href="/catalog?category=seeds-watermelon" className="px-8 py-3.5 bg-green-500/30 text-white font-bold rounded-xl hover:bg-green-500/40 transition border border-green-400/30">
                Семена арбузов
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">{f.title}</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Категории товаров</h2>
          <p className="text-gray-500 mt-2">Выберите категорию и найдите нужный товар</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/catalog?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl p-5 min-h-[140px] flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="relative">
                <span className="text-3xl">{cat.emoji}</span>
              </div>
              <div className="relative text-white">
                <h3 className="font-bold text-sm md:text-base leading-tight">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Нужна консультация?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">Наши специалисты помогут подобрать семена, удобрения или оборудование под ваши задачи</p>
          <a href="tel:+78001234567" className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            +7 (800) 123-45-67
          </a>
        </div>
      </section>
    </div>
  );
}
