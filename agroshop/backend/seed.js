import { db, uuidv4 } from './db.js';

async function seed() {
  await db.exec('DELETE FROM order_items;');
  await db.exec('DELETE FROM orders;');
  await db.exec('DELETE FROM cart_items;');
  await db.exec('DELETE FROM products;');
  await db.exec('DELETE FROM categories;');

  // ─── Categories ───
  const categories = [
    { id: uuidv4(), image: '/images/products/seeds-watermelon.svg', attrs: JSON.stringify({ brand: 'Syngenta', maturity: '75-80 дней', weight: '8-12 кг', type: 'Раннеспелый' }) },
    { cat: 'seeds-watermelon', name: 'Топган',            image: '/images/products/seed-topgan.svg', attrs: JSON.stringify({ brand: 'Syngenta', maturity: '80-85 дней', weight: '10-14 кг', type: 'Среднеранний' }) },
    { cat: 'seeds-watermelon', name: 'Сорренто',          image: '/images/products/seed-sorrento.svg', attrs: JSON.stringify({ brand: 'Syngenta', maturity: '70-78 дней', weight: '7-10 кг', type: 'Раннеспелый' }) },
    { cat: 'seeds-watermelon', name: 'Фарао',             image: '/images/products/seed-farao.svg', attrs: JSON.stringify({ brand: 'Syngenta', maturity: '85-90 дней', weight: '9-13 кг', type: 'Среднеспелый' }) },
    { cat: 'seeds-watermelon', name: 'Арашан',            image: '/images/products/seed-arashan.svg', attrs: JSON.stringify({ brand: 'Syngenta', maturity: '72-80 дней', weight: '6-9 кг', type: 'Раннеспелый' }) },

    // ── Семена арбузов — Sakata ──
    { cat: 'seeds-watermelon', name: 'Кримсон Руби',      image: '/images/products/seed-crimson-ruby.svg', attrs: JSON.stringify({ brand: 'Sakata', maturity: '74-82 дней', weight: '8-11 кг', type: 'Раннеспелый' }) },
    { cat: 'seeds-watermelon', name: 'Сармат',            image: '/images/products/seed-sarmat.svg', attrs: JSON.stringify({ brand: 'Sakata', maturity: '82-88 дней', weight: '10-14 кг', type: 'Среднеранний' }) },
    { cat: 'seeds-watermelon', name: 'Эль Уафи',          image: '/images/products/seed-el-wafi.svg', attrs: JSON.stringify({ brand: 'Sakata', maturity: '88-95 дней', weight: '9-12 кг', type: 'Среднеспелый' }) },

    // ── Семена овощных культур ──
    { cat: 'seeds-vegetables', name: 'Томат "Бычье сердце"', image: '/images/products/seed-tomato-bull-heart.svg', attrs: JSON.stringify({ crop: 'Томат', maturity: '110-120 дней', weight: 'до 500 г', type: 'Среднеспелый' }) },
    { cat: 'seeds-vegetables', name: 'Томат "Красным красно"', image: '/images/products/seed-tomato-krasnym.svg', attrs: JSON.stringify({ crop: 'Томат', maturity: '100-110 дней', weight: '200-300 г', type: 'Гибрид F1' }) },
    { cat: 'seeds-vegetables', name: 'Перец "Калифорнийское чудо"', image: '/images/products/seed-pepper-california.svg', attrs: JSON.stringify({ crop: 'Перец', maturity: '110-130 дней', weight: 'до 200 г', type: 'Среднеспелый' }) },
    { cat: 'seeds-vegetables', name: 'Огуц "Меренга F1"',  image: '/images/products/seed-cucumber-merenga.svg', attrs: JSON.stringify({ crop: 'Огурец', maturity: '40-45 дней', weight: '25-30 см', type: 'Партенокарпический' }) },
    { cat: 'seeds-vegetables', name: 'Баклажан "Валентина F1"', image: '/images/products/seed-eggplant-valentina.svg', attrs: JSON.stringify({ crop: 'Баклажан', maturity: '100-110 дней', weight: '250-300 г', type: 'Гибрид F1' }) },
    { cat: 'seeds-vegetables', name: 'Капуста "Мегатон F1"', image: '/images/products/seed-cabbage-megaton.svg', attrs: JSON.stringify({ crop: 'Капуста', maturity: '130-140 дней', weight: '5-8 кг', type: 'Среднепоздний' }) },
    { cat: 'seeds-vegetables', name: 'Морковь "Нантская"', image: '/images/products/seed-carrot-nantes.svg', attrs: JSON.stringify({ crop: 'Морковь', maturity: '100-120 дней', weight: '150-200 г', type: 'Среднеспелый' }) },
    { cat: 'seeds-vegetables', name: 'Свёстол "Бордо 237"', image: '/images/products/seed-beet-bordeaux.svg', attrs: JSON.stringify({ crop: 'Свёкла', maturity: '100-110 дней', weight: '200-300 г', type: 'Среднеспелый' }) },

    // ── Средства защиты растений ──
    { cat: 'plant-protection', name: 'Гербицид "Тарга Супер"', image: '/images/products/protection-targa-super.svg', attrs: JSON.stringify({ type: 'Гербицид', action: 'Послевсходовый', target: 'Злаковые сорняки' }) },
    { cat: 'plant-protection', name: 'Фунгицид "Ридомил Голд"', image: '/images/products/protection-ridomil-gold.svg', attrs: JSON.stringify({ type: 'Фунгицид', action: 'Системно-контактное', target: 'Грибковые заболевания' }) },
    { cat: 'plant-protection', name: 'Инсектицид "Актара"', image: '/images/products/protection-aktara.svg', attrs: JSON.stringify({ type: 'Инсектицид', action: 'Системное', target: 'Широкий спектр вредителей' }) },
    { cat: 'plant-protection', name: 'Гербицид "Раундап"', image: '/images/products/protection-roundup.svg', attrs: JSON.stringify({ type: 'Гербицид', action: 'Сплошное', target: 'Все виды сорняков' }) },
    { cat: 'plant-protection', name: 'Фунгицид "Скор"', image: '/images/products/protection-skor.svg', attrs: JSON.stringify({ type: 'Фунгицид', action: 'Системное', target: 'Парша, мучнистая роса' }) },
    { cat: 'plant-protection', name: 'Протравитель "Тирам"', image: '/images/products/protection-thiram.svg', attrs: JSON.stringify({ type: 'Протравитель', action: 'Контактное', target: 'Корневые гнили' }) },

    // ── Удобрения ──
    { cat: 'fertilizers', name: 'Аммиачная селитра', image: '/images/products/fert-ammonium-nitrate.svg', attrs: JSON.stringify({ type: 'Азотное', element: 'N 34,4%', form: 'Гранулы' }) },
    { cat: 'fertilizers', name: 'Суперфосфат двойной', image: '/images/products/fert-superphosphate-double.svg', attrs: JSON.stringify({ type: 'Фосфорное', element: 'P₂O₅ 46%', form: 'Гранулы' }) },
    { cat: 'fertilizers', name: 'Калий сернокислый', image: '/images/products/fert-potassium-sulfate.svg', attrs: JSON.stringify({ type: 'Калийное', element: 'K₂O 50%, S 18%', form: 'Порошок' }) },
    { cat: 'fertilizers', name: 'Нитроаммофоска 16:16:16', image: '/images/products/fert-npk-161616.svg', attrs: JSON.stringify({ type: 'Комплексное', element: 'NPK 16:16:16', form: 'Гранулы' }) },
    { cat: 'fertilizers', name: 'Мочевина (карбамид)', image: '/images/products/fert-urea.svg', attrs: JSON.stringify({ type: 'Азотное', element: 'N 46,2%', form: 'Гранулы' }) },
    { cat: 'fertilizers', name: 'Диаммофоска (ДАФК)', image: '/images/products/fert-diamophoska.svg', attrs: JSON.stringify({ type: 'Комплексное', element: 'NPK 9:25:25', form: 'Гранулы' }) },

    // ── Гумат ──
    { cat: 'humates', name: 'Гумат калия жидкий', image: '/images/products/humate-potassium-liquid.svg', attrs: JSON.stringify({ type: 'Гумат калия', form: 'Жидкий', concentration: '80 г/л' }) },
    { cat: 'humates', name: 'Гумат калия порошок', image: '/images/products/humate-potassium-powder.svg', attrs: JSON.stringify({ type: 'Гумат калия', form: 'Порошок', concentration: '80%' }) },
    { cat: 'humates', name: 'Гумат + 7 микроэлементов', image: '/images/products/humate-plus-micro.svg', attrs: JSON.stringify({ type: 'Гумат + микро', form: 'Жидкий', elements: '7 микроэлементов' }) },
    { cat: 'humates', name: 'Гумат "Замени товар"', image: '/images/products/humate-zamenit-tovar.svg', attrs: JSON.stringify({ type: 'Гумат', form: 'Жидкий', purpose: 'Замена удобрений' }) },

    // ── Капельное орошение ──
    { cat: 'drip-irrigation', name: 'Капельная лента 16 мм', image: '/images/products/drip-tape-16mm.svg', attrs: JSON.stringify({ diameter: '16 мм', spacing: '20 см', flow: '1,2 л/ч', type: 'Лента' }) },
    { cat: 'drip-irrigation', name: 'Капельная лента 16 мм (30 см)', image: '/images/products/drip-tape-16mm-30.svg', attrs: JSON.stringify({ diameter: '16 мм', spacing: '30 см', flow: '2,0 л/ч', type: 'Лента' }) },
    { cat: 'drip-irrigation', name: 'Капельная трубка ПНД 20 мм', image: '/images/products/drip-tube-20mm.svg', attrs: JSON.stringify({ diameter: '20 мм', spacing: '30 см', flow: '2,2 л/ч', type: 'Трубка' }) },
    { cat: 'drip-irrigation', name: 'Фитинг стартовый 16 мм', image: '/images/products/drip-fitting-start-16.svg', attrs: JSON.stringify({ diameter: '16 мм', type: 'Стартовый', material: 'Полипропилен' }) },
    { cat: 'drip-irrigation', name: 'Кран шаровый для капельной трубки', image: '/images/products/drip-valve-ball.svg', attrs: JSON.stringify({ type: 'Шаровой кран', material: 'Полипропилен' }) },
    { cat: 'drip-irrigation', name: 'Фильтр сетчатый 120 меш', image: '/images/products/drip-filter-120.svg', attrs: JSON.stringify({ mesh: '120 меш', micron: '130 мкм', type: 'Сетчатый' }) },
    { cat: 'drip-irrigation', name: 'Коннектор прямой 16 мм', image: '/images/products/drip-connector-16.svg', attrs: JSON.stringify({ diameter: '16 мм', type: 'Прямой', material: 'Полипропилен' }) },

    // ── Мотопомпы ──
    { cat: 'motopumps', name: 'Мотопомпа "Мулат" Санрека', image: '/images/products/motopump-mulat-sanreca.svg', attrs: JSON.stringify({ brand: 'Санрека', series: 'Мулат', flow: '600 л/мин', head: '30 м', engine: '6,5 л.с.' }) },
    { cat: 'motopumps', name: 'Мотопомпа "Вашер"', image: '/images/products/motopump-washer.svg', attrs: JSON.stringify({ brand: 'Вашер', flow: '400 л/мин', head: '25 м', engine: '5,5 л.с.' }) },
    { cat: 'motopumps', name: 'Мотопомпа "Технолайн"', image: '/images/products/motopump-technoline.svg', attrs: JSON.stringify({ brand: 'Технолайн', flow: '500 л/мин', head: '28 м', engine: '6,0 л.с.' }) },
    { cat: 'motopumps', name: 'Мотопомпа "Электролайт"', image: '/images/products/motopump-electrolight.svg', attrs: JSON.stringify({ brand: 'Электролайт', flow: '350 л/мин', head: '22 м', engine: '4,0 л.с.' }) },

    // ── Электропастух ──
    { cat: 'electric-fence', name: 'Электроизгородь базовый комплект', image: '/images/products/fence-basic-kit.svg', attrs: JSON.stringify({ type: 'Базовый', length: 'до 5 км', animals: 'КРС' }) },
    { cat: 'electric-fence', name: 'Электроизгородь для овец и коз', image: '/images/products/fence-sheep-goat.svg', attrs: JSON.stringify({ type: 'Для МРС', length: 'до 3 км', animals: 'Овцы, козы' }) },
    { cat: 'electric-fence', name: 'Генератор импульсный автономный', image: '/images/products/fence-generator.svg', attrs: JSON.stringify({ type: 'Генератор', power: '220В / АКБ', voltage: 'до 10 кВ' }) },
    { cat: 'electric-fence', name: 'Провод для электроизгороди 2,5 мм', image: '/images/products/fence-wire-25.svg', attrs: JSON.stringify({ diameter: '2,5 мм', length: '1000 м', material: 'Сталь оцинк.' }) },
    { cat: 'electric-fence', name: 'Изолятор угловой', image: '/images/products/fence-insulator-corner.svg', attrs: JSON.stringify({ type: 'Угловой', material: 'Керамика' }) },

    // ── Лайфлеты ──
    { cat: 'leaflets', name: 'Лайфлет А4 (1000 шт)', image: '/images/products/leaflet-a4-1000.svg', attrs: JSON.stringify({ format: 'А4', sides: 'Двусторонняя', paper: '130 г/м²', count: '1000 шт' }) },
    { cat: 'leaflets', name: 'Лайфлет А5 (1000 шт)', image: '/images/products/leaflet-a5-1000.svg', attrs: JSON.stringify({ format: 'А5', sides: 'Двусторонняя', paper: '130 г/м²', count: '1000 шт' }) },
    { cat: 'leaflets', name: 'Лайфлет евроформат (1000 шт)', image: '/images/products/leaflet-euro-1000.svg', attrs: JSON.stringify({ format: 'Евро 98×210', sides: 'Двусторонняя', paper: '130 г/м²', count: '1000 шт' }) },

    // ── Укрывной материал ──
    { cat: 'cover-material', name: 'Спанбонд 17 г/м²', image: '/images/products/cover-spanbond-17.svg', attrs: JSON.stringify({ density: '17 г/м²', protection: 'до -3°C', width: '3,2 м', type: 'Спанбонд' }) },
    { cat: 'cover-material', name: 'Спанбонд 30 г/м²', image: '/images/products/cover-spanbond-30.svg', attrs: JSON.stringify({ density: '30 г/м²', protection: 'до -5°C', width: '3,2 м', type: 'Спанбонд' }) },
    { cat: 'cover-material', name: 'Спанбонд 60 г/м²', image: '/images/products/cover-spanbond-60.svg', attrs: JSON.stringify({ density: '60 г/м²', protection: 'до -8°C', width: '3,2 м', type: 'Спанбонд' }) },
    { cat: 'cover-material', name: 'Лутрасил 23 г/м²', image: '/images/products/cover-lutrasil-23.svg', attrs: JSON.stringify({ density: '23 г/м²', protection: 'до -4°C', width: '3,2 м', type: 'Лутрасил' }) },

    // ── Бахчевая плёнка ──
    { cat: 'mulch-film', name: 'Плёнка бахчевая чёрная 100 мкм', image: '/images/products/mulch-film-black-100.svg', attrs: JSON.stringify({ color: 'Чёрная', thickness: '100 мкм', width: '1,6 м', length: '100 м' }) },
    { cat: 'mulch-film', name: 'Плёнка бахчевая чёрно-белая 120 мкм', image: '/images/products/mulch-film-bw-120.svg', attrs: JSON.stringify({ color: 'Чёрно-белая', thickness: '120 мкм', width: '1,6 м', length: '100 м' }) },
    { cat: 'mulch-film', name: 'Плёнка бахчевая коричневая 80 мкм', image: '/images/products/mulch-film-brown-80.svg', attrs: JSON.stringify({ color: 'Коричневая', thickness: '80 мкм', width: '1,6 м', length: '100 м' }) },

    // ── Агроспан ──
    { cat: 'agrospan', name: 'Агроспан (геотекстиль) 100 г/м²', image: '/images/products/agrospan-100.svg', attrs: JSON.stringify({ density: '100 г/м²', width: '2 м', type: 'Геотекстиль', purpose: 'Дорожки, дренаж' }) },
    { cat: 'agrospan', name: 'Агроспан (геотекстиль) 200 г/м²', image: '/images/products/agrospan-200.svg', attrs: JSON.stringify({ density: '200 г/м²', width: '2 м', type: 'Геотекстиль', purpose: 'Укрепление' }) },
    { cat: 'agrospan', name: 'Агроспан чёрный 150 г/м² (от сорняков)', image: '/images/products/agrospan-black-150.svg', attrs: JSON.stringify({ density: '150 г/м²', color: 'Чёрный', width: '1,6 м', type: 'Геотекстиль' }) },

    // ── Дуги ──
    { cat: 'arcs', name: 'Дуга оцинкованная 20×20 мм', image: '/images/products/arc-galv-2020.svg', attrs: JSON.stringify({ profile: '20×20 мм', length: '3 м', coating: 'Оцинковка', type: 'Профильная' }) },
    { cat: 'arcs', name: 'Дуга оцинкованная 25×25 мм', image: '/images/products/arc-galv-2525.svg', attrs: JSON.stringify({ profile: '25×25 мм', length: '3 м', coating: 'Оцинковка', type: 'Профильная' }) },
    { cat: 'arcs', name: 'Дуга из ПВХ 19 мм', image: '/images/products/arc-pvc-19.svg', attrs: JSON.stringify({ diameter: '19 мм', length: '3 м', material: 'ПВХ', type: 'Гибкая' }) },
    { cat: 'arcs', name: 'Перекладина для дуг 20 мм', image: '/images/products/arc-crossbar-20.svg', attrs: JSON.stringify({ diameter: '20 мм', length: '6 м', type: 'Перекладина' }) },

    // ── Тепличная плёнка ──
    { cat: 'greenhouse-film', name: 'Плёнка тепличная 150 мкм (стабилизированная)', image: '/images/products/gh-film-150-stab.svg', attrs: JSON.stringify({ thickness: '150 мкм', width: '16 м', stabilization: '3 года', type: 'Светостабилизированная' }) },
    { cat: 'greenhouse-film', name: 'Плёнка тепличная 200 мкм (армированная)', image: '/images/products/gh-film-200-arm.svg', attrs: JSON.stringify({ thickness: '200 мкм', width: '12 м', stabilization: '5 лет', type: 'Армированная' }) },
    { cat: 'greenhouse-film', name: 'Плёнка тепличная 3-слойная 150 мкм', image: '/images/products/gh-film-3l-150.svg', attrs: JSON.stringify({ thickness: '150 мкм', width: '16 м', layers: 3, type: 'Трёхслойная' }) },
    { cat: 'greenhouse-film', name: 'Плёнка тепличная инфракрасная', image: '/images/products/gh-film-ir.svg', attrs: JSON.stringify({ thickness: '150 мкм', width: '16 м', type: 'ИК-плёнка', feature: 'Теплосбережение' }) },

    // ── Торф ──
    { cat: 'peat', name: 'Торф верховой нейтрализованный', image: '/images/products/peat-high-neutral.svg', attrs: JSON.stringify({ type: 'Верховой', pH: '5,5-6,5', fraction: '0-20 мм', purpose: 'Субстрат' }) },
    { cat: 'peat', name: 'Торф низинный', image: '/images/products/peat-low.svg', attrs: JSON.stringify({ type: 'Низинный', pH: '6,0-7,0', decomposition: 'Высокая', purpose: 'Улучшение почвы' }) },
    { cat: 'peat', name: 'Торф в мешках 50 л', image: '/images/products/peat-bag-50l.svg', attrs: JSON.stringify({ volume: '50 л', type: 'Фасованный', purpose: 'Рассада' }) },

    // ── Грунты ──
    { cat: 'soils', name: 'Грунт универсальный 50 л', image: '/images/products/soil-universal-50l.svg', attrs: JSON.stringify({ volume: '50 л', type: 'Универсальный', base: 'Торф + перлит' }) },
    { cat: 'soils', name: 'Грунт для рассады 10 л', image: '/images/products/soil-seedlings-10l.svg', attrs: JSON.stringify({ volume: '10 л', type: 'Для рассады', base: 'Торф + вермикулит' }) },
    { cat: 'soils', name: 'Грунт для томатов и перцев 10 л', image: '/images/products/soil-tomato-pepper-10l.svg', attrs: JSON.stringify({ volume: '10 л', type: 'Для паслёновых', base: 'Торф + перлит' }) },
    { cat: 'soils', name: 'Перлит вспученный 5 л', image: '/images/products/soil-perlite-5l.svg', attrs: JSON.stringify({ volume: '5 л', type: 'Перлит', purpose: 'Разрыхлитель' }) },
    { cat: 'soils', name: 'Вермикулит вспученный 5 л', image: '/images/products/soil-vermiculite-5l.svg', attrs: JSON.stringify({ volume: '5 л', type: 'Вермикулит', purpose: 'Мульча, проращивание' }) },
  ];

  for (const p of products) {
    await db.prepare('INSERT INTO products (id, category_id, name, slug, description, price, old_price, image, stock, unit, attributes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), cat[p.cat], p.name, p.slug, p.description, p.price, p.old_price || null, p.image || null, p.stock, p.unit, p.attrs);
  }

  console.log(`✅ Seeded: ${categories.length} categories, ${products.length} products`);
}

seed().catch(console.error);
