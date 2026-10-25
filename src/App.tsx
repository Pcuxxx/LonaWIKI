import { useState, useMemo } from 'react';

type Section = 'home' | 'beginners' | 'quests' | 'builds' | 'weapons' | 'characters' | 'lore' | 'endings' | 'mechanics' | 'secrets' | 'locations';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Section; label: string; icon: string; desc: string }[] = [
    { id: 'home', label: 'Главная', icon: '🏠', desc: 'Обзор игры' },
    { id: 'beginners', label: 'Новичкам', icon: '💡', desc: 'Первые шаги' },
    { id: 'quests', label: 'Квесты', icon: '📜', desc: '53+ квеста' },
    { id: 'builds', label: 'Билды', icon: '⚔️', desc: 'Стили игры' },
    { id: 'weapons', label: 'Оружие', icon: '🛡️', desc: 'Экипировка' },
    { id: 'characters', label: 'Персонажи', icon: '👥', desc: 'NPC и лор' },
    { id: 'lore', label: 'Лор мира', icon: '📖', desc: 'История' },
    { id: 'locations', label: 'Локации', icon: '🗺️', desc: 'Карта мира' },
    { id: 'endings', label: 'Концовки', icon: '🎬', desc: 'Финалы' },
    { id: 'mechanics', label: 'Механики', icon: '⚙️', desc: 'Системы' },
    { id: 'secrets', label: 'Секреты', icon: '🔮', desc: 'Пасхалки' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg">L</div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">LonaRPG Wiki</h1>
                <p className="text-xs text-purple-200 hidden sm:block">Полное руководство v2.0</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <nav className={`lg:w-80 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">📚 Навигация</h2>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start space-x-3 ${activeSection === item.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${activeSection === item.id ? 'text-purple-100' : 'text-gray-500'}`}>{item.desc}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-bold text-gray-600 mb-3">🔗 Ресурсы</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="https://eccma417.itch.io/lonarpg" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">🎮 Официальная страница</a></li>
                  <li><a href="https://lonarpg.miraheze.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">📚 Miraheze Wiki</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 min-h-[600px]">
              {activeSection === 'home' && <HomeSection />}
              {activeSection === 'beginners' && <BeginnersSection />}
              {activeSection === 'quests' && <QuestsSection />}
              {activeSection === 'builds' && <BuildsSection />}
              {activeSection === 'weapons' && <WeaponsSection />}
              {activeSection === 'characters' && <CharactersSection />}
              {activeSection === 'lore' && <LoreSection />}
              {activeSection === 'locations' && <LocationsSection />}
              {activeSection === 'endings' && <EndingsSection />}
              {activeSection === 'mechanics' && <MechanicsSection />}
              {activeSection === 'secrets' && <SecretsSection />}
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-gray-300 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div><h3 className="text-white font-bold mb-3">📖 LonaRPG Wiki</h3><p className="text-sm">Полное руководство по игре.</p></div>
            <div><h3 className="text-white font-bold mb-3">🔗 Ресурсы</h3><ul className="text-sm space-y-2"><li><a href="https://eccma417.itch.io/lonarpg" className="hover:text-purple-400">Официальная страница</a></li><li><a href="https://lonarpg.miraheze.org" className="hover:text-purple-400">Miraheze Wiki</a></li></ul></div>
            <div><h3 className="text-white font-bold mb-3">ℹ️ О проекте</h3><p className="text-sm">Wiki создана на основе официальных источников и гайдов сообщества.</p></div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm"><p>LonaRPG © Eccma417 | Wiki создана фанатами ❤️</p></div>
        </div>
      </footer>
    </div>
  );
}

function HomeSection() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-2xl">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">LonaRPG Wiki</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">Полное руководство по выживанию, квестам, билдам и механикам</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">53+ квестов</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">40+ оружия</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">15+ персонажей</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">6 локаций</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-3 text-gray-800">🎮 О игре</h3>
          <p className="text-gray-700 leading-relaxed">LonaRPG — мрачная survival RPG с открытым миром от Eccma417. Вы играете за Лону — беженку, чей дом разрушен инфекцией аборигенов. Цель — заработать золото и купить билет на корабль, чтобы покинуть остров Ноэр.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-3 text-gray-800">🎯 Главная цель</h3>
          <p className="text-gray-700 leading-relaxed">Собрать <strong>20-30 золотых монет</strong> (зависит от сложности) и заплатить капитану Эдварду. Способы: квесты, рыбалка (лучший способ!), торговля, работа.</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-3 text-gray-800">⚔️ Боевая система</h3>
          <p className="text-gray-700 leading-relaxed">Пошаговые бои на сетке. Управляйте HP, STA и голодом. <strong className="text-red-600">Убийство врагов НЕ даёт опыт</strong> — опыт за квесты и восстановление STA.</p>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-3 text-gray-800">🌍 Открытый мир</h3>
          <p className="text-gray-700 leading-relaxed">Исследуйте остров: Ноэр, Пиратская погибель, Крепость Рока, Фиштопия, Прибрежная крепость, Лагерь Южных ворот.</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">💡 Быстрые советы</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Используйте <strong className="text-purple-600">Фонарь</strong> для поджога крыс и кроликов</li>
          <li>• Покупайте <strong className="text-blue-600">ключ от комнаты</strong> в таверне — дешевле, чем еда</li>
          <li>• Всегда носите <strong className="text-red-600">красные и синие зелья</strong></li>
          <li>• <strong className="text-red-600">Не сражайтесь с несколькими врагами</strong> — заманивайте по одному</li>
          <li>• <strong className="text-green-600">Рыбалка</strong> — лучший способ заработка (20 золотых за час!)</li>
          <li>• <strong className="text-orange-600">Серп</strong> обязателен — сбор растений стоит 1 STA вместо 3</li>
        </ul>
      </div>
    </div>
  );
}

function BeginnersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">💡 Советы для начинающих</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-blue-900">🐀 Квест с крысами (Обучение)</h3>
        <p className="text-gray-700 mb-3"><strong className="text-red-600">Не используйте дубину!</strong> Используйте Фонарь для поджога крыс (4 STA), затем БЕГИТЕ.</p>
        <ul className="text-gray-700 space-y-1 ml-4">
          <li>• Возьмите <strong>Вилы</strong> из сундука (дальность x2, урон x2)</li>
          <li>• Создайте <strong>Тёмный котёл</strong> из дубины для готовки</li>
          <li>• Серые крысы не атакуют — можно подобрать как еду</li>
          <li>• Отдых (Q): 20 STA/HP за 10 еды</li>
        </ul>
        <div className="bg-white p-4 rounded-lg mt-4">
          <p className="font-semibold text-blue-800 mb-2">🎁 Награды:</p>
          <ul className="text-sm space-y-1"><li>• 2 Большие медные монеты</li><li>• +1000 XP</li><li>• +3000 XP (за поиск Феиры)</li></ul>
        </div>
        <div className="bg-white p-4 rounded-lg mt-3">
          <p className="font-semibold text-blue-800 mb-2">🗺️ Три варианта получения меча:</p>
          <ul className="text-sm space-y-1">
            <li><strong>[1]</strong> Скрытность (SCU 3+): бросьте камень, возьмите меч</li>
            <li><strong>[2]</strong> Скорость: спринт к мечу, хватайте, спринт прочь</li>
            <li><strong>[3]</strong> Тактика: приманивайте гоблинов по одному</li>
          </ul>
        </div>
      </div>
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-green-900">🍖 Сбор еды</h3>
        <p className="text-gray-700 mb-3">Еда — важнейший ресурс. SAT определяет восстановление STA.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🐇 Равнины</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Мясо кроликов (фонарь = 1 ход)</li><li>• Кролик: 30 HP, 2-4 мяса</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🌴 Тропический лес</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Фрукты, бананы</li><li>• Координаты: X47 Y102</li></ul></div>
        </div>
        <div className="bg-white p-4 rounded-lg mt-4">
          <h4 className="font-bold text-green-800 mb-2">🍲 Рецепты</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 1 мясо + 1 растение = <strong>Хороший суп</strong></li>
            <li>• Серп: сбор 1 STA вместо 3</li>
            <li>• Копчёное мясо — не портится на Hell+</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-yellow-900">💰 Заработок денег</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>Квесты и работа</strong> — основные источники</li>
          <li>• <strong>Комната в таверне:</strong> ключ дешевле еды</li>
          <li>• <strong className="text-purple-600">Рыбалка:</strong> ЛУЧШИЙ способ (20 золотых/час!)</li>
          <li>• <strong>Молоко:</strong> 150 TP в Golden Bar Club</li>
          <li>• <strong>Детёныши монстров:</strong> продажа Элиз</li>
          <li>• <strong>Маани:</strong> бесплатное хранение, лучший обмен</li>
        </ul>
      </div>
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-red-900">⚠️ Важные предупреждения</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong className="text-red-600">НЕ атакуйте NPC</strong> — низкая мораль = агрессивные стражники</li>
          <li>• <strong className="text-red-600">Не сражайтесь с 2+ врагами</strong></li>
          <li>• <strong className="text-red-600">STA = -100</strong> = рабство</li>
          <li>• <strong className="text-red-600">Hell/Doom:</strong> нельзя покинуть бой</li>
          <li>• <strong className="text-red-600">Hell+:</strong> еда портится</li>
          <li>• <strong className="text-red-600">Doom:</strong> смерть удаляет сохранение!</li>
        </ul>
      </div>
    </div>
  );
}

function QuestsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📜 Квесты</h2>
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-6">
        <p className="text-gray-700">Квесты делятся на <strong className="text-yellow-600">одноразовые</strong> (сюжетные) и <strong className="text-green-600">повторяющиеся</strong> (для заработка). Сюжетные влияют на концовку.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 pb-2">🏘️ Город Ноэр</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-blue-800 mb-3">📋 Одноразовые квесты</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="border-l-2 border-yellow-400 pl-3"><strong>Квест с крысами</strong> — обучение</li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Пропавший караван</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Башня Северного прохода</strong></li>
              <li className="border-l-2 border-red-400 pl-3"><strong className="text-red-600">Пропавшая дочь</strong> — влияет на концовку!</li>
              <li className="border-l-2 border-purple-400 pl-3"><strong>"Неизвестная" энергия на кладбище</strong></li>
              <li className="border-l-2 border-green-400 pl-3"><strong>Исследование орков</strong> (Элиз)</li>
              <li className="border-l-2 border-red-400 pl-3"><strong className="text-red-600">Исследование рыболюдей</strong> (Элиз)</li>
              <li className="border-l-2 border-red-400 pl-3"><strong className="text-red-600">Квестовая линия Коконы</strong> (4 квеста)</li>
              <li className="border-l-2 border-pink-400 pl-3"><strong>Линия Сесили</strong> (4 квеста)</li>
              <li className="border-l-2 border-purple-400 pl-3"><strong>Статуя Лируои</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Спасти Томми</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Пушка Overlord M405</strong></li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-green-800 mb-3">🔄 Повторяющиеся квесты</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="border-l-2 border-green-400 pl-3"><strong>Собрать белую драконью траву</strong></li>
              <li className="border-l-2 border-green-400 pl-3"><strong>Очистка Кристальной шахты</strong></li>
              <li className="border-l-2 border-green-400 pl-3"><strong>Нежить на кладбище</strong></li>
              <li className="border-l-2 border-green-400 pl-3"><strong>Научить орков страху</strong></li>
              <li className="border-l-2 border-green-400 pl-3"><strong>Сквоттеры в канализации</strong></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-purple-900">📖 Подробно: Пропавшая дочь</h3>
        <div className="space-y-4">
          <div><h4 className="font-bold text-purple-800 mb-2">📍 Описание</h4><p className="text-gray-700">Дочь бизнесмена пропала во время атаки орков. Последний раз видели на северо-востоке.</p></div>
          <div><h4 className="font-bold text-purple-800 mb-2">🎁 Награды</h4><ul className="text-sm text-gray-700 space-y-1"><li>• 1 Золотая монета</li><li>• +20000 XP</li><li>• +6 Морали</li><li>• За каждого выжившего: 6 медных монет, +5000 XP, +1 Мораль</li></ul></div>
          <div><h4 className="font-bold text-purple-800 mb-2">📋 Требования</h4><p className="text-sm text-gray-700">Завершить "Башню Северного прохода"</p></div>
          <div><h4 className="font-bold text-purple-800 mb-2">🗺️ Прохождение</h4>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Выйдите через восточные ворота, на север через 3 перекрёстка</li>
              <li>На 4-м — на восток через мост</li>
              <li>Войдите в пещеру на северо-востоке</li>
              <li>Найдите верёвочную лестницу (центральная комната)</li>
              <li>СОХРАНЕНИЕ перед входом в логово</li>
              <li>Найдите девушку с блондинными волосами в южной комнате</li>
              <li>Escort до выхода (не должна умереть!)</li>
              <li>Вернитесь в таверну</li>
            </ol>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">⚠️ Советы</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong className="text-red-600">Влияет на концовку!</strong></li>
              <li>• Возьмите 5-10 синих и 7-15 красных зелий</li>
              <li>• Наймите наёмников</li>
              <li>• Метод 1: скрытность (сложнее, меньше боёв)</li>
              <li>• Метод 2: убить всех (легче, больше боёв)</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-pink-900">📖 Квестовая линия Коконы</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">Квест 1: Кокона не ест мусор</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Научите Кокона есть нормальную еду</li><li>• Награда: +4000 XP, 3 Хороших супа</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">Квест 2: Кокона хочет купаться!</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Помойте Кокона</li><li>• Награда: +2000 XP, ключ, можно гладить ночью</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">Квест 3: Кокона за покупками!</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Сложный! 4-5 HP зелий, 4-5 ловушек, уровень 10+</li><li>• Кокона похищена в церкви</li><li>• Проникните в подвал, спасите от священника</li><li>• <strong className="text-red-600">Снижает мораль!</strong> Но Fake ID в конце</li><li>• В восточном крыле — <strong className="text-purple-600">Мартинский набор</strong></li><li>• Награда: +40000 XP, 2 ключа</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">Квест 4: Lona + Cocona + Mama = Семья???</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Соберите 20 золотых</li><li>• Большая Мама вызовет на дуэль (2 фазы)</li><li>• Фаза 1: лёгкая — AWS с кинжалом</li><li>• Фаза 2: Мама трансформируется — Berserk Medicine</li><li>• Победа: <strong className="text-purple-600">Shattered Katana</strong></li><li>• Кокона уплывёт с вами!</li></ul></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5"><h3 className="text-xl font-bold text-orange-700 mb-3">🏴‍☠️ Пиратская погибель</h3><ul className="text-sm text-gray-700 space-y-1"><li>• Логово орков</li><li>• Массовые захоронения</li><li>• Гробница Тёмного Берсерка</li><li>• Спасти обезьяну</li><li>• Исследовать пещеру</li><li>• Найти Мэри</li></ul></div>
        <div className="bg-white border border-gray-200 rounded-lg p-5"><h3 className="text-xl font-bold text-red-700 mb-3">🏰 Крепость Рока</h3><ul className="text-sm text-gray-700 space-y-1"><li>• Охота на Петухов</li><li>• Охота на Вудсонов</li><li>• Квесты Адама (карманник)</li><li>• Кролик Каэрбаннога</li><li>• Горный монастырь</li><li>• Зачистка нежити</li></ul></div>
      </div>
    </div>
  );
}

function BuildsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">⚔️ Билды персонажа</h2>
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-6"><p className="text-gray-700">В LonaRPG нет фиксированных классов — стиль определяется навыками и экипировкой.</p></div>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">🗡️ Воин (Physical Build)</h3>
        <p className="text-gray-700 mb-4">Самый универсальный. Фокус на физическом уроне.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">📊 Навыки</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Combat:</strong> минимум 15</li><li>• <strong>Constitution:</strong> для HP/STA</li><li>• <strong>Strength:</strong> для урона</li><li>• <strong>Agility:</strong> для уклонения</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">🎯 Traits</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Weapons Expert</strong> — обязательно</li><li>• <strong>Masochist</strong> — +1 DEF</li><li>• <strong>Bloodlust</strong> — +ATK, STA после убийства</li><li>• <strong>Bloody Mess</strong> — активирует Bloodlust</li></ul></div>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h5 className="font-bold text-orange-800 mb-2">1. Скрытный (Stealth)</h5><ul className="text-xs text-gray-600 space-y-1"><li>• Оружие: Сабля + Кинжал + Кунаи</li><li>• Сабля игнорирует DEF</li><li>• AWS → Backstab (мгновенное убийство)</li><li>• 60 ATK — 1x SS убивает гоблинов</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h5 className="font-bold text-orange-800 mb-2">2. Лучник (Archer)</h5><ul className="text-xs text-gray-600 space-y-1"><li>• Длинный лук: Shoot, Rain of Arrows, Snipe</li><li>• Тактика: выстрел → отступление → повтор</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h5 className="font-bold text-orange-800 mb-2">3. Гладиатор (Gladiator)</h5><ul className="text-xs text-gray-600 space-y-1"><li>• Катана или Лжебог-убийца</li><li>• Dodge — временная неуязвимость</li><li>• Самый сложный, но мощный</li></ul></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🔮 Маг (Magic Build)</h3>
        <p className="text-gray-700 mb-4">Высокий урон, но риски самоповреждения.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">📊 Навыки</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Wisdom:</strong> основной</li><li>• <strong>Mana Knowledge:</strong> обязательно</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">🎯 Оружие</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Посох огня:</strong> ОГРОМНЫЙ урон (x3!)</li><li>• <strong className="text-yellow-600">Молниеотвод:</strong> стан-лок, AoE</li><li>• <strong>Тотем аборигена:</strong> призыв щупалец</li></ul></div>
        </div>
        <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">⚠️ Риски</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Огонь: AoE может задеть Лону</li><li>• Вода: урон если враг на той же клетке</li><li>• Электричество: урон если Лона на воде</li></ul></div>
      </div>
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
        <h3 className="text-2xl font-bold mb-4 text-pink-800">💋 Суккуб (Succubus Build)</h3>
        <p className="text-gray-700 mb-4">Уникальный билд с механикой "Juicing".</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">📊 Навыки</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Constitution:</strong> максимум</li><li>• <strong>Черта Суккуб:</strong> обязательна</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">🎯 Тактика</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Juicing:</strong> основной урон</li><li>• <strong>Mend Soul:</strong> лечение союзников</li><li>• Не тратит STA на урон</li><li>• Восстанавливает STA/FOOD</li></ul></div>
        </div>
      </div>
    </div>
  );
}

function WeaponsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛡️ Оружие и Броня</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-purple-100"><th className="text-left p-3 border">Оружие</th><th className="text-left p-3 border">Тип</th><th className="text-left p-3 border">Особенности</th></tr></thead>
          <tbody className="text-gray-700">
            <tr className="border-b"><td className="p-3 border font-bold">Короткий меч</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Базовое оружие</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Сабля ⭐</td><td className="p-3 border">Основная рука</td><td className="p-3 border"><strong>Игнорирует DEF</strong>, +15 ATK. Лучшее для воина</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Расколотая катана ⭐</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Блок, контратака (100% стан)</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold">Лжебог-убийца</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Быстрый спин (AoE), блок</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Усиленный кинжал ⭐</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Огромный крит в спину</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold">Метательные кунаи</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Дальность 4, замедление</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold">Длинный лук</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Снайпер, Дождь стрел</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold">Алебарда</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Дальность 2, укол</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Кнут ⭐</td><td className="p-3 border">Основная рука</td><td className="p-3 border"><strong>Урон по STA</strong>, AoE. ЛУЧШЕЕ против нежити!</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold">Мушкет</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Фиксированный урон, от WIS</td></tr>
            <tr className="border-b bg-red-50"><td className="p-3 border font-bold text-red-700">Посох огня 🔥</td><td className="p-3 border">Основная рука</td><td className="p-3 border"><strong>ОГРОМНЫЙ урон (x3!)</strong></td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-red-700">Молниеотвод</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Стан-лок, AoE</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-red-700">Тотем аборигена</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Призыв щупалец. Достаточно для босса</td></tr>
            <tr className="border-b bg-purple-50"><td className="p-3 border font-bold text-purple-700">Идол верующего</td><td className="p-3 border">Основная рука</td><td className="p-3 border">AoE стан (0 урона). Для похищения детёнышей</td></tr>
          </tbody>
        </table>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-blue-900">🛡️ Броня</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Щиты</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Деревянный:</strong> начало, 1 STA за блок</li><li>• <strong>Железный:</strong> улучшенный</li><li>• <strong>Костяной:</strong> дроп с Орка-воина</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Аксессуары</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Фонарь:</strong> освещение + поджог. Обязателен!</li><li>• <strong>Серп:</strong> сбор 1 STA. Обязателен!</li><li>• <strong>Кожаный ошейник:</strong> +ATK, -DEF</li></ul></div>
        </div>
      </div>
      <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-green-900">🧪 Расходники</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Зелья</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Красное:</strong> HP + раны</li><li>• <strong className="text-blue-600">Синее:</strong> STA</li><li>• Минимум: 3 красных + 6 синих</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Взрывчатка</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Мина:</strong> убивает большинство (300 TP)</li><li>• <strong>Бомба:</strong> ручная</li><li>• <strong>Дымовая:</strong> для побега</li></ul></div>
        </div>
      </div>
    </div>
  );
}

function CharactersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 Персонажи</h2>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-2xl font-bold mb-4 text-purple-800">👤 Главные персонажи</h3>
        <div className="space-y-4">
          <CharacterCard name="Лона Фаллдин" role="Главная героиня" emoji="👧" color="pink"
            description="Девушка-беженка, чей дом был разрушен инфекцией аборигенов. Пытается заработать на побег с острова Ноэр."
            personality="Решительная, выносливая, адаптивная. Несмотря на тяжёлую судьбу, не теряет надежды."
            community="Любимица сообщества. Игроки ценят её уязвимость и силу духа. Многие считают её одним из самых запоминающихся протагонистов в инди-играх."
          />
          <CharacterCard name="Кокона" role="Работница таверны" emoji="🌸" color="purple"
            description="Молодая девушка из таверны 'Горячая бочка'. Немного наивна, но очень добра. Сирота, которую взяла под опеку Большая Мама."
            personality="Добрая, наивная, преданная. Видит в Лоне старшую сестру. Называет Большую Маму 'мамой', а Лону — 'папой' (из-за её детской наивности)."
            community="Один из самых популярных персонажей. Игроки обожают её невинность и квестовую линию. Её дуэль с Большой Мамой — один из лучших моментов игры."
          />
          <CharacterCard name="Сесили" role="Аристократка" emoji="👑" color="blue"
            description="Аристократка, помогающая Лоне. Имеет связи в высшем обществе. Её квестовая линия включает 4 квеста, но не завершена в текущей версии."
            personality="Благородная, решительная, с чувством долга. Несмотря на происхождение, готова помогать беженцам."
            community="Популярна среди игроков, ценящих сюжет. Многие ждут завершения её линии. Её квесты считаются одними из самых интересных."
          />
          <CharacterCard name="Элиз" role="Врач и исследователь" emoji="⚕️" color="green"
            description="Врач в Ноэре. Продаёт зелья, проводит исследования орков и рыболюдей. Покупает детёнышей монстров. Её 2-й квест влияет на концовку."
            personality="Практичная, умная, немного циничная. Ставит науку выше морали."
            community="Важный NPC для экономики игры. Игроки ценят её зелья и возможность продать детёнышей. Её исследования считаются интересным лором."
          />
          <CharacterCard name="Большая Мама" role="Владелица таверны, некромантка" emoji="🧙‍♀️" color="indigo"
            description="Владелица таверны 'Горячая бочка'. Практикует некромантию. Использует Книгу Нежити для защиты города от орков. Мать-опекун Коконы."
            personality="Сильная, защитница, загадочная. Готова жертвовать собой ради других. В одной из концовок погибает, защищая город."
            community="Один из самых уважаемых персонажей. Её самопожертвование в концовке трогает игроков. Дуэль с ней — один из лучших боссов."
          />
          <CharacterCard name="Капитан Эдвард" role="Капитан корабля" emoji="⚓" color="blue"
            description="Капитан корабля в порту Ноэра. Продаёт билеты за 20-30 золотых. Также предлагает стать рабом (шутка, но Лона действительно может стать рабом)."
            personality="Деловой, прагматичный. Не задаёт лишних вопросов."
            community="Важный NPC для достижения цели. Его шутка о рабстве стала мемом в сообществе."
          />
          <CharacterCard name="Гадалка" role="Мистический NPC" emoji="🔮" color="purple"
            description="Загадочная гадалка в Крепости Рока. Рассказывает о судьбе острова в концовке. Если убить её до побега — меняется концовка (ядерный удар)."
            personality="Загадочная, всзнающая. Говорит намёками."
            community="Загадочный персонаж. Игроки спорят, стоит ли её убивать. Ядерная концовка считается одной из самых драматичных."
          />
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-2xl font-bold mb-4 text-green-800">🤝 Компаньоны</h3>
        <div className="space-y-3">
          <CompanionCard name="Охотник за сокровищами" cost="Мясной суп" ability="Может сам выполнить квест на кладбище" />
          <CompanionCard name="Пёсик (Doggy)" cost="Мясной суп" ability="Уменьшает шанс плохих встреч" />
          <CompanionCard name="Индиана Джонс" cost="Предметы" ability="Уменьшает шанс плохих встреч" />
          <CompanionCard name="Эльфийский лучник" cost="Предметы" ability="Боец + уменьшает плохие встречи" />
          <CompanionCard name="Рабочая лошадь" cost="Предметы" ability="Живой сундук. Не хранит младенцев" />
          <CompanionCard name="Наёмники" cost="Золото/предметы" ability="Расходные 'мясные щиты'" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🏘️ Другие NPC</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <NpcCard name="Томми" desc="Беженец. Появляется на корабле." />
          <NpcCard name="Ранран" desc="Мать. Появляется на корабле." />
          <NpcCard name="Лиза" desc="Своя квестовая линия." />
          <NpcCard name="Маани" desc="Биржа. Бесплатное хранение." />
          <NpcCard name="Адам" desc="Карманник. Квесты на воровство." />
          <NpcCard name="Бубба" desc="Рыболюд. Племянник построит самолёт." />
          <NpcCard name="Майло" desc="Даёт приглашение." />
          <NpcCard name="Серая Крыса" desc="Компаньон." />
          <NpcCard name="Милосердие" desc="Квест в Крепости Рока." />
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ name, role, emoji, color, description, personality, community }: { name: string; role: string; emoji: string; color: string; description: string; personality: string; community: string }) {
  const colors: Record<string, string> = {
    pink: 'from-pink-50 to-rose-50 border-pink-200',
    purple: 'from-purple-50 to-violet-50 border-purple-200',
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    indigo: 'from-indigo-50 to-purple-50 border-indigo-200',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-5 border hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-3 mb-3">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h4 className="text-xl font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600 font-medium">{role}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div><strong className="text-gray-700">📖 Описание:</strong><p className="text-gray-600 mt-1">{description}</p></div>
        <div><strong className="text-gray-700">🎭 Характер:</strong><p className="text-gray-600 mt-1">{personality}</p></div>
        <div><strong className="text-gray-700">💬 В сообществе:</strong><p className="text-gray-600 mt-1">{community}</p></div>
      </div>
    </div>
  );
}

function CompanionCard({ name, cost, ability }: { name: string; cost: string; ability: string }) {
  return (
    <div className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
      <h4 className="font-bold text-gray-800">{name}</h4>
      <p className="text-xs text-gray-500 mt-1">Стоимость: {cost}</p>
      <p className="text-sm text-gray-600 mt-1">{ability}</p>
    </div>
  );
}

function NpcCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border hover:shadow-md transition-shadow">
      <h4 className="font-bold text-sm text-gray-800">{name}</h4>
      <p className="text-xs text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function LoreSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📖 Лор мира</h2>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-2xl font-bold mb-4 text-indigo-800">🌍 Остров Ноэр</h3>
        <p className="text-gray-700 leading-relaxed mb-4">Остров Ноэр — место, где разворачиваются события LonaRPG. Когда-то процветающий регион, теперь он охвачен инфекцией аборигенов — загадочной силой, превращающей живых существ в монстров.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-indigo-800 mb-2">🏘️ Город Ноэр</h4><p className="text-sm text-gray-700">Главный город острова. Последний оплот человечества. Здесь находится гильдия наёмников, таверна, клиника и порт.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-indigo-800 mb-2">🏴‍☠️ Пиратская погибель</h4><p className="text-sm text-gray-700">Прибрежный город с болотами. Захвачен орками и монстрами.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-indigo-800 mb-2">🏰 Крепость Рока</h4><p className="text-sm text-gray-700">Военная крепость. Много бандитов и нежити.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-indigo-800 mb-2">🐟 Фиштопия</h4><p className="text-sm text-gray-700">Остров рыболюдей. Древняя цивилизация с проблемами размножения.</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-2xl font-bold mb-4 text-green-800">👹 Расы и фракции</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">👥 Люди</h4><p className="text-sm text-gray-700">Основная цивилизация острова. Живут в Ноэре и других поселениях. Страдают от атак орков и инфекции.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">👹 Орки (Orkinds)</h4><p className="text-sm text-gray-700">Агрессивная раса, захватывающая территории. Быстро размножаются. В одной из концовок поедают друг друга и вымирают.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🐟 Рыболюди (Fishkinds)</h4><p className="text-sm text-gray-700">Древняя цивилизация с проблемами размножения. Живут в Фиштопии. В одной из концовок решают проблему и строят самолёты.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">👻 Аборигены (Abominations)</h4><p className="text-sm text-gray-700">Загадочная инфекция, превращающая существ в монстров. Источник заражения острова.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">💀 Нежить (Undead)</h4><p className="text-sm text-gray-700">Восстающие мёртвые. Контролируются Большой Мамой для защиты города. Слабы к кнуту (урон по STA).</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">📜 История</h3>
        <div className="space-y-3 text-gray-700">
          <p><strong>Прошлое:</strong> Остров Ноэр был процветающим регионом с человеческими городами и цивилизацией рыболюдей.</p>
          <p><strong>Катастрофа:</strong> Инфекция аборигенов начала распространяться, превращая существ в монстров. Дома были разрушены.</p>
          <p><strong>Настоящее:</strong> Люди укрылись в Ноэре. Орки захватили часть острова. Рыболюди изолированы в Фиштопии. Большая Мама использует некромантию для защиты.</p>
          <p><strong>Цель Лоны:</strong> Заработать золото и покинуть остров на корабле капитана Эдварда.</p>
        </div>
      </div>
    </div>
  );
}

function LocationsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🗺️ Локации</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-blue-800">🏘️ Город Ноэр</h3>
          <p className="text-gray-700 mb-3">Главный город острова. Гильдия, таверна, клиника, рынок, порт.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Таверна "Горячая бочка"</li><li>• Гильдия наёмников</li><li>• Клиника Элиз</li><li>• Центральный рынок</li><li>• Канализация (начало игры)</li><li>• Кладбище</li><li>• Порт (концовка)</li><li>• Церковь (квест Коконы)</li></ul>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-orange-800">🏴‍☠️ Пиратская погибель</h3>
          <p className="text-gray-700 mb-3">Прибрежный город с болотами. Много орков.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Логова орков</li><li>• Массовые захоронения</li><li>• Гробница Тёмного Берсерка</li><li>• Болотный лагерь</li><li>• Северный пост</li></ul>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-red-800">🏰 Крепость Рока</h3>
          <p className="text-gray-700 mb-3">Военная крепость. Бандиты, нежить.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Племя Петухов</li><li>• Семья Вудсон</li><li>• Кролик Каэрбаннога</li><li>• Горный монастырь</li><li>• Восточный пост</li><li>• Лагерь беженцев</li></ul>
        </div>
        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-cyan-800">🐟 Фиштопия</h3>
          <p className="text-gray-700 mb-3">Остров рыболюдей. Водные локации.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Секретная формула</li><li>• Голодная русалка</li><li>• Сбежавшие рабы</li><li>• Зловещая чешуя</li></ul>
        </div>
        <div className="bg-gradient-to-br from-teal-100 to-green-100 rounded-xl p-6 border border-teal-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-teal-800">🏯 Прибрежная крепость</h3>
          <p className="text-gray-700 mb-3">Военная крепость на побережье.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Уничтожить записи</li><li>• Доставить письмо</li><li>• Спасти товарищей</li></ul>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 text-green-800">⛺ Лагерь Южных ворот</h3>
          <p className="text-gray-700 mb-3">Лагерь беженцев. Леса, паучьи гнёзда.</p>
          <ul className="text-sm text-gray-700 space-y-1"><li>• Обыскать лес</li><li>• Инкубационный бассейн</li><li>• Квестовая линия Лизы</li><li>• Выжившие в амбаре</li></ul>
        </div>
      </div>
    </div>
  );
}

function EndingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🎬 Концовки</h2>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-300">
        <h3 className="text-2xl font-bold mb-4 text-green-800">🌟 Хорошая концовка (Побег)</h3>
        <p className="text-gray-700 mb-4">Соберите золото и купите билет у капитана Эдварда.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">💰 Стоимость</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Easy/Normal: <strong>20 золотых</strong></li><li>• Hard: <strong>25 золотых</strong></li><li>• Hell: <strong>28 золотых</strong></li><li>• Doom: <strong>30 золотых</strong></li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">👥 Пассажиры</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Томми</strong> — после миссии</li><li>• <strong>Ранран</strong> — после миссии</li><li>• <strong>Кокона</strong> — после квестовой линии</li><li>• <strong>Лиза</strong> — после квестовой линии</li></ul></div>
        </div>
        <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🎬 Обычная концовка</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-orange-600">Орки:</strong> сдерживаются, но восстанавливаются. В итоге поедают друг друга.</li><li>• <strong className="text-purple-600">Большая Мама:</strong> подняла армию нежити. Погибла, но вернулась как нежить.</li><li>• <strong className="text-cyan-600">Рыболюди:</strong> вернули земли. В 1812 построят самолёт.</li></ul></div>
        <div className="bg-white p-4 rounded-lg mt-3"><h4 className="font-bold text-red-800 mb-2">☢️ Ядерная концовка</h4><p className="text-sm text-gray-700">Если убить Гадалку — город уничтожен ядерным ударом.</p></div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
        <h3 className="text-2xl font-bold mb-4 text-red-800">💀 Плохие концовки</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">☠️ Смерть Лоны</h4><p className="text-sm text-gray-700">HP = 0. Игра окончена.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">😔 Сдаться</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Люди:</strong> мёртвая от голода</li><li>• <strong>Орки:</strong> огромное чудовище</li><li>• <strong>Рыболюди:</strong> приветствует пленников</li><li>• <strong>Аборигены:</strong> милосердный конец</li></ul></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-300">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🔄 Перерождение (NG+)</h3>
        <p className="text-gray-700">Если Лона родит человеческоподобного ребёнка — возможно перерождение.</p>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-xl font-bold mb-3 text-yellow-900">💡 Влияние на концовку</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>Убийство Гадалки</strong> — ядерная концовка</li>
          <li>• <strong>"Пропавшая дочь"</strong> — уменьшает орков</li>
          <li>• <strong>2-й квест Элиз</strong> — рыболюди процветают</li>
          <li>• <strong>Квест Коконы</strong> — Мама сбегает с Коконой</li>
          <li>• <strong>Посещение Фиштопии</strong> — рыболюди не размножаются</li>
        </ul>
      </div>
    </div>
  );
}

function MechanicsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">⚙️ Игровые механики</h2>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">📊 Характеристики</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Основные</h4><ul className="text-sm text-gray-700 space-y-2"><li><strong className="text-red-600">HP:</strong> Жизненная сила. 0 = смерть</li><li><strong className="text-yellow-600">STA:</strong> Энергия. -100 = рабство</li><li><strong className="text-green-600">FOOD:</strong> Определяет восстановление STA</li><li><strong className="text-purple-600">SAT:</strong> Насыщение (0-100)</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Боевые</h4><ul className="text-sm text-gray-700 space-y-2"><li><strong className="text-orange-600">ATK:</strong> Физический урон</li><li><strong className="text-blue-600">DEF:</strong> Снижает физический урон</li><li><strong className="text-purple-600">SUR:</strong> Снижает магический урон</li><li><strong className="text-cyan-600">WIS:</strong> Магический урон</li></ul></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">⚔️ Боевая система</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Принципы</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Пошаговые бои на сетке</li><li>• <strong className="text-red-600">НЕ сражайтесь с 2+ врагами</strong></li><li>• Не позволяйте окружить</li><li>• Short Rest при низком HP/STA</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Опыт</h4><p className="text-sm text-gray-700"><strong className="text-red-600">Убийство НЕ даёт опыт!</strong> Опыт за: квесты, восстановление STA, рабство.</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">💰 Заработок</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-yellow-800 mb-2">🐟 Рыбалка — ЛУЧШИЙ способ</h4><p className="text-sm text-gray-700">20 золотых за час!</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-yellow-800 mb-2">💼 Другие способы</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Квесты и работа</li><li>• Продажа предметов</li><li>• Молоко: 150 TP в Golden Bar Club</li><li>• Детёныши монстров: продажа Элиз</li></ul></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-2xl font-bold mb-4 text-purple-800">⛓️ Рабство</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Как попасть</h4><ul className="text-sm text-gray-700 space-y-1"><li>• STA = -100</li><li>• Сдаться в бою</li><li>• Быть захваченным</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Сложность</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-green-600">Легко:</strong> Вудсон, гоблины</li><li>• <strong className="text-yellow-600">Средне:</strong> Люди, глубоководные</li><li>• <strong className="text-red-600">Сложно:</strong> Рыболюди, святые</li><li>• <strong className="text-red-600">Невозможно:</strong> Плоть</li></ul></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-black rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">🎮 Уровни сложности</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-700 mb-2">Easy / Normal</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Стандартная игра</li><li>• Билет: 20 золотых</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-yellow-700 mb-2">Hard</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Усиленные враги</li><li>• Билет: 25 золотых</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-orange-700 mb-2">Hell</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Еда портится!</strong></li><li>• <strong className="text-red-600">Нельзя покинуть бой!</strong></li><li>• Билет: 28 золотых</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-700 mb-2">Doom</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Сложность заблокирована</strong></li><li>• <strong className="text-red-600">Смерть удаляет сохранение!</strong></li><li>• Билет: 30 золотых</li></ul></div>
        </div>
      </div>
    </div>
  );
}

function SecretsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🔮 Секреты и особенности</h2>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-2xl font-bold mb-4 text-purple-800">🥚 Пасхалки</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Кролик Каэрбаннога</h4><p className="text-sm text-gray-700">Отсылка к "Монти Пайтон". Очень опасный кролик в Крепости Рока.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Лошадиный член</h4><p className="text-sm text-gray-700">Уникальное оружие: +10 CON. После босса в Перранвей.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Статуя Лируои</h4><p className="text-sm text-gray-700">Загадочная статуя с квестовой линией.</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🗺️ Скрытые области</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Лагерь наёмников (Dev area)</h4><p className="text-sm text-gray-700">Тестовая область у лагеря Южных ворот.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Западный мост</h4><p className="text-sm text-gray-700">Помечена "незавершённой".</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Секретный вход в логово гоблинов</h4><p className="text-sm text-gray-700">Большой проём к северо-востоку. Можно войти в Ноэр без ID.</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">🚧 Нереализованный контент</h3>
        <div className="bg-white p-4 rounded-lg"><ul className="text-sm text-gray-700 space-y-1"><li>• Счастливый конец для Ноэра не реализован</li><li>• Замок Сибарис не реализован</li><li>• Линия Сесили не завершена</li><li>• Босс Пронзатель роняет ключ "TODO"</li><li>• Трио богов просто стоит</li><li>• Монастырь святых — область заблокирована</li></ul></div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">⚡ Эксплойты</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Покупка дёшево</h4><p className="text-sm text-gray-700">Эксплойт для покупки по заниженной цене.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Рыба = деньги</h4><p className="text-sm text-gray-700">Рыбалка — самый эффективный способ. 20 золотых за час!</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Ограбление сундуков</h4><p className="text-sm text-gray-700">Можно обокрасть сундуки в тюрьмах и хранилищах.</p></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-2xl font-bold mb-4 text-green-800">✨ Уникальные предметы</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Мартинский набор</h4><p className="text-sm text-gray-700">Через квест Коконы. Включает Martyr's Veil.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Расколотая катана</h4><p className="text-sm text-gray-700">Лучшее оружие гладиатора. От Большой Мамы после дуэли.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Тотем аборигена</h4><p className="text-sm text-gray-700">Призывает щупальца. Достаточно для любого босса.</p></div>
        </div>
      </div>
    </div>
  );
}

export default App;
