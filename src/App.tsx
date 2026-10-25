import { useState } from 'react';

type Section = 'home' | 'beginners' | 'quests' | 'builds' | 'weapons' | 'characters' | 'endings' | 'mechanics' | 'secrets';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'beginners', label: 'Советы новичкам', icon: '💡' },
    { id: 'quests', label: 'Квесты', icon: '📜' },
    { id: 'builds', label: 'Билды', icon: '⚔️' },
    { id: 'weapons', label: 'Оружие и Броня', icon: '🛡️' },
    { id: 'characters', label: 'Персонажи', icon: '👥' },
    { id: 'endings', label: 'Концовки', icon: '🎬' },
    { id: 'mechanics', label: 'Механики', icon: '⚙️' },
    { id: 'secrets', label: 'Секреты', icon: '🔮' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            LonaRPG Wiki
          </h1>
          <p className="text-gray-400 text-sm mt-1">Полное руководство по выживанию на острове Ноэр</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-3 text-purple-300">Навигация</h2>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                          : 'hover:bg-purple-500/20 text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
              {activeSection === 'home' && <HomeSection />}
              {activeSection === 'beginners' && <BeginnersSection />}
              {activeSection === 'quests' && <QuestsSection />}
              {activeSection === 'builds' && <BuildsSection />}
              {activeSection === 'weapons' && <WeaponsSection />}
              {activeSection === 'characters' && <CharactersSection />}
              {activeSection === 'endings' && <EndingsSection />}
              {activeSection === 'mechanics' && <MechanicsSection />}
              {activeSection === 'secrets' && <SecretsSection />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function HomeSection() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Добро пожаловать в LonaRPG Wiki
        </h2>
        <p className="text-gray-300 text-lg">
          Полное руководство по выживанию, квестам и механикам игры
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-2xl font-bold mb-3 text-purple-300">🎮 О игре</h3>
          <p className="text-gray-300 leading-relaxed">
            LonaRPG — это мрачная survival RPG с открытым миром, созданная разработчиком Eccma417. 
            Вы играете за Лону, девушку-беженку, чей дом был разрушен инфекцией аборигенов. 
            Ваша цель — заработать достаточно золота, чтобы купить билет на корабль и покинуть остров Ноэр.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
          <h3 className="text-2xl font-bold mb-3 text-blue-300">🎯 Главная цель</h3>
          <p className="text-gray-300 leading-relaxed">
            Собрать <span className="text-yellow-400 font-bold">20-30 золотых монет</span> (зависит от сложности) 
            и заплатить капитану Эдварду в порту Ноэра за билет на корабль. 
            Это можно сделать различными способами: выполнение квестов, торговля, рыбалка, работа и многое другое.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg p-6 border border-green-500/30">
          <h3 className="text-2xl font-bold mb-3 text-green-300">⚔️ Боевая система</h3>
          <p className="text-gray-300 leading-relaxed">
            Пошаговые бои на сетке. Управляйте здоровьем (HP), выносливостью (STA) и голодом. 
            Используйте различное оружие, магию и тактики. Победа над врагами не даёт опыт — 
            опыт получают за выполнение квестов и восстановление выносливости.
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-lg p-6 border border-red-500/30">
          <h3 className="text-2xl font-bold mb-3 text-red-300">🌍 Открытый мир</h3>
          <p className="text-gray-300 leading-relaxed">
            Исследуйте остров свободно: город Ноэр, крепость Пиратская погибель, 
            крепость Рока, Фиштопия, прибрежная крепость и другие локации. 
            Каждая область имеет уникальных врагов, квесты и секреты.
          </p>
        </div>
      </div>

      <div className="bg-black/40 rounded-lg p-6 border border-yellow-500/30">
        <h3 className="text-xl font-bold mb-3 text-yellow-300">💡 Быстрые советы</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Используйте <span className="text-purple-300">Фонарь</span> для поджога крыс и кроликов — это экономит выносливость</li>
          <li>• Покупайте <span className="text-blue-300">ключ от комнаты</span> в таверне — дешевле, чем покупать еду</li>
          <li>• Носите с собой <span className="text-red-300">красные и синие зелья</span> — они спасут жизнь</li>
          <li>• Не сражайтесь с несколькими врагами одновременно — заманивайте по одному</li>
          <li>• Рыба — лучший способ заработка денег в игре</li>
        </ul>
      </div>
    </div>
  );
}

function BeginnersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">💡 Советы для начинающих</h2>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-900/30 to-transparent rounded-lg p-5 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold mb-2 text-purple-200">🐀 Начало игры — Квест с крысами</h3>
          <p className="text-gray-300 mb-2">
            <strong>Не используйте дубину на крысах!</strong> Это неэффективно по выносливости.
          </p>
          <ul className="text-gray-300 space-y-1 ml-4">
            <li>• Используйте <span className="text-orange-300">Фонарь</span> для поджога крыс (стоит 4 STA)</li>
            <li>• После поджога — БЕГИТЕ и дайте крысе сгореть</li>
            <li>• Возьмите <span className="text-yellow-300">Вилы</span> из сундука в левом нижнем углу стартовой зоны</li>
            <li>• Можно пропустить обучение — поднимитесь по лестнице справа (без награды)</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-transparent rounded-lg p-5 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold mb-2 text-blue-200">🍖 Сбор еды</h3>
          <p className="text-gray-300 mb-2">Еда — самый важный ресурс. Без неё Лона не сможет восстанавливать HP и STA.</p>
          <ul className="text-gray-300 space-y-1 ml-4">
            <li>• <span className="text-green-300">Равнины:</span> мясо кроликов (используйте фонарь)</li>
            <li>• <span className="text-green-300">Тропический лес:</span> растительная еда (фрукты, бананы)</li>
            <li>• Комбинируйте 1 мясо + 1 растение = <span className="text-yellow-300">Хороший суп</span></li>
            <li>• Используйте <span className="text-orange-300">Серп</span> — сбор растений стоит 1 STA вместо 3</li>
            <li>• Тропический лес рядом с Ноэром: координаты X47 Y102</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-transparent rounded-lg p-5 border-l-4 border-green-500">
          <h3 className="text-xl font-bold mb-2 text-green-200">💰 Заработок денег</h3>
          <ul className="text-gray-300 space-y-2 ml-4">
            <li>• <span className="text-yellow-300">Квесты и работа</span> — основные источники дохода</li>
            <li>• <span className="text-blue-300">Комната в таверне:</span> покупайте ключ и отдыхайте — дешевле, чем еда</li>
            <li>• <span className="text-purple-300">Рыбалка:</span> ЛУЧШИЙ способ заработка (подробнее в разделе Механики)</li>
            <li>• <span className="text-red-300">Продажа предметов:</span> собирайте лут из сундуков</li>
            <li>• <span className="text-pink-300">Молоко:</span> продавайте в Golden Bar Club по 150 TP за единицу (вместо 50)</li>
            <li>• <span className="text-orange-300">Детёныши монстров:</span> продавайте Элиз в её клинике</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-red-900/30 to-transparent rounded-lg p-5 border-l-4 border-red-500">
          <h3 className="text-xl font-bold mb-2 text-red-200">⚠️ Важные предупреждения</h3>
          <ul className="text-gray-300 space-y-2 ml-4">
            <li>• <span className="text-red-400">НЕ атакуйте NPC</span> — низкая мораль сделает стражников агрессивными</li>
            <li>• <span className="text-red-400">Не сражайтесь с 2+ врагами</span> — это смертельно опасно</li>
            <li>• <span className="text-red-400">Следите за выносливостью</span> — если STA = -100, попадёте в рабство</li>
            <li>• <span className="text-red-400">На сложности Hell/Doom</span> нельзя покинуть бой — используйте скрытность</li>
            <li>• <span className="text-red-400">Еда портится на Hell+</span> — готовьте Копчёное мясо</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-yellow-900/30 to-transparent rounded-lg p-5 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold mb-2 text-yellow-200">🎯 Первые шаги</h3>
          <ol className="text-gray-300 space-y-2 ml-4 list-decimal">
            <li>Пройдите квест с крысами (обучение)</li>
            <li>Соберите еду и ресурсы</li>
            <li>Получите <span className="text-yellow-300">Короткий меч</span> и <span className="text-blue-300">Деревянный щит</span></li>
            <li>Выполняйте повторяющиеся квесты в Ноэре для заработка</li>
            <li>Нанимайте наёмников для помощи в квестах</li>
            <li>Исследуйте мир и выполняйте сюжетные квесты</li>
            <li>Копите золото для побега с острова</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function QuestsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">📜 Квесты</h2>

      <div className="bg-black/40 rounded-lg p-5 mb-6">
        <p className="text-gray-300">
          Квесты делятся на <span className="text-yellow-300 font-bold">одноразовые</span> (сюжетные) и 
          <span className="text-green-300 font-bold"> повторяющиеся</span> (для заработка). 
          Выполнение сюжетных квестов открывает новые области, компаньонов и влияет на концовку.
        </p>
      </div>

      {/* Noer Quests */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-blue-300 border-b border-blue-500/30 pb-2">
          🏘️ Город Ноэр
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-transparent rounded-lg p-4 border border-blue-500/20">
            <h4 className="font-bold text-blue-200 mb-2">📋 Одноразовые квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-yellow-300">Квест с крысами</span> — обучение</li>
              <li>• <span className="text-yellow-300">Пропавший караван</span></li>
              <li>• <span className="text-yellow-300">Очистка башни Северного прохода</span></li>
              <li>• <span className="text-yellow-300">Пропавшая дочь</span></li>
              <li>• <span className="text-yellow-300">"Неизвестная" энергия на кладбище</span></li>
              <li>• <span className="text-yellow-300">Набор: Пиратская погибель</span></li>
              <li>• <span className="text-yellow-300">Набор: Крепость Рока</span></li>
              <li>• <span className="text-yellow-300">Исследование орков</span> (Элиз)</li>
              <li>• <span className="text-yellow-300">Исследование рыболюдей</span> (Элиз)</li>
              <li>• <span className="text-yellow-300">Приглашение Майло</span></li>
              <li>• <span className="text-pink-300">Спасти партнёра Серой Крысы</span> (Сесили)</li>
              <li>• <span className="text-pink-300">Спасти беженцев</span> (Сесили)</li>
              <li>• <span className="text-pink-300">Светский дворянин</span> (Сесили)</li>
              <li>• <span className="text-pink-300">Украсть документы</span> (Сесили)</li>
              <li>• <span className="text-purple-300">Квестовая линия Коконы</span></li>
              <li>• <span className="text-purple-300">Статуя Лируои</span></li>
              <li>• <span className="text-purple-300">Спасти Томми</span></li>
              <li>• <span className="text-purple-300">Пушка Overlord M405</span></li>
              <li>• <span className="text-red-300">Убить маленького ублюдка</span></li>
              <li>• <span className="text-red-300">Потерянная посылка</span></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-transparent rounded-lg p-4 border border-green-500/20">
            <h4 className="font-bold text-green-200 mb-2">🔄 Повторяющиеся квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-green-300">Собрать белую драконью траву</span></li>
              <li>• <span className="text-green-300">Очистка монстров в Кристальной шахте</span></li>
              <li>• <span className="text-green-300">Нежить на кладбище</span></li>
              <li>• <span className="text-green-300">Научить орков страху</span></li>
              <li>• <span className="text-green-300">Сквоттеры в канализации</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pirate's Bane Quests */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-orange-300 border-b border-orange-500/30 pb-2">
          🏴‍☠️ Пиратская погибель
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-900/30 to-transparent rounded-lg p-4 border border-orange-500/20">
            <h4 className="font-bold text-orange-200 mb-2">📋 Одноразовые квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Логово монстров-орков</li>
              <li>• Зловещие массовые захоронения</li>
              <li>• Сообщение с Северного поста</li>
              <li>• Помощь лагерю в болотах</li>
              <li>• Пропавшая женщина</li>
              <li>• Гробница Тёмного Берсерка</li>
              <li>• Спасти обезьяну</li>
              <li>• Помочь рыбаку в беде</li>
              <li>• Исследовать пещеру</li>
              <li>• Возвращение пепла</li>
              <li>• Найти Мэри</li>
              <li>• Сопроводить путешественников</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-transparent rounded-lg p-4 border border-green-500/20">
            <h4 className="font-bold text-green-200 mb-2">🔄 Повторяющиеся квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Выколоть им глаза</li>
              <li>• Спасти петухов</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Doom Fortress Quests */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-red-300 border-b border-red-500/30 pb-2">
          🏰 Крепость Рока
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-900/30 to-transparent rounded-lg p-4 border border-red-500/20">
            <h4 className="font-bold text-red-200 mb-2">📋 Одноразовые квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Охота на племя Петухов</li>
              <li>• Охота на семью Вудсон</li>
              <li>• Квест с карманником (Адам)</li>
              <li>• Украсть мушкеты (Адам)</li>
              <li>• Любовное письмо</li>
              <li>• Убить распространителя лжи (Гадалка)</li>
              <li>• Мать в беде (Ранран)</li>
              <li>• Помощь Восточному сторожевому посту</li>
              <li>• Кролик Каэрбаннога</li>
              <li>• Отправиться в Горный монастырь</li>
              <li>• Проверить жизнь монахов</li>
              <li>• Зачистка нежити</li>
              <li>• Сопроводить путешественников</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-transparent rounded-lg p-4 border border-green-500/20">
            <h4 className="font-bold text-green-200 mb-2">🔄 Повторяющиеся квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Устранить бандитов</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fishtopia Quests */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-cyan-300 border-b border-cyan-500/30 pb-2">
          🐟 Фиштопия
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-900/30 to-transparent rounded-lg p-4 border border-cyan-500/20">
            <h4 className="font-bold text-cyan-200 mb-2">📋 Одноразовые квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Секретная формула</li>
              <li>• Голодная русалка</li>
              <li>• Сбежавшие рабы</li>
              <li>• Зловещая чешуя</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-transparent rounded-lg p-4 border border-green-500/20">
            <h4 className="font-bold text-green-200 mb-2">🔄 Повторяющиеся квесты</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Зловещая чешуя</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Coastal Fortress & South Gate */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-teal-300 border-b border-teal-500/30 pb-2">
          🏯 Прибрежная крепость и Южные ворота
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-teal-900/30 to-transparent rounded-lg p-4 border border-teal-500/20">
            <h4 className="font-bold text-teal-200 mb-2">Прибрежная крепость</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Уничтожить записи</li>
              <li>• Доставить письмо</li>
              <li>• Спасти товарищей</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-teal-900/30 to-transparent rounded-lg p-4 border border-teal-500/20">
            <h4 className="font-bold text-teal-200 mb-2">Лагерь Южных ворот</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Обыскать лес</li>
              <li>• Уничтожить инкубационный бассейн</li>
              <li>• Квестовая линия Лизы</li>
              <li>• Выжившие в амбаре</li>
              <li>• Собрать ноги пауков (повторяющийся)</li>
              <li>• Собрать мясо бегунов (повторяющийся)</li>
              <li>• Кости мутировавших монстров (повторяющийся)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30 mt-6">
        <h3 className="text-xl font-bold mb-3 text-purple-200">💡 Важные советы по квестам</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-yellow-300">Квест на кладбище</span> — выполните с Охотником за сокровищами, он справится сам</li>
          <li>• <span className="text-yellow-300">Квестовая линия Коконы</span> — открывает доступ к Мартинскому набору</li>
          <li>• <span className="text-yellow-300">Квестовая линия Сесили</span> — развивает сюжет и даёт уникальные награды</li>
          <li>• <span className="text-red-300">Некоторые квесты безвозвратны</span> — проверяйте wiki перед важными решениями</li>
          <li>• <span className="text-green-300">Повторяющиеся квесты</span> — лучший способ заработка в начале игры</li>
        </ul>
      </div>
    </div>
  );
}

function BuildsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">⚔️ Билды персонажа</h2>

      <div className="bg-black/40 rounded-lg p-5 mb-6">
        <p className="text-gray-300">
          В LonaRPG нет фиксированных классов — вы сами выбираете стиль игры через распределение очков навыков и выбор экипировки.
        </p>
      </div>

      {/* Warrior Build */}
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-4 text-red-300">🗡️ Воин (Physical Build)</h3>
        <p className="text-gray-300 mb-4">
          Самый универсальный и прямолинейный билд. Фокус на физическом уроне, который снижается защитой (DEF) врага.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-bold text-red-200 mb-2">📊 Распределение навыков</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-yellow-300">Боевые навыки (Combat):</span> минимум 15 очков</li>
              <li>• <span className="text-yellow-300">Телосложение (Constitution):</span> для HP и выносливости</li>
              <li>• <span className="text-yellow-300">Сила (Strength):</span> для урона</li>
              <li>• <span className="text-yellow-300">Ловкость (Agility):</span> для уклонения</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-red-200 mb-2">🎯 Ключевые черты (Traits)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-purple-300">Эксперт оружия</span> — обязательно для качественного оружия</li>
              <li>• <span className="text-purple-300">Мазохист</span> — +1 DEF, не теряете настроение от ударов</li>
              <li>• <span className="text-purple-300">Жажда крови</span> — +ATK, восстановление STA после убийства</li>
              <li>• <span className="text-purple-300">Кровавый хаос</span> — активирует Жажду крови + дополнительный лут</li>
              <li>• <span className="text-purple-300">Улучшенный бросок</span> — для приманивания врагов</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-red-200">🎭 Стили боя</h4>
          
          <div className="bg-black/30 rounded-lg p-4">
            <h5 className="font-bold text-orange-300 mb-2">1. Скрытный (Stealth)</h5>
            <p className="text-sm text-gray-300 mb-2">
              Отвлечение, нокауты и удары в спину. Эффективен против врагов с низким HP/бронёй.
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Оружие: Сабля + Усиленный кинжал + Метательные кунаи</li>
              <li>• Тактика: отвлекайте камнями, атакуйте со спины (x1.5 урон)</li>
              <li>• Сабля игнорирует DEF врага</li>
              <li>• Удар в слабое место (2 STA) → Удар в спину (мгновенное убийство)</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h5 className="font-bold text-orange-300 mb-2">2. Лучник (Archer)</h5>
            <p className="text-sm text-gray-300 mb-2">
              Стрельба из укрытий. Требует пространства для манёвра.
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Оружие: Длинный лук</li>
              <li>• Атаки: Выстрел (быстрый), Дождь стрел (AoE), Снайперский выстрел (3 сек зарядка)</li>
              <li>• Тактика: один выстрел → отступление → повтор</li>
              <li>• Используйте ловушки для контроля</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h5 className="font-bold text-orange-300 mb-2">3. Гладиатор (Gladiator)</h5>
            <p className="text-sm text-gray-300 mb-2">
              Прямой бой лицом к лицу. Самый сложный, но самый мощный стиль.
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Оружие: Расколотая катана или Лжебог-убийца</li>
              <li>• Ключевой навык: Уклонение (Dodge) — временная неуязвимость</li>
              <li>• Требует идеального тайминга</li>
              <li>• Комбинируйте уклонение с прыжками катаны</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mage Build */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 text-blue-300">🔮 Маг (Magic Build)</h3>
        <p className="text-gray-300 mb-4">
          Фокус на магическом уроне. Высокий урон, но риски самоповреждения.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-bold text-blue-200 mb-2">📊 Распределение навыков</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-yellow-300">Мудрость (Wisdom):</span> основной стат для урона</li>
              <li>• <span className="text-yellow-300">Знание маны:</span> обязательно для магического оружия</li>
              <li>• <span className="text-yellow-300">Телосложение:</span> для выживания</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-blue-200 mb-2">🎯 Магическое оружие</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-red-300">Посох огня:</span> ОГРОМНЫЙ урон (x3 множитель), отбрасывает</li>
              <li>• <span className="text-yellow-300">Молниеотвод:</span> стан-лок, AoE, бьёт по толпе</li>
              <li>• <span className="text-cyan-300">Посох воды:</span> одиночная цель, безопасен с союзниками</li>
              <li>• <span className="text-orange-300">Книга заклинаний огня:</span> AoE огненный шар, стан</li>
              <li>• <span className="text-purple-300">Книга заклинаний электричества:</span> Тесла-катушка</li>
              <li>• <span className="text-green-300">Тотем аборигена:</span> призыв щупалец</li>
            </ul>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <h4 className="font-bold text-blue-200 mb-2">⚠️ Риски самоповреждения</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <span className="text-red-300">Огонь:</span> AoE урон может задеть Лону</li>
            <li>• <span className="text-cyan-300">Вода:</span> урон если враг на той же клетке</li>
            <li>• <span className="text-yellow-300">Электричество:</span> урон если Лона на воде</li>
            <li>• <span className="text-purple-300">Абориген:</span> призывы могут атаковать вас</li>
          </ul>
        </div>
      </div>

      {/* Succubus Build */}
      <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6 border border-pink-500/30">
        <h3 className="text-2xl font-bold mb-4 text-pink-300">💋 Суккуб (Succubus Build)</h3>
        <p className="text-gray-300 mb-4">
          Уникальный билд, использующий механику "сочувствия" (Juicing) как основной источник урона.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-pink-200 mb-2">📊 Распределение навыков</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-yellow-300">Телосложение:</span> максимум очков</li>
              <li>• <span className="text-yellow-300">Харизма:</span> для эффективности Juicing</li>
              <li>• <span className="text-yellow-300">Черта Суккуб:</span> обязательна</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-pink-200 mb-2">🎯 Тактика</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-pink-300">Juicing:</span> основной источник урона</li>
              <li>• <span className="text-green-300">Исцеление души:</span> лечение союзников</li>
              <li>• <span className="text-purple-300">Реликвия возмездия:</span> снимает DEF/SUR врага</li>
              <li>• <span className="text-blue-300">Реликвия хранителя:</span> AoE лечение и барьеры</li>
              <li>• Нанимайте наёмников для боя с нежитью</li>
            </ul>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 mt-4">
          <h4 className="font-bold text-pink-200 mb-2">💡 Преимущества</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Не тратит выносливость на урон</li>
            <li>• Восстанавливает STA/FOOD при использовании</li>
            <li>• Эффективен против большинства врагов</li>
            <li>• Слаб против нежити и самок рыболюдей</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-5 border border-yellow-500/30">
        <h3 className="text-xl font-bold mb-3 text-yellow-200">🎯 Рекомендации для первого прохождения</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-green-300">Воин</span> — самый простой и универсальный выбор</li>
          <li>• <span className="text-pink-300">Суккуб</span> — интересная альтернатива с уникальной механикой</li>
          <li>• Избегайте чистого мага в первом прохождении — слишком рискованно</li>
          <li>• Комбинируйте стили: воин + немного магии для гибкости</li>
        </ul>
      </div>
    </div>
  );
}

function WeaponsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">🛡️ Оружие и Броня</h2>

      {/* Weapons Table */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-orange-300 border-b border-orange-500/30 pb-2">
          ⚔️ Оружие
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-900/50">
                <th className="text-left p-3 text-purple-200">Оружие</th>
                <th className="text-left p-3 text-purple-200">Тип</th>
                <th className="text-left p-3 text-purple-200">Особенности</th>
                <th className="text-left p-3 text-purple-200">Применение</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Короткий меч</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">Базовое оружие</td>
                <td className="p-3">Начало игры</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Сабля</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">Игнорирует DEF, +15 ATK</td>
                <td className="p-3">Основное оружие воина</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Расколотая катана</td>
                <td className="p-3">Двуручное</td>
                <td className="p-3">Блок, контратака (100% стан)</td>
                <td className="p-3">Гладиатор</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Лжебог-убийца</td>
                <td className="p-3">Двуручное</td>
                <td className="p-3">Быстрый спин, AoE, блок</td>
                <td className="p-3">Против толпы</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Усиленный кинжал</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Огромный крит урон</td>
                <td className="p-3">Скрытный стиль</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Метательные кунаи</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Дальность 4, замедление</td>
                <td className="p-3">Кайтинг, ловушки</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Длинный лук</td>
                <td className="p-3">Двуручное</td>
                <td className="p-3">Снайпер, Дождь стрел</td>
                <td className="p-3">Лучник</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Алебарда</td>
                <td className="p-3">Двуручное</td>
                <td className="p-3">Дальность 2, укол</td>
                <td className="p-3">Против зарядки врагов</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Кнут</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">Урон по STA, AoE</td>
                <td className="p-3">Против нежити</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-yellow-300">Мушкет</td>
                <td className="p-3">Двуручное</td>
                <td className="p-3">Фиксированный урон, масштабируется от WIS</td>
                <td className="p-3">Мгновенное убийство кроликов</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-red-300">Посох огня</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">ОГРОМНЫЙ урон (x3)</td>
                <td className="p-3">Маг</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-red-300">Молниеотвод</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">Стан-лок, AoE</td>
                <td className="p-3">Против толпы</td>
              </tr>
              <tr className="border-b border-purple-500/20">
                <td className="p-3 font-bold text-red-300">Тотем аборигена</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Призыв щупалец</td>
                <td className="p-3">Саммонер</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Armor Table */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-blue-300 border-b border-blue-500/30 pb-2">
          🛡️ Броня и Экипировка
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900/50">
                <th className="text-left p-3 text-blue-200">Предмет</th>
                <th className="text-left p-3 text-blue-200">Слот</th>
                <th className="text-left p-3 text-blue-200">Эффект</th>
                <th className="text-left p-3 text-blue-200">Примечания</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Деревянный щит</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Блок атак</td>
                <td className="p-3">Начало игры, стоит 1 STA за блок</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Железный щит</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Улучшенный блок</td>
                <td className="p-3">Поздняя игра</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Костяной щит</td>
                <td className="p-3">Вторая рука</td>
                <td className="p-3">Выпадает с орков</td>
                <td className="p-3">Только с Орка-воина и босса</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Фонарь</td>
                <td className="p-3">Вторая рука / EXT</td>
                <td className="p-3">Освещение, поджог</td>
                <td className="p-3">Обязателен для кроликов</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Кожаный ошейник</td>
                <td className="p-3">Аксессуар</td>
                <td className="p-3">+ATK, -DEF, -Weak</td>
                <td className="p-3">Для агрессивного стиля</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Серп</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">Сбор растений 1 STA</td>
                <td className="p-3">Обязателен для выживания</td>
              </tr>
              <tr className="border-b border-blue-500/20">
                <td className="p-3 font-bold text-yellow-300">Идол верующего</td>
                <td className="p-3">Основная рука</td>
                <td className="p-3">AoE стан (0 урона)</td>
                <td className="p-3">Для похищения детёнышей</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Consumables */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-green-300 border-b border-green-500/30 pb-2">
          🧪 Расходники
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-900/30 to-transparent rounded-lg p-4 border border-red-500/20">
            <h4 className="font-bold text-red-200 mb-2">Зелья</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-red-300">Красное зелье:</span> восстановление HP, снимает раны</li>
              <li>• <span className="text-blue-300">Синее зелье:</span> восстановление STA</li>
              <li>• Всегда носите минимум 3 красных и 6 синих</li>
              <li>• Дешёвые у Элиз — покупайте регулярно</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-transparent rounded-lg p-4 border border-orange-500/20">
            <h4 className="font-bold text-orange-200 mb-2">Взрывчатка</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-orange-300">Осколочная мина:</span> убивает большинство врагов</li>
              <li>• <span className="text-orange-300">Осколочная бомба:</span> ручная detonation</li>
              <li>• <span className="text-orange-300">Дымовая бомба:</span> для побега</li>
              <li>• <span className="text-orange-300">Шоковая бомба:</span> стан</li>
              <li>• Покупайте ночью на Центральном рынке Ноэра (300 TP/мина)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 text-purple-200">💡 Советы по экипировке</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-yellow-300">Сабля</span> — лучшее оружие для воина (игнорирует DEF)</li>
          <li>• <span className="text-yellow-300">Фонарь</span> — обязателен в начале (поджог кроликов)</li>
          <li>• <span className="text-yellow-300">Серп</span> — обязателен для эффективного сбора еды</li>
          <li>• <span className="text-yellow-300">Пиво</span> — 2 банки дают +3 ATK (3 банки = потеря контроля)</li>
          <li>• <span className="text-yellow-300">Причёска "Растрёпанные короткие волосы"</span> — снижает Weak/Sexy, повышает Dirty (больше SCU)</li>
        </ul>
      </div>
    </div>
  );
}

function CharactersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">👥 Персонажи</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Characters */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30">
          <h3 className="text-xl font-bold mb-3 text-purple-200">👤 Главные персонажи</h3>
          
          <div className="space-y-3">
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-pink-300">Лона Фаллдин</h4>
              <p className="text-sm text-gray-300">Главная героиня. Беженка, потерявшая дом из-за инфекции аборигенов. Пытается заработать на побег с острова.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Сесили</h4>
              <p className="text-sm text-gray-300">Аристократка, помогает Лоне. Имеет свою квестовую линию с уникальными наградами.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-purple-300">Кокона</h4>
              <p className="text-sm text-gray-300">Девушка из таверны "Горячая бочка". Её квестовая линия открывает Мартинский набор и влияет на концовку.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-red-300">Элиз</h4>
              <p className="text-sm text-gray-300">Врач и исследователь. Продаёт зелья, покупает детёнышей монстров. Даёт квесты на исследование орков и рыболюдей.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-yellow-300">Капитан Эдвард</h4>
              <p className="text-sm text-gray-300">Капитан корабля в порту Ноэра. Продаёт билеты за 20-30 золотых монет. Также предлагает стать рабом (шутка).</p>
            </div>
          </div>
        </div>

        {/* Companions */}
        <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-lg p-5 border border-green-500/30">
          <h3 className="text-xl font-bold mb-3 text-green-200">🤝 Компаньоны</h3>
          
          <div className="space-y-3">
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-green-300">Охотник за сокровищами</h4>
              <p className="text-sm text-gray-300">Нанимается в таверне за Мясо суп. Может выполнить квест на кладбище самостоятельно.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-green-300">Пёсик (Doggy)</h4>
              <p className="text-sm text-gray-300">Нанимается в таверне. Уменьшает шанс плохих встреч.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-green-300">Индиана Джонс</h4>
              <p className="text-sm text-gray-300">Уменьшает шанс плохих встреч. Полезен для исследования.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-green-300">Эльфийский лучник</h4>
              <p className="text-sm text-gray-300">Уменьшает шанс плохих встреч. Боевой компаньон.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-green-300">Рабочая лошадь</h4>
              <p className="text-sm text-gray-300">Живой сундук. Переносит предметы, но не может хранить младенцев.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-yellow-300">Наёмники</h4>
              <p className="text-sm text-gray-300">Нанимаются в таверне. Могут быть использованы как "расходный материал" для отвлечения врагов. Уникальные компаньоны могут умереть навсегда.</p>
            </div>
          </div>
        </div>

        {/* NPCs */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-5 border border-blue-500/30 md:col-span-2">
          <h3 className="text-xl font-bold mb-3 text-blue-200">🏘️ Важные NPC</h3>
          
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Томми</h4>
              <p className="text-xs text-gray-300">Беженец. Появляется на корабле если спасти его.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Ранран</h4>
              <p className="text-xs text-gray-300">Мать в Крепости Рока. Появляется на корабле после квеста.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Лиза</h4>
              <p className="text-xs text-gray-300">Имеет свою квестовую линию. Появляется на корабле.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Большая Мама</h4>
              <p className="text-xs text-gray-300">Владелица таверны. Использует некромантию для защиты города.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Гадалка</h4>
              <p className="text-xs text-gray-300">Рассказывает о судьбе острова. Убийство меняет концовку.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Маани</h4>
              <p className="text-xs text-gray-300">Трёхсторонняя биржа. Бесплатное хранение предметов, лучший обмен.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Адам</h4>
              <p className="text-xs text-gray-300">Карманник в Крепости Рока. Даёт квесты на воровство.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Майло</h4>
              <p className="text-xs text-gray-300">Даёт приглашение. Связан с сюжетной линией.</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <h4 className="font-bold text-blue-300">Бубба</h4>
              <p className="text-xs text-gray-300">Рыболюд. Его племянник построит самолёт в одной из концовок.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-5 border border-yellow-500/30">
        <h3 className="text-xl font-bold mb-3 text-yellow-200">💡 Взаимодействие с NPC</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-red-300">НЕ атакуйте NPC</span> — это снизит мораль и сделает их враждебными</li>
          <li>• <span className="text-yellow-300">Компаньоны</span> могут умереть навсегда — будьте осторожны</li>
          <li>• <span className="text-green-300">Уникальные компаньоны</span> нанимаются бесплатно, но не возрождаются</li>
          <li>• <span className="text-blue-300">Наёмники</span> — возобновляемый ресурс, можно использовать как "мясные щиты"</li>
          <li>• <span className="text-purple-300">Некоторые NPC</span> появляются на корабле в концовке если выполнить их квесты</li>
        </ul>
      </div>
    </div>
  );
}

function EndingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">🎬 Концовки</h2>

      <div className="bg-black/40 rounded-lg p-5 mb-6">
        <p className="text-gray-300">
          В LonaRPG несколько типов концовок, зависящих от ваших действий и обстоятельств.
        </p>
      </div>

      {/* Happy Ending */}
      <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
        <h3 className="text-2xl font-bold mb-4 text-green-300">🌟 Хорошая концовка (Побег)</h3>
        <p className="text-gray-300 mb-4">
          Главная цель игры — собрать достаточно золота и купить билет на корабль у капитана Эдварда.
        </p>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">💰 Стоимость билета</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-yellow-300">Easy/Normal:</span> 20 золотых монет</li>
              <li>• <span className="text-yellow-300">Hard:</span> 25 золотых монет</li>
              <li>• <span className="text-yellow-300">Hell:</span> 28 золотых монет</li>
              <li>• <span className="text-yellow-300">Doom:</span> 30 золотых монет</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">🎬 Обычная концовка (Doom)</h4>
            <p className="text-sm text-gray-300 mb-2">
              После посадки на корабль Гадалка рассказывает о судьбе фракций:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <span className="text-orange-300">Орки:</span> благодаря наёмникам их популяция сдерживается, но они быстро восстанавливаются. В конечном итоге поедают друг друга и вымирают.</li>
              <li>• <span className="text-purple-300">Большая Мама:</span> подняла армию нежити для защиты города. Погибла через месяц, но вернулась как нежить.</li>
              <li>• <span className="text-cyan-300">Рыболюди:</span> после смерти людей и орков вернули свои земли. Решили проблему размножения. В 1812 году племянник Буббы построит самолёт.</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">☢️ Альтернативная концовка (Ядерный удар)</h4>
            <p className="text-sm text-gray-300">
              Если убить Гадалку до посадки на корабль, город Ноэр будет уничтожен ядерным ударом существа, известного только как "Он". 
              Это отключает возможность следующей части игры.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">👥 Пассажиры корабля</h4>
            <p className="text-sm text-gray-300 mb-2">
              Если выполнить квестовые линии, на корабле можно встретить:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <span className="text-blue-300">Томми</span> — после миссии сопровождения</li>
              <li>• <span className="text-blue-300">Ранран</span> — после миссии сопровождения</li>
              <li>• <span className="text-blue-300">Кокона</span> — после завершения квестовой линии</li>
              <li>• <span className="text-blue-300">Лиза</span> — после завершения квестовой линии</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bad Endings */}
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-4 text-red-300">💀 Плохие концовки</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">☠️ Смерть Лоны</h4>
            <p className="text-sm text-gray-300">
              Очевидно — если HP достигает 0, Лона умирает. Игра окончена.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">😔 Сдаться в цикле насилия</h4>
            <p className="text-sm text-gray-300 mb-2">
              Если Лона попадает в плен и игрок выбирает "Сдаться", концовка зависит от расы похитителей:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <span className="text-blue-300">Люди:</span> Лона найдена мёртвой от голода на улице</li>
              <li>• <span className="text-green-300">Орки:</span> Лона постоянно кормится, становится огромным чудовищем, всегда голодным</li>
              <li>• <span className="text-cyan-300">Рыболюди:</span> Лона остаётся живой, приветствует новых пленников</li>
              <li>• <span className="text-purple-300">Аборигены:</span> Наёмники рейдили логово и даровали Лоне милосердный конец</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Neutral Ending */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 text-blue-300">🔄 Нейтральная концовка (Перерождение)</h3>
        <p className="text-gray-300">
          Если Лона родит человеческоподобного ребёнка, возможно перерождение (NG+). 
          Это открывает новый цикл игры с сохранением некоторых прогрессов.
        </p>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-5 border border-yellow-500/30">
        <h3 className="text-xl font-bold mb-3 text-yellow-200">💡 Влияние на концовку</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-yellow-300">Убийство Гадалки</span> — меняет концовку на ядерный удар</li>
          <li>• <span className="text-yellow-300">Квест "Пропавшая дочь"</span> — влияет на судьбу орков</li>
          <li>• <span className="text-yellow-300">Второй квест Элиз</span> — рыболюди процветают</li>
          <li>• <span className="text-yellow-300">Квестовая линия Коконы</span> — Большая Мама сбегает с Коконой</li>
          <li>• <span className="text-yellow-300">Посещение Фиштопии</span> — рыболюди не могут размножаться</li>
        </ul>
      </div>
    </div>
  );
}

function MechanicsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">⚙️ Игровые механики</h2>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 text-blue-300">📊 Характеристики</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-blue-200 mb-2">Основные статы</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>
                <span className="text-red-300 font-bold">HP (Здоровье):</span>
                <p className="text-xs text-gray-400 ml-2">Жизненная сила. 0 = смерть</p>
              </li>
              <li>
                <span className="text-yellow-300 font-bold">STA (Выносливость):</span>
                <p className="text-xs text-gray-400 ml-2">Энергия для действий. -100 = рабство</p>
              </li>
              <li>
                <span className="text-green-300 font-bold">FOOD (Сытость):</span>
                <p className="text-xs text-gray-400 ml-2">Определяет восстановление STA</p>
              </li>
              <li>
                <span className="text-purple-300 font-bold">SAT (Насыщение):</span>
                <p className="text-xs text-gray-400 ml-2">Текущий уровень сытости (0-100)</p>
              </li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-blue-200 mb-2">Боевые статы</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>
                <span className="text-orange-300 font-bold">ATK (Атака):</span>
                <p className="text-xs text-gray-400 ml-2">Физический урон</p>
              </li>
              <li>
                <span className="text-blue-300 font-bold">DEF (Защита):</span>
                <p className="text-xs text-gray-400 ml-2">Снижает физический урон</p>
              </li>
              <li>
                <span className="text-purple-300 font-bold">SUR (Сопротивление):</span>
                <p className="text-xs text-gray-400 ml-2">Снижает магический урон</p>
              </li>
              <li>
                <span className="text-cyan-300 font-bold">WIS (Мудрость):</span>
                <p className="text-xs text-gray-400 ml-2">Магический урон</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Combat */}
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-4 text-red-300">⚔️ Боевая система</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Основные принципы</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Пошаговые бои на сетке</li>
              <li>• <span className="text-red-300">НЕ сражайтесь с 2+ врагами</span> — заманивайте по одному</li>
              <li>• Изучайте оружие врагов — от этого зависит тактика</li>
              <li>• Не позволяйте себя окружить</li>
              <li>• Постоянно двигайтесь (как гоблины)</li>
              <li>• Используйте короткую передышку (Short Rest) при низком HP/STA</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Типы урона</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-orange-300">Физический:</span> снижается DEF врага</li>
              <li>• <span className="text-purple-300">Магический:</span> снижается SUR врага</li>
              <li>• <span className="text-yellow-300">Урон по STA:</span> эффективен против нежити</li>
              <li>• <span className="text-red-300">Игнорирование DEF:</span> Сабля, спин Лжебог-убийцы, заряд катаны</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Победа над врагами</h4>
            <p className="text-sm text-gray-300 mb-2">
              <span className="text-red-300">Убийство врагов НЕ даёт опыт!</span> Опыт получают за:
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Награды за квесты</li>
              <li>• Восстановление выносливости</li>
              <li>• Рабство (постоянное изнасилование даёт XP)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Money Making */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-500/30">
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">💰 Заработок денег</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-200 mb-2">🐟 Рыбалка — ЛУЧШИЙ способ</h4>
            <p className="text-sm text-gray-300 mb-2">
              Рыба — самый прибыльный ресурс. Можно продать рыбу и заработать 20 золотых монет за час!
            </p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Ловите рыбу в водоёмах</li>
              <li>• Продавайте торговцам</li>
              <li>• Копчёное мясо тоже очень прибыльно</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-200 mb-2">💼 Другие способы</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-green-300">Квесты:</span> основной источник в начале игры</li>
              <li>• <span className="text-green-300">Работа:</span> различные задания в городах</li>
              <li>• <span className="text-green-300">Продажа предметов:</span> лут из сундуков</li>
              <li>• <span className="text-green-300">Молоко:</span> 150 TP в Golden Bar Club (вместо 50)</li>
              <li>• <span className="text-green-300">Детёныши монстров:</span> продажа Элиз</li>
              <li>• <span className="text-green-300">Проституция:</span> крайний случай, но работает</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-200 mb-2">🏦 Хранение и обмен</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-blue-300">Маани (Трёхсторонняя биржа):</span> бесплатное хранение, лучший обмен</li>
              <li>• <span className="text-blue-300">Рабочая лошадь:</span> живой сундук, переносит предметы</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Slavery */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 text-purple-300">⛓️ Рабство</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Как попасть в рабство</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• STA достигает -100</li>
              <li>• Сдаться в бою</li>
              <li>• Быть захваченным</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Сложность рабства</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-green-300">Легко:</span> Рабство Вудсона (дверь открыта ночью)</li>
              <li>• <span className="text-green-300">Легко:</span> Рабство гоблинов (зависит)</li>
              <li>• <span className="text-yellow-300">Средне:</span> Рабство людей, рабство глубоководных</li>
              <li>• <span className="text-red-300">Сложно:</span> Рабство рыболюдей (морят голодом), рабство святых</li>
              <li>• <span className="text-red-300">Невозможно:</span> Рабство плоти (если попасть в улей к востоку от крепости рока)</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Как выжить и сбежать</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Делайте всё, что они хотят — не получайте дополнительные повреждения</li>
              <li>• Ждите момента, когда вас покормят</li>
              <li>• Копите еду и сперму для восстановления STA</li>
              <li>• Можно сбежать — тактика зависит от типа рабства</li>
              <li>• Рабство даёт много XP (постоянное изнасилование)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-gradient-to-br from-red-900/30 to-black rounded-lg p-6 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-4 text-red-300">🎮 Уровни сложности</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-300 mb-2">Easy / Normal</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Стандартная игра</li>
              <li>• Билет на корабль: 20 золотых</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-300 mb-2">Hard</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Усиленные враги</li>
              <li>• Билет на корабль: 25 золотых</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-orange-300 mb-2">Hell</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-red-300">Еда портится!</span> Сырая еда начинает гнить</li>
              <li>• <span className="text-red-300">Нельзя покинуть бой!</span> Используйте скрытность или оглушение</li>
              <li>• Билет на корабль: 28 золотых</li>
              <li>• Копчёное мясо всё ещё работает (на 80% эффективно)</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-300 mb-2">Doom</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-red-300">Сложность заблокирована навсегда</span> (даже после перерождения)</li>
              <li>• <span className="text-red-300">Смерть удаляет сохранение!</span></li>
              <li>• Билет на корабль: 30 золотых</li>
              <li>• Автосохранение каждые полдня</li>
              <li>• "Аутентичный" опыт LonaRPG — постоянный страх и осторожность</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 text-purple-200">💡 Полезные механики</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-yellow-300">CTRL:</span> ускорение диалогов</li>
          <li>• <span className="text-yellow-300">CTRL + SHIFT + ALT:</span> небольшое ускорение игры (полезно при ожидании)</li>
          <li>• <span className="text-yellow-300">Фонарь в EXT слоте:</span> даёт освещение (меньше, чем в руке, но лучше ничего)</li>
          <li>• <span className="text-yellow-300">SCU 5+:</span> достаточно для большинства квестов (с грязными тряпками можно получить 8 SCU)</li>
          <li>• <span className="text-yellow-300">Скрытность:</span> выбирайте "Спрятаться" перед боем, чтобы не быть окружённым</li>
        </ul>
      </div>
    </div>
  );
}

function SecretsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-300">🔮 Секреты и особенности</h2>

      {/* Easter Eggs */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-2xl font-bold mb-4 text-purple-300">🥚 Пасхалки</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Кролик Каэрбаннога</h4>
            <p className="text-sm text-gray-300">
              Отсылка к "Монти Пайтон". Очень опасный кролик, которого можно встретить в Крепости Рока.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Лошадиный член</h4>
            <p className="text-sm text-gray-300">
              Уникальное оружие, дающее +10 CON. Можно получить после победы над боссом в деревне Перранвей.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-200 mb-2">Статуя Лируои</h4>
            <p className="text-sm text-gray-300">
              Загадочная статуя с собственной квестовой линией. Связана с лором игры.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Areas */}
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold mb-4 text-blue-300">🗺️ Скрытые области</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-blue-200 mb-2">Лагерь наёмников (Dev area)</h4>
            <p className="text-sm text-gray-300">
              Тестовая область разработчика. Можно найти рядом с лагерем Южных ворот.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-blue-200 mb-2">Западный мост (Western bridgehead)</h4>
            <p className="text-sm text-gray-300">
              Помечена разработчиком как "незавершённая". Содержит ограниченный контент.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-blue-200 mb-2">Кристальная шахта</h4>
            <p className="text-sm text-gray-300">
              Один из шахтёров имеет диалог "dev" по неизвестной причине.
            </p>
          </div>
        </div>
      </div>

      {/* Unimplemented Content */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-500/30">
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">🚧 Нереализованный контент</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-200 mb-2">Отсутствующий контент</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Счастливый конец для острова Ноэр ещё не реализован</li>
              <li>• Замок Сибарис и заключение истории в основном не реализованы</li>
              <li>• Квестовая линия Сесили не имеет завершения</li>
              <li>• Босс Пронзатель роняет ключевой предмет "TODO"</li>
              <li>• Трио богов просто стоит вокруг хрустального шара после квестов</li>
              <li>• Квест мальчика в Облачной деревне, кажется, не имеет завершения</li>
              <li>• После победы над боссом "Лошадиный член" он просто покидает деревню Перранвей</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-200 mb-2">Проблемы</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Монастырь святых — правая область наполовину заблокирована</li>
              <li>• Квест Облачной деревни — варианты диалогов ребёнка неполные/не работают</li>
              <li>• Некоторые предметы имеют отсутствующие описания (Селитра, Менструальное лекарство)</li>
              <li>• При захвате некоторые уникальные анимации показывают неправильный цвет кожи после перерождения</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exploits */}
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
        <h3 className="text-2xl font-bold mb-4 text-red-300">⚡ Эксплойты и трюки</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Покупка предметов дёшево</h4>
            <p className="text-sm text-gray-300">
              Существует эксплойт для покупки предметов по заниженной цене. Подробности в гайдах сообщества.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Быстрый уровень</h4>
            <p className="text-sm text-gray-300">
              Легкий способ повышения уровня через определённые механики. См. раздел "Механики".
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-red-200 mb-2">Рыба — лучший заработок</h4>
            <p className="text-sm text-gray-300">
              Рыбалка — самый эффективный способ заработка денег в игре. Можно заработать 20 золотых за час!
            </p>
          </div>
        </div>
      </div>

      {/* Special Items */}
      <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
        <h3 className="text-2xl font-bold mb-4 text-green-300">✨ Уникальные предметы</h3>

        <div className="space-y-3">
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">Мартинский набор</h4>
            <p className="text-sm text-gray-300">
              Уникальный набор экипировки, получаемый через квестовую линию Коконы.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">Реликвии</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-purple-300">Реликвия возмездия:</span> снимает DEF/SUR врага</li>
              <li>• <span className="text-blue-300">Реликвия хранителя:</span> AoE лечение и барьеры союзников</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">Книги заклинаний</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <span className="text-red-300">Огненная книга:</span> AoE огненный шар</li>
              <li>• <span className="text-yellow-300">Электрическая книга:</span> призыв Тесла-катушки</li>
              <li>• <span className="text-cyan-300">Водная книга:</span> AoE урон вокруг Лоны</li>
            </ul>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold text-green-200 mb-2">Тотем аборигена</h4>
            <p className="text-sm text-gray-300">
              Призывает неограниченное количество щупалец для отвлечения врагов. Достаточно мощен, чтобы победить любого босса.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 text-purple-200">💡 Дополнительные секреты</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• <span className="text-yellow-300">Ограбление сундуков:</span> можно обокрасть сундуки в тюрьме арены, доме рабов или тюрьме церкви святых</li>
          <li>• <span className="text-yellow-300">Банковское хранилище:</span> сложнее ограбить, но возможно</li>
          <li>• <span className="text-yellow-300">Если потеряли ВСЁ:</span> идите на Центральный рынок Ноэра, разденьтесь, убедитесь что достаточно Weak и Dirt, затем зарабатывайте проституцией</li>
          <li>• <span className="text-yellow-300">Попрошайничество:</span> просите еду только у женщин — мужчины могут атаковать при неудаче</li>
          <li>• <span className="text-yellow-300">Режим Doom:</span> "аутентичный" опыт LonaRPG — постоянный страх и осторожность</li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-purple-500/20 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-3">LonaRPG Wiki</h3>
              <p className="text-sm text-gray-400">
                Полное руководство по игре LonaRPG. Все квесты, билды, предметы и секреты в одном месте.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-3">Ресурсы</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• <a href="https://eccma417.itch.io/lonarpg" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">Официальная страница игры</a></li>
                <li>• <a href="https://lonarpg.miraheze.org/wiki/LonaRPG_Wiki" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">LonaRPG Wiki (Miraheze)</a></li>
                <li>• <a href="https://steamcommunity.com/app/753" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">Steam Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-3">О проекте</h3>
              <p className="text-sm text-gray-400">
                Wiki создана на основе официальных источников, Miraheze Wiki и гайдов сообщества. 
                Информация актуальна для последних версий игры.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-purple-500/10 text-center text-sm text-gray-500">
            <p>LonaRPG © Eccma417. Wiki создана фанатами для фанатов.</p>
            <p className="mt-1">Версия игры: B.0.10.4.1+ | Обновлено: 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
