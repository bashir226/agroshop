import Link from 'next/link';

const catalogGroups = [
  {
    title: 'Семена',
    links: [
      { href: '/catalog?category=seeds-watermelon', label: 'Семена арбузов' },
      { href: '/catalog?category=seeds-vegetables', label: 'Семена овощей' },
    ],
  },
  {
    title: 'Защита и питание',
    links: [
      { href: '/catalog?category=plant-protection', label: 'СЗР' },
      { href: '/catalog?category=fertilizers', label: 'Удобрения' },
      { href: '/catalog?category=humates', label: 'Гуматы' },
    ],
  },
  {
    title: 'Полив и водоснабжение',
    links: [
      { href: '/catalog?category=drip-irrigation', label: 'Капельное орошение' },
      { href: '/catalog?category=motopumps', label: 'Мотопомпы' },
    ],
  },
  {
    title: 'Материалы',
    links: [
      { href: '/catalog?category=cover-material', label: 'Укрывной материал' },
      { href: '/catalog?category=mulch-film', label: 'Бахчевая плёнка' },
      { href: '/catalog?category=greenhouse-film', label: 'Тепличная плёнка' },
      { href: '/catalog?category=agrospan', label: 'Агроспан' },
      { href: '/catalog?category=peat', label: 'Торф' },
      { href: '/catalog?category=soils', label: 'Грунты' },
    ],
  },
  {
    title: 'Прочее',
    links: [
      { href: '/catalog?category=electric-fence', label: 'Электропастух' },
      { href: '/catalog?category=arcs', label: 'Дуги' },
      { href: '/catalog?category=leaflets', label: 'Лайфлеты' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-xl font-bold text-white">Зелёный<span className="text-green-400">Мир</span></span>
            </div>
            <p className="text-sm text-gray-400">Качественная продукция для сельского хозяйства.</p>
          </div>
          {catalogGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-white mb-3 text-sm">{group.title}</h4>
              <ul className="space-y-1.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-green-400 transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 Зелёный Мир. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
