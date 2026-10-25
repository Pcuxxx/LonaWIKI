import { useState } from 'react';

type Section = 'home' | 'beginners' | 'quests' | 'builds' | 'weapons' | 'characters' | 'endings' | 'mechanics' | 'secrets' | 'locations';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'beginners', label: 'Новичкам', icon: '💡' },
    { id: 'quests', label: 'Квесты', icon: '📜' },
    { id: 'builds', label: 'Билды', icon: '⚔️' },
    { id: 'weapons', label: 'Оружие', icon: '🛡️' },
    { id: 'characters', label: 'Персонажи', icon: '👥' },
    { id: 'locations', label: 'Локации', icon: '🗺️' },
    { id: 'endings', label: 'Концовки', icon: '🎬' },
    { id: 'mechanics', label: 'Механики', icon: '⚙️' },
    { id: 'secrets', label: 'Секреты', icon: '🔮' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg">L</div>
              <div>
                <h1 className="text-xl font-bold">LonaRPG Wiki</h1>
                <p className="text-xs text-purple-200 hidden sm:block">Полное руководство по игре</p>
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
          <nav className={`lg:w-72 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Навигация</h2>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 ${activeSection === item.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-bold text-gray-600 mb-2">Быстрые ссылки</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li><a href="https://eccma417.itch.io/lonarpg" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">🎮 Официальная страница</a></li>
                  <li><a href="https://lonarpg.miraheze.org" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">📚 Miraheze Wiki</a></li>
                </ul>
              </div>
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              {activeSection === 'home' && <HomeSection />}
              {activeSection === 'beginners' && <BeginnersSection />}
              {activeSection === 'quests' && <QuestsSection />}
              {activeSection === 'builds' && <BuildsSection />}
              {activeSection === 'weapons' && <WeaponsSection />}
              {activeSection === 'characters' && <CharactersSection />}
              {activeSection === 'locations' && <LocationsSection />}
              {activeSection === 'endings' && <EndingsSection />}
              {activeSection === 'mechanics' && <MechanicsSection />}
              {activeSection === 'secrets' && <SecretsSection />}
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div><h3 className="text-white font-bold mb-3">LonaRPG Wiki</h3><p className="text-sm">Полное руководство по игре LonaRPG.</p></div>
            <div><h3 className="text-white font-bold mb-3">Ресурсы</h3><ul className="text-sm space-y-1"><li><a href="https://eccma417.itch.io/lonarpg" className="hover:text-purple-400">Официальная страница</a></li><li><a href="https://lonarpg.miraheze.org" className="hover:text-purple-400">Miraheze Wiki</a></li></ul></div>
            <div><h3 className="text-white font-bold mb-3">О проекте</h3><p className="text-sm">Wiki создана на основе официальных источников и гайдов сообщества.</p></div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm"><p>LonaRPG © Eccma417 | Wiki создана фанатами для фанатов</p></div>
        </div>
      </footer>
    </div>
  );
}

function HomeSection() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Добро пожаловать в LonaRPG Wiki</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">Полное руководство по выживанию, квестам и механикам игры LonaRPG</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard icon="🎮" title="О игре" color="purple" text="LonaRPG — мрачная survival RPG с открытым миром от Eccma417. Вы играете за Лону — беженку, чей дом разрушен инфекцией. Цель — заработать золото и купить билет на корабль, чтобы покинуть остров Ноэр." />
        <InfoCard icon="🎯" title="Главная цель" color="blue" text="Собрать 20-30 золотых монет (зависит от сложности) и заплатить капитану Эдварду в порту Ноэра. Способы: квесты, торговля, рыбалка, работа." />
        <InfoCard icon="⚔️" title="Боевая система" color="green" text="Пошаговые бои на сетке. Управляйте HP, STA и голодом. Убийство врагов НЕ даёт опыт — опыт за квесты и восстановление STA." />
        <InfoCard icon="🌍" title="Открытый мир" color="orange" text="Исследуйте остров: город Ноэр, Пиратская погибель, Крепость Рока, Фиштопия, Прибрежная крепость. Уникальные враги, квесты и секреты." />
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">💡 Быстрые советы</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Используйте <strong className="text-purple-600">Фонарь</strong> для поджога крыс и кроликов — экономит выносливость</li>
          <li>• Покупайте <strong className="text-blue-600">ключ от комнаты</strong> в таверне — дешевле, чем еда</li>
          <li>• Всегда носите <strong className="text-red-600">красные и синие зелья</strong> — они спасут жизнь</li>
          <li>• <strong className="text-red-600">Не сражайтесь с несколькими врагами</strong> — заманивайте по одному</li>
          <li>• <strong className="text-green-600">Рыбалка</strong> — лучший способ заработка денег</li>
        </ul>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, color, text }: { icon: string; title: string; color: string; text: string }) {
  const colors: Record<string, string> = {
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    green: 'from-green-50 to-teal-50 border-green-200',
    orange: 'from-orange-50 to-red-50 border-orange-200',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 border hover:shadow-lg transition-shadow`}>
      <div className="flex items-center mb-3"><span className="text-3xl mr-3">{icon}</span><h3 className="text-2xl font-bold text-gray-800">{title}</h3></div>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

function BeginnersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">💡 Советы для начинающих</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-blue-900">🐀 Начало игры — Квест с крысами (Обучение)</h3>
        <p className="text-gray-700 mb-3"><strong className="text-red-600">Не используйте дубину!</strong> Это неэффективно. Используйте Фонарь для поджога крыс (стоит 4 STA), затем БЕГИТЕ.</p>
        <ul className="text-gray-700 space-y-1 ml-4">
          <li>• Возьмите <strong>Вилы</strong> из сундука в левом нижнем углу (дальность x2, урон x2)</li>
          <li>• Создайте <strong>Тёмный котёл</strong> из дубины для готовки мяса</li>
          <li>• Серые крысы не атакуют — их можно подобрать как еду</li>
          <li>• Отдых (Q) восстанавливает 20 STA/HP за 10 еды</li>
        </ul>
        <div className="bg-white p-4 rounded-lg mt-4">
          <p className="font-semibold text-blue-800 mb-2">🎁 Награды:</p>
          <ul className="text-sm space-y-1"><li>• 2 Большие медные монеты</li><li>• +1000 XP</li><li>• +3000 XP (за поиск пропавшего человека — Феиры)</li></ul>
        </div>
        <div className="bg-white p-4 rounded-lg mt-3">
          <p className="font-semibold text-blue-800 mb-2">🗺️ Три варианта получения меча:</p>
          <ul className="text-sm space-y-1">
            <li><strong>[Вариант 1]</strong> Скрытность (SCU 3+): бросьте камень на кость, возьмите меч, уходите</li>
            <li><strong>[Вариант 2]</strong> Скорость: спринт к мечу, хватайте, спринт прочь (лучше без одежды)</li>
            <li><strong>[Вариант 3]</strong> Тактика: приманивайте гоблинов камнями по одному</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-green-900">🍖 Сбор еды</h3>
        <p className="text-gray-700 mb-3">Еда — важнейший ресурс. SAT определяет восстановление STA.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🐇 Равнины</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Мясо кроликов (фонарь = 1 ход)</li><li>• Кролик: 30 HP, 2-4 мяса (x2 при Overkill)</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">🌴 Тропический лес</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Фрукты, бананы (рубка деревьев)</li><li>• Координаты: X47 Y102 (рядом с Ноэром)</li></ul></div>
        </div>
        <div className="bg-white p-4 rounded-lg mt-4">
          <h4 className="font-bold text-green-800 mb-2">🍲 Рецепты</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 1 мясо + 1 растение = <strong>Хороший суп</strong> (лучшая еда)</li>
            <li>• Серп: сбор растений стоит 1 STA вместо 3</li>
            <li>• Копчёное мясо — не портится на Hell+</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-yellow-900">💰 Заработок денег</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>Квесты и работа</strong> — основные источники</li>
          <li>• <strong>Комната в таверне:</strong> ключ дешевле еды, полностью восстанавливает</li>
          <li>• <strong className="text-purple-600">Рыбалка:</strong> ЛУЧШИЙ способ (20 золотых за час!)</li>
          <li>• <strong>Молоко:</strong> 150 TP в Golden Bar Club (вместо 50)</li>
          <li>• <strong>Детёныши монстров:</strong> продавайте Элиз (используйте Idol of the Believer для стана)</li>
          <li>• <strong>Маани (Трёхсторонняя биржа):</strong> бесплатное хранение, лучший обмен</li>
          <li>• <strong>Рабочая лошадь:</strong> живой сундук для переноски предметов</li>
        </ul>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-red-900">⚠️ Важные предупреждения</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong className="text-red-600">НЕ атакуйте NPC</strong> — низкая мораль = агрессивные стражники</li>
          <li>• <strong className="text-red-600">Не сражайтесь с 2+ врагами</strong> — смертельно опасно</li>
          <li>• <strong className="text-red-600">STA = -100</strong> = рабство</li>
          <li>• <strong className="text-red-600">Hell/Doom:</strong> нельзя покинуть бой — используйте скрытность</li>
          <li>• <strong className="text-red-600">Hell+:</strong> еда портится — готовьте Копчёное мясо</li>
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
              <li className="border-l-2 border-red-400 pl-3"><strong className="text-red-600">Исследование рыболюдей</strong> (Элиз) — влияет на концовку!</li>
              <li className="border-l-2 border-red-400 pl-3"><strong className="text-red-600">Квестовая линия Коконы</strong> — влияет на концовку!</li>
              <li className="border-l-2 border-pink-400 pl-3"><strong>Линия Сесили</strong> (4 квеста)</li>
              <li className="border-l-2 border-purple-400 pl-3"><strong>Статуя Лируои</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Спасти Томми</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Пушка Overlord M405</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Приглашение Майло</strong></li>
              <li className="border-l-2 border-blue-400 pl-3"><strong>Потерянная посылка</strong></li>
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

      {/* Detailed Quest */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-purple-900">📖 Подробно: Пропавшая дочь</h3>
        <div className="space-y-4">
          <div><h4 className="font-bold text-purple-800 mb-2">📍 Описание</h4><p className="text-gray-700">Дочь бизнесмена пропала во время атаки орков. Последний раз видели с караваном на северо-востоке.</p></div>
          <div><h4 className="font-bold text-purple-800 mb-2">🎁 Награды</h4><ul className="text-sm text-gray-700 space-y-1"><li>• 1 Золотая монета</li><li>• +20000 XP</li><li>• +6 Морали</li><li>• За каждого выжившего: 6 медных монет, +5000 XP, +1 Мораль</li></ul></div>
          <div><h4 className="font-bold text-purple-800 mb-2">📋 Требования</h4><p className="text-sm text-gray-700">Завершить квест "Башня Северного прохода"</p></div>
          <div><h4 className="font-bold text-purple-800 mb-2">🗺️ Прохождение</h4>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Выйдите через восточные ворота, идите на север через 3 перекрёстка</li>
              <li>На 4-м перекрёстке — на восток через мост</li>
              <li>Войдите в пещеру на северо-востоке</li>
              <li>Найдите верёвочную лестницу (центральная комната с заразой)</li>
              <li>Сделайте СОХРАНЕНИЕ перед входом в логово</li>
              <li>Найдите девушку с блондинными волосами в южной комнате</li>
              <li>Escort до выхода (не должна умереть!)</li>
              <li>Вернитесь в таверну</li>
            </ol>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">⚠️ Советы</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong className="text-red-600">Влияет на концовку!</strong> Уменьшает популяцию орков</li>
              <li>• Возьмите 5-10 синих и 7-15 красных зелий</li>
              <li>• Наймите наёмников (Сесили + Серая Крыса)</li>
              <li>• Метод 1: скрытность (сложнее, но меньше боёв)</li>
              <li>• Метод 2: убить всех (легче, но больше боёв + таймер подкреплений)</li>
              <li>• Девушка имеет плохой pathfinding — не уходите далеко</li>
              <li>• Можно спасти 3 девушек, но блондинку — последней</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cocona Questline */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-300 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-pink-900">📖 Подробно: Квестовая линия Коконы</h3>
        <div className="space-y-4">
          <div><h4 className="font-bold text-pink-800 mb-2">📋 Требования</h4><p className="text-sm text-gray-700">Завершить квест "Энергия на кладбище" с Коконой</p></div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-pink-800 mb-2">Квест 1: Кокона не ест мусор...</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• Научите Кокона есть нормальную еду</li><li>• Просто поговорите с ней</li><li>• Награда: +4000 XP, 3 Хороших супа</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-pink-800 mb-2">Квест 2: Кокона хочет купаться!</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• Помойте Кокона</li><li>• Поговорите с Большой Мамой и Коконой</li><li>• Награда: +2000 XP, ключ от комнаты, можно гладить Кокона ночью</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-pink-800 mb-2">Квест 3: Кокона за покупками!</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Сложный квест! Подготовьтесь: 4-5 HP зелий, 4-5 взрывных ловушек, уровень 10+</li>
              <li>• Кокона будет похищена в церкви</li>
              <li>• Проникните в подвал церкви, спасите Кокона от священника</li>
              <li>• Большая Мама придёт на помощь</li>
              <li>• <strong className="text-red-600">ВНИМАНИЕ:</strong> снижает мораль! Но в конце получите Fake ID (мораль = 50)</li>
              <li>• В восточном крыле — сундук с <strong className="text-purple-600">Мартинским набором</strong></li>
              <li>• Награда: +40000 XP, 2 ключа от комнаты</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-pink-800 mb-2">Квест 4: Lona + Cocona + Mama = Семья???</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Нужно собрать 20 золотых монет</li>
              <li>• Большая Мама вызовет вас на дуэль (2 фазы)</li>
              <li>• Фаза 1: лёгкая — используйте Attack Weak Spot с кинжалом</li>
              <li>• Фаза 2: Мама трансформируется — используйте Berserk Medicine</li>
              <li>• Победа: Broken Curved Sword → Shattered Katana (лучшее оружие!)</li>
              <li>• <strong className="text-red-600">Если проиграете:</strong> потеряете 20 золотых и не получите катану</li>
              <li>• Кокона сможет уплыть с вами!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Other locations */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-orange-700 mb-3">🏴‍☠️ Пиратская погибель</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Логово монстров-орков</li><li>• Зловещие массовые захоронения</li>
            <li>• Сообщение с Северного поста</li><li>• Помощь лагерю в болотах</li>
            <li>• Пропавшая женщина</li><li>• Гробница Тёмного Берсерка</li>
            <li>• Спасти обезьяну</li><li>• Помочь рыбаку в беде</li>
            <li>• Исследовать пещеру</li><li>• Возвращение пепла</li>
            <li>• Найти Мэри</li><li>• Сопроводить путешественников</li>
            <li className="pt-2 border-t mt-2"><strong>Повторяющиеся:</strong> Выколоть глаза, Спасти петухов</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-red-700 mb-3">🏰 Крепость Рока</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Охота на племя Петухов</li><li>• Охота на семью Вудсон</li>
            <li>• Квест с карманником (Адам)</li><li>• Украсть мушкеты (Адам)</li>
            <li>• Любовное письмо</li><li>• Убить распространителя лжи</li>
            <li>• Мать в беде (Ранран)</li><li>• Восточный сторожевой пост</li>
            <li>• Кролик Каэрбаннога</li><li>• Горный монастырь</li>
            <li>• Проверить монахов</li><li>• Зачистка нежити</li>
            <li className="pt-2 border-t mt-2"><strong>Повторяющиеся:</strong> Устранить бандитов</li>
          </ul>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-cyan-700 mb-3">🐟 Фиштопия</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Секретная формула</li><li>• Голодная русалка</li>
            <li>• Сбежавшие рабы</li><li>• Зловещая чешуя (одноразовый + повторяющийся)</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-teal-700 mb-3">🏯 Прибрежная крепость / Южные ворота</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Уничтожить записи</li><li>• Доставить письмо</li>
            <li>• Спасти товарищей</li><li>• Обыскать лес</li>
            <li>• Уничтожить инкубационный бассейн</li><li>• Квестовая линия Лизы</li>
            <li>• Выжившие в амбаре</li><li>• Собрать ноги пауков (повт.)</li>
            <li>• Мясо бегунов (повт.)</li><li>• Кости мутировавших (повт.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BuildsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">⚔️ Билды персонажа</h2>
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-6">
        <p className="text-gray-700">В LonaRPG нет фиксированных классов — стиль игры определяется распределением очков навыков и выбором экипировки.</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">🗡️ Воин (Physical Build)</h3>
        <p className="text-gray-700 mb-4">Самый универсальный билд. Фокус на физическом уроне, снижаемом DEF врага.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">📊 Навыки</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Combat:</strong> минимум 15 очков</li><li>• <strong>Constitution:</strong> для HP и STA</li><li>• <strong>Strength:</strong> для урона</li><li>• <strong>Agility:</strong> для уклонения</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">🎯 Ключевые Traits</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Weapons Expert</strong> — обязательно</li><li>• <strong>Masochist</strong> — +1 DEF</li><li>• <strong>Bloodlust</strong> — +ATK, STA после убийства</li><li>• <strong>Bloody Mess</strong> — активирует Bloodlust + лут</li><li>• <strong>Improved Throw</strong> — приманивание</li></ul>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-orange-800 mb-2">1. Скрытный (Stealth)</h5>
            <p className="text-sm text-gray-700 mb-2">Отвлечение, нокауты, удары в спину. Эффективен против врагов с низким HP/DEF.</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Оружие:</strong> Сабля + Усиленный кинжал + Метательные кунаи</li>
              <li>• Сабля игнорирует DEF врага</li>
              <li>• AWS (2 STA) → Backstab (мгновенное убийство)</li>
              <li>• 23.4 ATK — 2x AWS убивает гоблинов</li>
              <li>• 60 ATK — 1x SS убивает гоблинов с любого направления</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-orange-800 mb-2">2. Лучник (Archer)</h5>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• <strong>Длинный лук:</strong> Shoot (быстрый), Rain of Arrows (AoE), Snipe (3 сек зарядка)</li>
              <li>• Тактика: один выстрел → отступление → повтор</li>
              <li>• Используйте ловушки для контроля</li>
              <li>• Не достаточно для завершения игры!</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-orange-800 mb-2">3. Гладиатор (Gladiator)</h5>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• <strong>Расколотая катана</strong> или <strong>Лжебог-убийца</strong></li>
              <li>• Ключевой навык: Dodge — временная неуязвимость</li>
              <li>• Требует идеального тайминга</li>
              <li>• Самый сложный, но самый мощный стиль</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🔮 Маг (Magic Build)</h3>
        <p className="text-gray-700 mb-4">Высокий урон, но риски самоповреждения.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">📊 Навыки</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Wisdom:</strong> основной стат</li><li>• <strong>Mana Knowledge:</strong> обязательно</li><li>• <strong>Constitution:</strong> для выживания</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">🎯 Оружие</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong className="text-red-600">Посох огня:</strong> ОГРОМНЫЙ урон (x3 множитель!)</li>
              <li>• <strong className="text-yellow-600">Молниеотвод:</strong> стан-лок, AoE</li>
              <li>• <strong className="text-cyan-600">Посох воды:</strong> одиночная цель</li>
              <li>• <strong>Книга огня:</strong> AoE огненный шар</li>
              <li>• <strong>Книга электричества:</strong> Тесла-катушка</li>
              <li>• <strong>Тотем аборигена:</strong> призыв щупалец</li>
            </ul>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-red-800 mb-2">⚠️ Риски самоповреждения</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Огонь:</strong> AoE может задеть Лону</li>
            <li>• <strong>Вода:</strong> урон если враг на той же клетке</li>
            <li>• <strong>Электричество:</strong> урон если Лона на воде</li>
            <li>• <strong>Абориген:</strong> призывы могут атаковать вас</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
        <h3 className="text-2xl font-bold mb-4 text-pink-800">💋 Суккуб (Succubus Build)</h3>
        <p className="text-gray-700 mb-4">Уникальный билд с механикой "Juicing" как основным источником урона.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">📊 Навыки</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• <strong>Constitution:</strong> максимум</li><li>• <strong>Черта Суккуб:</strong> обязательна</li><li>• Нанимайте наёмников для нежити</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-pink-800 mb-2">🎯 Тактика</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Juicing:</strong> основной урон</li>
              <li>• <strong>Mend Soul:</strong> лечение союзников</li>
              <li>• <strong>Relic of Retribution:</strong> снимает DEF/SUR</li>
              <li>• <strong>Relic of Guardian:</strong> AoE лечение и барьеры</li>
              <li>• Не тратит STA на урон</li>
              <li>• Восстанавливает STA/FOOD при использовании</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-xl font-bold mb-3 text-yellow-900">🎯 Рекомендации</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong className="text-green-600">Воин</strong> — самый простой и универсальный выбор</li>
          <li>• <strong className="text-pink-600">Суккуб</strong> — интересная альтернатива с уникальной механикой</li>
          <li>• Избегайте чистого мага в первом прохождении</li>
          <li>• Комбинируйте стили для гибкости</li>
        </ul>
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
          <thead>
            <tr className="bg-purple-100"><th className="text-left p-3 border">Оружие</th><th className="text-left p-3 border">Тип</th><th className="text-left p-3 border">Класс</th><th className="text-left p-3 border">Особенности</th></tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Короткий меч</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Обычное</td><td className="p-3 border">Базовое оружие</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Сабля ⭐</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Высокое качество</td><td className="p-3 border"><strong>Игнорирует DEF</strong>, +15 ATK. Лучшее оружие воина</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Расколотая катана ⭐</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Блок, контратака (100% стан), широкий слэш</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Лжебог-убийца</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Быстрый спин (AoE), блок, игнорирует DEF</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Усиленный кинжал ⭐</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Огромный крит урон в спину</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Метательные кунаи</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Дальность 4, замедление</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Длинный лук</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Снайпер, Дождь стрел</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Алебарда</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Высокое качество</td><td className="p-3 border">Дальность 2, укол, AoE</td></tr>
            <tr className="border-b bg-yellow-50"><td className="p-3 border font-bold text-yellow-700">Кнут ⭐</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Высокое качество</td><td className="p-3 border"><strong>Урон по STA</strong>, AoE. ЛУЧШЕЕ против нежити!</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-yellow-700">Мушкет</td><td className="p-3 border">Двуручное</td><td className="p-3 border">Обычное</td><td className="p-3 border">Фиксированный урон, масштабируется от WIS</td></tr>
            <tr className="border-b bg-red-50"><td className="p-3 border font-bold text-red-700">Посох огня 🔥</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Магическое</td><td className="p-3 border"><strong>ОГРОМНЫЙ урон (x3 множитель!)</strong></td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-red-700">Молниеотвод</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Магическое</td><td className="p-3 border">Стан-лок, AoE</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-red-700">Тотем аборигена</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Магическое</td><td className="p-3 border">Призыв щупалец. Достаточно для любого босса</td></tr>
            <tr className="border-b bg-purple-50"><td className="p-3 border font-bold text-purple-700">Идол верующего</td><td className="p-3 border">Основная рука</td><td className="p-3 border">Божественное</td><td className="p-3 border">AoE стан (0 урона). Для похищения детёнышей</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-purple-700">Реликвия возмездия</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Божественное</td><td className="p-3 border">Снимает DEF/SUR врага</td></tr>
            <tr className="border-b"><td className="p-3 border font-bold text-purple-700">Реликвия хранителя</td><td className="p-3 border">Вторая рука</td><td className="p-3 border">Божественное</td><td className="p-3 border">AoE лечение и барьеры</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-blue-900">🛡️ Броня и Экипировка</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Щиты</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Деревянный щит:</strong> начало игры, 1 STA за блок</li>
              <li>• <strong>Железный щит:</strong> улучшенный блок</li>
              <li>• <strong>Костяной щит:</strong> дроп с Орка-воина и босса</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Аксессуары</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Фонарь:</strong> освещение + поджог. Обязателен!</li>
              <li>• <strong>Серп:</strong> сбор растений 1 STA. Обязателен!</li>
              <li>• <strong>Кожаный ошейник:</strong> +ATK, -DEF, -Weak</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
        <h3 className="text-xl font-bold mb-3 text-green-900">🧪 Расходники</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">Зелья</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong className="text-red-600">Красное:</strong> HP + снимает 2 раны</li>
              <li>• <strong className="text-blue-600">Синее:</strong> STA</li>
              <li>• Минимум: 3 красных + 6 синих</li>
              <li>• Дешёвые у Элиз</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">Взрывчатка</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Осколочная мина:</strong> убивает большинство (300 TP)</li>
              <li>• <strong>Осколочная бомба:</strong> ручная</li>
              <li>• <strong>Дымовая бомба:</strong> для побега</li>
              <li>• <strong>Шоковая бомба:</strong> стан</li>
              <li>• Покупайте ночью на рынке Ноэра</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharactersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 Персонажи</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
          <h3 className="text-xl font-bold mb-3 text-purple-800">👤 Главные персонажи</h3>
          <div className="space-y-3">
            <CharCard name="Лона Фаллдин" role="Главная героиня" desc="Беженка, потерявшая дом. Пытается покинуть остров." />
            <CharCard name="Сесили" role="Аристократка" desc="Помогает Лоне. 4 квеста в линии. Линия не завершена в игре." />
            <CharCard name="Кокона" role="Работница таверны" desc="Квестовая линия из 4 квестов. Может уплыть с вами. Открывает Мартинский набор." />
            <CharCard name="Элиз" role="Врач и исследователь" desc="Продаёт зелья, покупает детёнышей. 2 квеста влияют на концовку." />
            <CharCard name="Капитан Эдвард" role="Капитан корабля" desc="Продаёт билеты за 20-30 золотых. Шутка: предлагает стать рабом." />
            <CharCard name="Большая Мама" role="Владелица таверны" desc="Некромантка. Защищает город нежитью. Погибает в одной из концовок." />
            <CharCard name="Гадалка" role="Мистический NPC" desc="Рассказывает о судьбе в концовке. Убийство = ядерная концовка." />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 border border-green-200">
          <h3 className="text-xl font-bold mb-3 text-green-800">🤝 Компаньоны</h3>
          <div className="space-y-3">
            <CharCard name="Охотник за сокровищами" role="Наёмник" desc="Нанимается за Мясо суп. Может сам выполнить квест на кладбище." />
            <CharCard name="Пёсик (Doggy)" role="Наёмник" desc="Уменьшает шанс плохих встреч." />
            <CharCard name="Индиана Джонс" role="Наёмник" desc="Уменьшает шанс плохих встреч." />
            <CharCard name="Эльфийский лучник" role="Наёмник" desc="Уменьшает шанс плохих встреч + боец." />
            <CharCard name="Рабочая лошадь" role="Особый" desc="Живой сундук. Не хранит младенцев." />
            <CharCard name="Наёмники" role="Расходные" desc="Можно нанимать снова. Используются как 'мясные щиты'." />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
        <h3 className="text-xl font-bold mb-3 text-blue-800">🏘️ Другие NPC</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <NpcCard name="Томми" desc="Беженец. Появляется на корабле." />
          <NpcCard name="Ранран" desc="Мать. Появляется на корабле." />
          <NpcCard name="Лиза" desc="Своя квестовая линия. Появляется на корабле." />
          <NpcCard name="Маани" desc="Биржа. Бесплатное хранение, лучший обмен." />
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

function CharCard({ name, role, desc }: { name: string; role: string; desc: string }) {
  return (
    <div className="bg-white/70 rounded-lg p-3">
      <h4 className="font-bold text-gray-800">{name}</h4>
      <p className="text-xs text-purple-600 font-medium">{role}</p>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function NpcCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-white/70 rounded-lg p-3">
      <h4 className="font-bold text-sm text-gray-800">{name}</h4>
      <p className="text-xs text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function LocationsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🗺️ Локации</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-2xl font-bold mb-3 text-blue-800">🏘️ Город Ноэр</h3>
          <p className="text-gray-700 mb-3">Главный город острова. Здесь находится гильдия наёмников, таверна "Горячая бочка", клиника Элиз, рынок и порт.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Таверна "Горячая бочка":</strong> наём компаньонов, отдых</li>
            <li>• <strong>Гильдия:</strong> квесты</li>
            <li>• <strong>Клиника Элиз:</strong> зелья, исследования</li>
            <li>• <strong>Центральный рынок:</strong> торговля (ночью — взрывчатка)</li>
            <li>• <strong>Канализация:</strong> начало игры, сквоттеры</li>
            <li>• <strong>Кладбище:</strong> нежить</li>
            <li>• <strong>Порт:</strong> корабль (концовка)</li>
            <li>• <strong>Церковь:</strong> связана с квестом Коконы</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-2xl font-bold mb-3 text-orange-800">🏴‍☠️ Пиратская погибель</h3>
          <p className="text-gray-700 mb-3">Прибрежный город с болотами и пещерами. Много орков и монстров.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Логова орков</li>
            <li>• Массовые захоронения</li>
            <li>• Гробница Тёмного Берсерка</li>
            <li>• Болотный лагерь</li>
            <li>• Северный пост</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
          <h3 className="text-2xl font-bold mb-3 text-red-800">🏰 Крепость Рока</h3>
          <p className="text-gray-700 mb-3">Военная крепость. Много бандитов, нежити и опасных монстров.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Племя Петухов</li>
            <li>• Семья Вудсон</li>
            <li>• Кролик Каэрбаннога</li>
            <li>• Горный монастырь</li>
            <li>• Восточный пост</li>
            <li>• Лагерь беженцев (Ранран)</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
          <h3 className="text-2xl font-bold mb-3 text-cyan-800">🐟 Фиштопия</h3>
          <p className="text-gray-700 mb-3">Остров рыболюдей. Водные локации, подводные пещеры.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Секретная формула</li>
            <li>• Голодная русалка</li>
            <li>• Сбежавшие рабы</li>
            <li>• Зловещая чешуя</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-2xl font-bold mb-3 text-teal-800">🏯 Прибрежная крепость</h3>
          <p className="text-gray-700 mb-3">Военная крепость на побережье.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Уничтожить записи</li>
            <li>• Доставить письмо</li>
            <li>• Спасти товарищей</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-2xl font-bold mb-3 text-green-800">⛺ Лагерь Южных ворот</h3>
          <p className="text-gray-700 mb-3">Лагерь беженцев у южных ворот. Леса, паучьи гнёзда.</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Обыскать лес</li>
            <li>• Инкубационный бассейн</li>
            <li>• Квестовая линия Лизы</li>
            <li>• Выжившие в амбаре</li>
          </ul>
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
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">💰 Стоимость билета</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Easy/Normal: <strong>20 золотых</strong></li>
              <li>• Hard: <strong>25 золотых</strong></li>
              <li>• Hell: <strong>28 золотых</strong></li>
              <li>• Doom: <strong>30 золотых</strong></li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">👥 Пассажиры корабля</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Томми</strong> — после миссии сопровождения</li>
              <li>• <strong>Ранран</strong> — после миссии сопровождения</li>
              <li>• <strong>Кокона</strong> — после квестовой линии</li>
              <li>• <strong>Лиза</strong> — после квестовой линии</li>
            </ul>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">🎬 Обычная концовка (Doom)</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong className="text-orange-600">Орки:</strong> сдерживаются наёмниками, но восстанавливаются. В итоге поедают друг друга и вымирают.</li>
            <li>• <strong className="text-purple-600">Большая Мама:</strong> подняла армию нежити. Погибла через месяц, но вернулась как нежить.</li>
            <li>• <strong className="text-cyan-600">Рыболюди:</strong> вернули земли. Решили проблему размножения. В 1812 племянник Буббы построит самолёт.</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg mt-3">
          <h4 className="font-bold text-red-800 mb-2">☢️ Ядерная концовка</h4>
          <p className="text-sm text-gray-700">Если убить Гадалку до посадки — город будет уничтожен ядерным ударом. Отключает следующую часть.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300">
        <h3 className="text-2xl font-bold mb-4 text-red-800">💀 Плохие концовки</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">☠️ Смерть Лоны</h4>
            <p className="text-sm text-gray-700">HP = 0. Игра окончена.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">😔 Сдаться в цикле насилия</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Люди:</strong> Лона найдена мёртвой от голода</li>
              <li>• <strong>Орки:</strong> становится огромным чудовищем</li>
              <li>• <strong>Рыболюди:</strong> приветствует новых пленников</li>
              <li>• <strong>Аборигены:</strong> наёмники даруют милосердный конец</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-300">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🔄 Перерождение (NG+)</h3>
        <p className="text-gray-700">Если Лона родит человеческоподобного ребёнка — возможно перерождение. Открывает новый цикл игры.</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-xl font-bold mb-3 text-yellow-900">💡 Влияние на концовку</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>Убийство Гадалки</strong> — ядерная концовка</li>
          <li>• <strong>"Пропавшая дочь"</strong> — уменьшает популяцию орков</li>
          <li>• <strong>2-й квест Элиз</strong> — рыболюди процветают</li>
          <li>• <strong>Квест Коконы</strong> — Большая Мама сбегает с Коконой</li>
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
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Основные</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong className="text-red-600">HP:</strong> Жизненная сила. 0 = смерть</li>
              <li><strong className="text-yellow-600">STA:</strong> Энергия. -100 = рабство</li>
              <li><strong className="text-green-600">FOOD:</strong> Определяет восстановление STA</li>
              <li><strong className="text-purple-600">SAT:</strong> Насыщение (0-100)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">Боевые</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong className="text-orange-600">ATK:</strong> Физический урон</li>
              <li><strong className="text-blue-600">DEF:</strong> Снижает физический урон</li>
              <li><strong className="text-purple-600">SUR:</strong> Снижает магический урон</li>
              <li><strong className="text-cyan-600">WIS:</strong> Магический урон</li>
              <li><strong className="text-green-600">CON:</strong> Телосложение</li>
              <li><strong className="text-gray-600">SCU:</strong> Скрытность</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">⚔️ Боевая система</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">Основные принципы</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Пошаговые бои на сетке</li>
              <li>• <strong className="text-red-600">НЕ сражайтесь с 2+ врагами</strong></li>
              <li>• Изучайте оружие врагов</li>
              <li>• Не позволяйте окружить себя</li>
              <li>• Постоянно двигайтесь</li>
              <li>• Short Rest при низком HP/STA</li>
              <li>• "Combat State" работает на 5/7 тайлах</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">Типы урона</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Физический:</strong> снижается DEF</li>
              <li>• <strong>Магический:</strong> снижается SUR</li>
              <li>• <strong>Урон по STA:</strong> эффективен против нежити</li>
              <li>• <strong>Игнорирование DEF:</strong> Сабля, спин Лжебог-убийцы, заряд катаны</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-red-800 mb-2">Опыт</h4>
            <p className="text-sm text-gray-700"><strong className="text-red-600">Убийство НЕ даёт опыт!</strong> Опыт за: квесты, восстановление STA, рабство.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">💰 Заработок</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-2">🐟 Рыбалка — ЛУЧШИЙ способ</h4>
            <p className="text-sm text-gray-700">Можно заработать 20 золотых за час!</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-2">💼 Другие способы</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Квесты и работа</li>
              <li>• Продажа предметов из сундуков</li>
              <li>• Молоко: 150 TP в Golden Bar Club</li>
              <li>• Детёныши монстров: продажа Элиз</li>
              <li>• Копчёное мясо — прибыльно</li>
              <li>• Проституция — крайний случай</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-2xl font-bold mb-4 text-purple-800">⛓️ Рабство</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2">Как попасть</h4>
            <ul className="text-sm text-gray-700 space-y-1"><li>• STA = -100</li><li>• Сдаться в бою</li><li>• Быть захваченным</li></ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2">Сложность</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong className="text-green-600">Легко:</strong> Вудсон (дверь открыта ночью), гоблины</li>
              <li>• <strong className="text-yellow-600">Средне:</strong> Люди, глубоководные</li>
              <li>• <strong className="text-red-600">Сложно:</strong> Рыболюди (морят голодом), святые</li>
              <li>• <strong className="text-red-600">Невозможно:</strong> Плоть (в улье к востоку от крепости)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2">Выживание и побег</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Делайте всё, что хотят — не получайте доп. повреждения</li>
              <li>• Ждите момента, когда покормят</li>
              <li>• Копите еду и сперму для STA</li>
              <li>• Рабство даёт много XP</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-black rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">🎮 Уровни сложности</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-700 mb-2">Easy / Normal</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Стандартная игра</li><li>• Билет: 20 золотых</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-yellow-700 mb-2">Hard</h4><ul className="text-sm text-gray-700 space-y-1"><li>• Усиленные враги</li><li>• Билет: 25 золотых</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-orange-700 mb-2">Hell</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Еда портится!</strong></li><li>• <strong className="text-red-600">Нельзя покинуть бой!</strong></li><li>• Билет: 28 золотых</li><li>• Копчёное мясо работает на 80%</li></ul></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-700 mb-2">Doom</h4><ul className="text-sm text-gray-700 space-y-1"><li>• <strong className="text-red-600">Сложность заблокирована навсегда</strong></li><li>• <strong className="text-red-600">Смерть удаляет сохранение!</strong></li><li>• Билет: 30 золотых</li><li>• Автосохранение каждые полдня</li></ul></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-xl font-bold mb-3 text-purple-800">💡 Полезные механики</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>CTRL:</strong> ускорение диалогов</li>
          <li>• <strong>CTRL+SHIFT+ALT:</strong> ускорение игры</li>
          <li>• <strong>Фонарь в EXT:</strong> освещение (меньше, чем в руке)</li>
          <li>• <strong>SCU 5+:</strong> достаточно для большинства квестов</li>
          <li>• <strong>Hide перед боем:</strong> не будете окружены</li>
          <li>• <strong>На Hell/Doom:</strong> нельзя сбежать из боя — sneak out</li>
        </ul>
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
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-purple-800 mb-2">Статуя Лируои</h4><p className="text-sm text-gray-700">Загадочная статуя с квестовой линией. Связана с лором.</p></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">🗺️ Скрытые области</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Лагерь наёмников (Dev area)</h4><p className="text-sm text-gray-700">Тестовая область у лагеря Южных ворот.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Западный мост</h4><p className="text-sm text-gray-700">Помечена "незавершённой". Ограниченный контент.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Секретный вход в логово гоблинов</h4><p className="text-sm text-gray-700">Большой проём в стене к северо-востоку от гоблинов. Можно войти в Ноэр без ID.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-blue-800 mb-2">Сундук в логове гоблинов</h4><p className="text-sm text-gray-700">Дальний северо-восточный угол. С SCU 5+ можно добраться в начале игры.</p></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800">🚧 Нереализованный контент</h3>
        <div className="bg-white p-4 rounded-lg">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Счастливый конец для острова Ноэр не реализован</li>
            <li>• Замок Сибарис и заключение истории не реализованы</li>
            <li>• Квестовая линия Сесили не имеет завершения</li>
            <li>• Босс Пронзатель роняет ключ "TODO"</li>
            <li>• Трио богов просто стоит вокруг хрустального шара</li>
            <li>• Квест мальчика в Облачной деревне не завершён</li>
            <li>• Монастырь святых — правая область заблокирована</li>
            <li>• Некоторые предметы без описаний (Селитра, Менструальное лекарство)</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-2xl font-bold mb-4 text-red-800">⚡ Эксплойты и трюки</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Покупка дёшево</h4><p className="text-sm text-gray-700">Существует эксплойт для покупки по заниженной цене.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Быстрый уровень</h4><p className="text-sm text-gray-700">Легкий способ повышения уровня через определённые механики.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Рыба = деньги</h4><p className="text-sm text-gray-700">Рыбалка — самый эффективный способ заработка. 20 золотых за час!</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Ограбление сундуков</h4><p className="text-sm text-gray-700">Можно обокрасть сундуки в тюрьме арены, доме рабов, тюрьме церкви, банковском хранилище.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-red-800 mb-2">Если потеряли ВСЁ</h4><p className="text-sm text-gray-700">Идите на рынок Ноэра, разденьтесь, убедитесь что достаточно Weak/Dirt. Зарабатывайте проституцией и попрошайничеством (только у женщин!).</p></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-2xl font-bold mb-4 text-green-800">✨ Уникальные предметы</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Мартинский набор</h4><p className="text-sm text-gray-700">Уникальный набор через квест Коконы. Включает Martyr's Veil.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Расколотая катана</h4><p className="text-sm text-gray-700">Лучшее оружие гладиатора. Получается от Большой Мамы после дуэли.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Реликвии</h4><p className="text-sm text-gray-700">Реликвия возмездия (снимает DEF/SUR) и Реликвия хранителя (лечение/барьеры).</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Тотем аборигена</h4><p className="text-sm text-gray-700">Призывает неограниченные щупальца. Достаточно для любого босса.</p></div>
          <div className="bg-white p-4 rounded-lg"><h4 className="font-bold text-green-800 mb-2">Святая реликвия</h4><p className="text-sm text-gray-700">Награда за квест "The Evil in the Mass Grave" + "Message from North Point". Даётся Justice.</p></div>
        </div>
      </div>
    </div>
  );
}

export default App;
