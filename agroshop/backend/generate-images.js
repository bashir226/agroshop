import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const colors = [
  { bg: '#dcfce7', fg: '#16a34a', accent: '#bbf7d0' },
  { bg: '#fef3c7', fg: '#d97706', accent: '#fde68a' },
  { bg: '#dbeafe', fg: '#2563eb', accent: '#bfdbfe' },
  { bg: '#fce7f3', fg: '#db2777', accent: '#fbcfe8' },
  { bg: '#e0e7ff', fg: '#4f46e5', accent: '#c7d2fe' },
  { bg: '#fef9c3', fg: '#ca8a04', accent: '#fef08a' },
  { bg: '#d1fae5', fg: '#059669', accent: '#a7f3d0' },
  { bg: '#fee2e2', fg: '#dc2626', accent: '#fecaca' },
];

const emojis = {
  'seeds-watermelon': '🍉',
  'seeds-vegetables': '🌱',
  'plant-protection': '🛡️',
  'fertilizers': '💧',
  'humates': '🧪',
  'drip-irrigation': '💦',
  'motopumps': '⛽',
  'electric-fence': '⚡',
  'leaflets': '📄',
  'cover-material': '🌾',
  'mulch-film': '🫑',
  'agrospan': '🧱',
  'arcs': '🔩',
  'greenhouse-film': '🏠',
  'peat': '🪵',
  'soils': '🌍',
};

function makeSvg(slug, name, categorySlug, colorIdx) {
  const c = colors[colorIdx % colors.length];
  const emoji = emojis[categorySlug] || '🌿';
  const words = name.split(' ').slice(0, 3).join(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg_${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c.accent};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg_${slug})" rx="24"/>
  <circle cx="250" cy="180" r="100" fill="${c.accent}" opacity="0.5"/>
  <circle cx="250" cy="180" r="70" fill="${c.fg}" opacity="0.15"/>
  <text x="250" y="200" text-anchor="middle" font-size="80">${emoji}</text>
  <text x="250" y="340" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="${c.fg}">${escapeXml(words)}</text>
  <text x="250" y="370" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="${c.fg}" opacity="0.6">АгроМир</text>
</svg>`;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Product data matching seed.js
const products = [
  // Семена арбузов — Syngenta
  { slug: 'seed-karistan',        cat: 'seeds-watermelon', name: 'Каристан' },
  { slug: 'seed-topgan',          cat: 'seeds-watermelon', name: 'Топган' },
  { slug: 'seed-sorrento',        cat: 'seeds-watermelon', name: 'Сорренто' },
  { slug: 'seed-farao',           cat: 'seeds-watermelon', name: 'Фарао' },
  { slug: 'seed-arashan',         cat: 'seeds-watermelon', name: 'Арашан' },
  // Семена арбузов — Sakata
  { slug: 'seed-crimson-ruby',    cat: 'seeds-watermelon', name: 'Кримсон Руби' },
  { slug: 'seed-sarmat',          cat: 'seeds-watermelon', name: 'Сармат' },
  { slug: 'seed-el-wafi',         cat: 'seeds-watermelon', name: 'Эль Уафи' },
  // Семена овощных
  { slug: 'seed-tomato-bull-heart', cat: 'seeds-vegetables', name: 'Томат Бычье сердце' },
  { slug: 'seed-tomato-krasnym',    cat: 'seeds-vegetables', name: 'Томат Красным красно' },
  { slug: 'seed-pepper-california', cat: 'seeds-vegetables', name: 'Перец Калифорнийское чудо' },
  { slug: 'seed-cucumber-merenga',  cat: 'seeds-vegetables', name: 'Огурец Меренга F1' },
  { slug: 'seed-eggplant-valentina', cat: 'seeds-vegetables', name: 'Баклажан Валентина F1' },
  { slug: 'seed-cabbage-megaton',   cat: 'seeds-vegetables', name: 'Капуста Мегатон F1' },
  { slug: 'seed-carrot-nantes',     cat: 'seeds-vegetables', name: 'Морковь Нантская' },
  { slug: 'seed-beet-bordeaux',     cat: 'seeds-vegetables', name: 'Свёкла Бордо 237' },
  // СЗР
  { slug: 'protection-targa-super',  cat: 'plant-protection', name: 'Гербицид Тарга Супер' },
  { slug: 'protection-ridomil-gold', cat: 'plant-protection', name: 'Фунгицид Ридомил Голд' },
  { slug: 'protection-aktara',       cat: 'plant-protection', name: 'Инсектицид Актара' },
  { slug: 'protection-roundup',      cat: 'plant-protection', name: 'Гербицид Раундап' },
  { slug: 'protection-skor',         cat: 'plant-protection', name: 'Фунгицид Скор' },
  { slug: 'protection-thiram',       cat: 'plant-protection', name: 'Протравитель Тирам' },
  // Удобрения
  { slug: 'fert-ammonium-nitrate',   cat: 'fertilizers', name: 'Аммиачная селитра' },
  { slug: 'fert-superphosphate-double', cat: 'fertilizers', name: 'Суперфосфат двойной' },
  { slug: 'fert-potassium-sulfate',  cat: 'fertilizers', name: 'Калий сернокислый' },
  { slug: 'fert-npk-161616',         cat: 'fertilizers', name: 'Нитроаммофоска 16:16:16' },
  { slug: 'fert-urea',               cat: 'fertilizers', name: 'Мочевина карбамид' },
  { slug: 'fert-diamophoska',        cat: 'fertilizers', name: 'Диаммофоска ДАФК' },
  // Гуматы
  { slug: 'humate-potassium-liquid', cat: 'humates', name: 'Гумат калия жидкий' },
  { slug: 'humate-potassium-powder', cat: 'humates', name: 'Гумат калия порошок' },
  { slug: 'humate-plus-micro',       cat: 'humates', name: 'Гумат + 7 микроэлементов' },
  { slug: 'humate-zamenit-tovar',    cat: 'humates', name: 'Гумат Замени товар' },
  // Капельное орошение
  { slug: 'drip-tape-16mm',          cat: 'drip-irrigation', name: 'Капельная лента 16 мм' },
  { slug: 'drip-tape-16mm-30',       cat: 'drip-irrigation', name: 'Капельная лента 16 мм 30 см' },
  { slug: 'drip-tube-20mm',          cat: 'drip-irrigation', name: 'Капельная трубка ПНД 20 мм' },
  { slug: 'drip-fitting-start-16',   cat: 'drip-irrigation', name: 'Фитинг стартовый 16 мм' },
  { slug: 'drip-valve-ball',         cat: 'drip-irrigation', name: 'Кран шаровый' },
  { slug: 'drip-filter-120',         cat: 'drip-irrigation', name: 'Фильтр сетчатый 120 меш' },
  { slug: 'drip-connector-16',       cat: 'drip-irrigation', name: 'Коннектор прямой 16 мм' },
  // Мотопомпы
  { slug: 'motopump-mulat-sanreca',  cat: 'motopumps', name: 'Мотопомпа Мулат Санрека' },
  { slug: 'motopump-washer',         cat: 'motopumps', name: 'Мотопомпа Вашер' },
  { slug: 'motopump-technoline',     cat: 'motopumps', name: 'Мотопомпа Технолайн' },
  { slug: 'motopump-electrolight',   cat: 'motopumps', name: 'Мотопомпа Электролайт' },
  // Электропастух
  { slug: 'fence-basic-kit',         cat: 'electric-fence', name: 'Электроизгородь базовый' },
  { slug: 'fence-sheep-goat',        cat: 'electric-fence', name: 'Электроизгородь для овец' },
  { slug: 'fence-generator',         cat: 'electric-fence', name: 'Генератор импульсный' },
  { slug: 'fence-wire-25',           cat: 'electric-fence', name: 'Провод 2,5 мм' },
  { slug: 'fence-insulator-corner',  cat: 'electric-fence', name: 'Изолятор угловой' },
  // Лайфлеты
  { slug: 'leaflet-a4-1000',         cat: 'leaflets', name: 'Лайфлет А4 1000 шт' },
  { slug: 'leaflet-a5-1000',         cat: 'leaflets', name: 'Лайфлет А5 1000 шт' },
  { slug: 'leaflet-euro-1000',       cat: 'leaflets', name: 'Лайфлет евроформат 1000 шт' },
  // Укрывной материал
  { slug: 'cover-spanbond-17',       cat: 'cover-material', name: 'Спанбонд 17 г/м²' },
  { slug: 'cover-spanbond-30',       cat: 'cover-material', name: 'Спанбонд 30 г/м²' },
  { slug: 'cover-spanbond-60',       cat: 'cover-material', name: 'Спанбонд 60 г/м²' },
  { slug: 'cover-lutrasil-23',       cat: 'cover-material', name: 'Лутрасил 23 г/м²' },
  // Бахчевая плёнка
  { slug: 'mulch-film-black-100',    cat: 'mulch-film', name: 'Плёнка чёрная 100 мкм' },
  { slug: 'mulch-film-bw-120',       cat: 'mulch-film', name: 'Плёнка чёрно-белая 120 мкм' },
  { slug: 'mulch-film-brown-80',     cat: 'mulch-film', name: 'Плёнка коричневая 80 мкм' },
  // Агроспан
  { slug: 'agrospan-100',            cat: 'agrospan', name: 'Агроспан 100 г/м²' },
  { slug: 'agrospan-200',            cat: 'agrospan', name: 'Агроспан 200 г/м²' },
  { slug: 'agrospan-black-150',      cat: 'agrospan', name: 'Агроспан чёрный 150 г/м²' },
  // Дуги
  { slug: 'arc-galv-2020',           cat: 'arcs', name: 'Дуга оцинкованная 20×20' },
  { slug: 'arc-galv-2525',           cat: 'arcs', name: 'Дуга оцинкованная 25×25' },
  { slug: 'arc-pvc-19',              cat: 'arcs', name: 'Дуга ПВХ 19 мм' },
  { slug: 'arc-crossbar-20',         cat: 'arcs', name: 'Перекладина 20 мм' },
  // Тепличная плёнка
  { slug: 'gh-film-150-stab',        cat: 'greenhouse-film', name: 'Плёнка тепличная 150 мкм' },
  { slug: 'gh-film-200-arm',         cat: 'greenhouse-film', name: 'Плёнка армированная 200 мкм' },
  { slug: 'gh-film-3l-150',          cat: 'greenhouse-film', name: 'Плёнка трёхслойная 150 мкм' },
  { slug: 'gh-film-ir',              cat: 'greenhouse-film', name: 'Плёнка инфракрасная' },
  // Торф
  { slug: 'peat-high-neutral',       cat: 'peat', name: 'Торф верховой нейтрализованный' },
  { slug: 'peat-low',                cat: 'peat', name: 'Торф низинный' },
  { slug: 'peat-bag-50l',            cat: 'peat', name: 'Торф в мешках 50 л' },
  // Грунты
  { slug: 'soil-universal-50l',      cat: 'soils', name: 'Грунт универсальный 50 л' },
  { slug: 'soil-seedlings-10l',      cat: 'soils', name: 'Грунт для рассады 10 л' },
  { slug: 'soil-tomato-pepper-10l',  cat: 'soils', name: 'Грунт для томатов 10 л' },
  { slug: 'soil-perlite-5l',         cat: 'soils', name: 'Перлит вспученный 5 л' },
  { slug: 'soil-vermiculite-5l',     cat: 'soils', name: 'Вермикулит вспученный 5 л' },
];

let count = 0;
for (let i = 0; i < products.length; i++) {
  const p = products[i];
  const svg = makeSvg(p.slug, p.name, p.cat, i);
  const filePath = path.join(imgDir, `${p.slug}.svg`);
  fs.writeFileSync(filePath, svg);
  count++;
}

console.log(`✅ Generated ${count} SVG images in ${imgDir}`);
