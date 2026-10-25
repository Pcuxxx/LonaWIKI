export type SecretCategory =
  | "location"
  | "quest"
  | "easter"
  | "adult"
  | "ending"
  | "cut";

export interface Secret {
  id: string;
  title: string;
  original?: string;
  category: SecretCategory;
  place: string;
  summary: string;
  steps: string[];
  reward: string;
  missable?: boolean;
  adult?: boolean;
  version?: string;
}

export interface Painting {
  id: string;
  achievement: string;
  title: string;
  place: string;
  coords?: string;
  note: string;
}

export interface CutContent {
  id: string;
  name: string;
  ru: string;
  type: "item" | "trait" | "mechanic" | "npc" | "debug";
  status: "removed" | "unused" | "future" | "debug";
  description: string;
}

export interface EasterEgg {
  id: string;
  name: string;
  reference: string;
  place: string;
  note: string;
}

export const secrets: Secret[] = [
  {
    id: "twin-peaks-mirage",
    title: "Мираж в храме Двух Вершин",
    original: "A mirage",
    category: "location",
    place: "Twin Peaks Temple, X76 Y85",
    summary:
      "В храме есть смещённая стена, за которой прячется скрытая комната с «пепе». Без внимательности её легко принять за обычный тупик.",
    steps: [
      "Дойдите до Twin Peaks Temple по координатам X76 Y85.",
      "В левом нижнем углу храма найдите стену, которая стоит на клетку не там, где остальные.",
      "Подойдите вплотную и нажмите клавишу взаимодействия, чтобы открыть проход.",
      "Заберите содержимое тайника. Достижение «A mirage» выдаётся при взаимодействии с секретом.",
    ],
    reward: "Достижение «A mirage», скрытый лут и опыт исследования.",
    missable: true,
  },
  {
    id: "cemetery-energy",
    title: "Странная энергия на кладбище",
    original: "Unknown energy in Cemetery",
    category: "quest",
    place: "Кладбище Ноэра → катакомбы",
    summary:
      "Источник некротической энергии под кладбищем выводит на Коко-ну — одну из самых сильных компаньонов игры. Квест легко пропустить, если не заглядывать в склеп.",
    steps: [
      "Завершите повторяемый заказ на скелетов, чтобы открыть доступ к источнику.",
      "Войдите в склеп на кладбище и исследуйте катакомбы.",
      "Найдите Коко-ну, поговорите с ней и проводите в The Burning Keg.",
      "Выполните первую часть её линии, чтобы она стала компаньоном.",
    ],
    reward: "Компаньон Коко-на, некромантия, доступ к уникальным диалогам и корабельной концовке.",
    missable: true,
  },
  {
    id: "three-gods",
    title: "Три бога в одной комнате",
    original: "This is for Sybaris...",
    category: "quest",
    place: "The Oriental Commerce, Ноэр",
    summary:
      "Самый неочевидный секретный триггер: нужно стравить Гадалку, Джастиса и Морскую Ведьму в одном помещении. Событие связано с памятью о Сибарисе.",
    steps: [
      "Познакомьтесь с Гадалкой в The Oriental Commerce, Джастисом и Морской Ведьмой.",
      "Выполните их линии до состояния, когда все трое могут находиться в салоне.",
      "Спровоцируйте конфликт в задней комнате, не убивая участников раньше времени.",
      "Дождитесь катсцены. Достижение выдаётся только при правильной последовательности.",
    ],
    reward: "Достижение «This is for Sybaris...», уникальная сцена и лор.",
    missable: true,
  },
  {
    id: "fake-id",
    title: "Фальшивое удостоверение",
    original: "Fake ID Paper",
    category: "location",
    place: "Noer Backstreets",
    summary:
      "Документ сбрасывает Morality до 50, даже если вы успели перебить половину города. Покупается в переулках Ноэра и полностью снимает статус преступницы.",
    steps: [
      "Найдите торговца в Noer Backstreets (переулки за центральной улицей).",
      "Купите Fake ID Paper. Цена зависит от текущей репутации и торговли.",
      "Используйте документ в инвентаре. Morality станет 50.",
      "Помните: стража может помнить конкретные преступления, даже если цифра репутации исправлена.",
    ],
    reward: "Сброс Morality до 50, снятие враждебности города.",
  },
  {
    id: "bank-vault",
    title: "Ограбление банковского хранилища",
    original: "Tripartite Exchange vault",
    category: "location",
    place: "Tripartite Exchange, Ноэр",
    summary:
      "Хранилище можно вскрыть, но это одно из самых рискованных предприятий Ноэра: охрана, сигнализация и потеря репутации. Зато добыча бывает огромной.",
    steps: [
      "Подготовьте высокий SCU, отмычки/инструменты и план отхода.",
      "Ночью проникните в служебную часть банка, не попадаясь охране.",
      "Вскройте хранилище. Если сигнализация сработает, уходите через заранее проверенный путь.",
      "Не тратьте добычу на месте: часть ценностей лучше сразу оставить в банке.",
    ],
    reward: "Крупная сумма TP, редкие предметы, достижение за капитал (косвенно).",
    missable: false,
  },
  {
    id: "prison-chests",
    title: "Сундуки тюрем и арены",
    original: "Prison chests",
    category: "location",
    place: "Тюрьма Ноэра, арена, дом работорговцев, церковь",
    summary:
      "Несколько сундуков стоят в местах, куда Лона обычно попадает не по своей воле. Если вы оказались в тюрьме — не спешите бежать: сначала обнесите камеры и подсобки.",
    steps: [
      "В тюрьме Ноэра проверьте камеры, кладовую и комнату охраны.",
      "На арене загляните в подсобку за ресепшн и в блок заключённых.",
      "В доме работорговцев обыщите сундуки до того, как поднимать тревогу.",
      "В церковной тюрьме ищите сундук за алтарём и в боковых комнатах.",
    ],
    reward: "Деньги, броня, оружие, еда и редкие расходники.",
  },
  {
    id: "snowflake",
    title: "Разбитая снежинка",
    original: "Sh-ACK-ttered snowflake",
    category: "easter",
    place: "Магазин игрушек «Злой Виверны», X27 Y98",
    summary:
      "Снежинка — говорящий снеговик/игрушка с трагической историей. Ему можно сказать правду и затем унизить его тело, получив скрытое достижение.",
    steps: [
      "Придите в магазин игрушек «Злой Виверны» на X27 Y98.",
      "Поговорите со Снежинкой и выберите самый жестокий правдивый ответ.",
      "После его смерти взаимодействуйте с телом, чтобы «унизить» останки.",
      "Достижение «Sh-ACK-ttered snowflake» выдаётся сразу.",
    ],
    reward: "Достижение «Sh-ACK-ttered snowflake», уникальные реплики.",
    missable: true,
  },
  {
    id: "goblin-castrator",
    title: "Гоблин-кастратор",
    original: "Goblin Castrator",
    category: "easter",
    place: "Лагерь беженцев у монастыря, X35 Y79",
    summary:
      "Мини-игра с пленным гоблином, где можно проявить «человечность» и лишить его возможности размножаться. Один из самых чёрных секретов игры.",
    steps: [
      "Дойдите до лагеря беженцев у монастыря на X35 Y79.",
      "Найдите мини-игру/сцену с пленным гоблином.",
      "Выберите вариант «проявить человечность» и доведите сцену до конца.",
      "Достижение «Goblin Castrator» выдаётся после завершения.",
    ],
    reward: "Достижение «Goblin Castrator», реплики NPC.",
    missable: true,
    adult: true,
  },
  {
    id: "david-born",
    title: "Дэвид Борн в лагере бандитов",
    original: "David Born",
    category: "easter",
    place: "Лагерь бандитов к северо-востоку от Ноэра",
    summary:
      "Отсылка к The Elder Scrolls: при приближении к персонажу начинает играть узнаваемая музыка. Сам Дэвид — рядовой бандит с именем и диалогом.",
    steps: [
      "Выйдите из Ноэра и идите на северо-восток к лагерю бандитов.",
      "Найдите Дэвида Борна среди палаток.",
      "Подойдите, чтобы услышать музыкальную отсылку и реплики.",
    ],
    reward: "Пасхалка, немного лута и лор.",
  },
  {
    id: "burning-keg-npcs",
    title: "Оркин-слейер и огненная магичка",
    original: "Orkind Slayer & Fire Magician",
    category: "easter",
    place: "The Burning Keg, второй этаж",
    summary:
      "Два NPC на втором этаже таверны — прямые отсылки к Goblin Slayer/Doom Slayer и Megumin из Konosuba. У магички есть чёрная кошка Комусукэ.",
    steps: [
      "Поднимитесь на второй этаж The Burning Keg.",
      "Поговорите с Оркин-слейером: его броня и шлем отсылают к Doom Slayer, а поведение — к Goblin Slayer.",
      "Найдите огненную магичку и её кошку. Диалоги меняются после определённых квестов.",
    ],
    reward: "Пасхалки, диалоги, атмосфера.",
  },
  {
    id: "leeruoi",
    title: "Статуя Лируоя",
    original: "Statue of Leeruoi",
    category: "easter",
    place: "Остров, локации с статуями",
    summary:
      "Статуя с именем, которое звучит как «Leeroy» — отсылка к Лирою Дженкинсу из World of Warcraft. Взаимодействие даёт шутливую реплику.",
    steps: [
      "Найдите статую Лируоя в одной из локаций острова.",
      "Взаимодействуйте с ней и прочитайте табличку.",
      "Запомните шутку для достижения «Bad tourist» — оно связано с другой табличкой.",
    ],
    reward: "Пасхалка и лор.",
  },
  {
    id: "pepesmug",
    title: "PepeSmug на финальных клетках",
    original: "PepeSmug",
    category: "ending",
    place: "Финальные тайлы после побега",
    summary:
      "После отплытия с острова на финальных клетках появляется эмоут PepeSmug. Это одна из самых неожиданных отсылок в игре.",
    steps: [
      "Соберите 20–30 GC и уплывите с Эдвардом.",
      "Дойдите до финальных клеток после катсцены.",
      "Осмотрите окружение: PepeSmug появляется как пасхалка.",
    ],
    reward: "Пасхалка, финальная сцена.",
    missable: true,
  },
  {
    id: "nameless-warrior",
    title: "Уничтожить инкубатор без Джастиса",
    original: "Nameless Warrior",
    category: "quest",
    place: "Квест «Обыскать лес»",
    summary:
      "Скрытое достижение требует уничтожить инкубационный бассейн аберраций самостоятельно, не полагаясь на Джастиса. Это проверка билда и знания локации.",
    steps: [
      "Начните квест «Обыскать лес» и дойдите до гнезда с инкубатором.",
      "Откажитесь от помощи Джастиса или не дайте ему добить бассейн.",
      "Уничтожьте инкубатор своими силами (огонь, ловушки, магия).",
      "Достижение выдаётся после разрушения бассейна.",
    ],
    reward: "Достижение «Nameless Warrior», лут гнезда.",
    missable: true,
  },
  {
    id: "nuke-ending",
    title: "Ядерная погибель",
    original: "Nuke Doom",
    category: "ending",
    place: "The Oriental Commerce → корабль",
    summary:
      "Секретная концовка: убейте Гадалку до отплытия. Вместо рассказа о судьбе Ноэра город уничтожает существо по имени «Он».",
    steps: [
      "Прокачайтесь до уровня, достаточного для боя с Гадалкой.",
      "В The Oriental Commerce спровоцируйте и убейте её первую форму.",
      "Победите Hive Heart и заберите лут из сундука.",
      "Соберите 20–30 GC и уплывите с Эдвардом, не воскрешая Гадалку.",
    ],
    reward: "Концовка «Nuke Doom», уникальный текст и атмосфера.",
    missable: true,
    adult: false,
  },
  {
    id: "milk-economy",
    title: "Молочная экономика",
    original: "Breast milk trade",
    category: "adult",
    place: "The Golden Bar Club",
    summary:
      "Молоко можно сцеживать через Basic Needs и продавать в Golden Bar Club по 150 TP за штуку — втрое дороже обычной цены. Из него также варят сыр.",
    steps: [
      "Получите состояние Lactation (беременность, моды или события).",
      "Используйте Basic Needs → сцедить молоко.",
      "Отнесите молоко в The Golden Bar Club и выберите «Sell Breast Milk», а не обычный барter.",
      "Излишки перерабатывайте в сыр через Dark Cauldron — он не портится.",
    ],
    reward: "Стабильный доход, непортящаяся еда, достижения.",
    adult: true,
  },
  {
    id: "baby-trade",
    title: "Продажа детёнышей монстров",
    original: "Sell Baby",
    category: "adult",
    place: "Клиника Элизы",
    summary:
      "Детёнышей оркиндов, рыболюдов и аберраций можно оглушить и забрать с собой, а затем продать Элизе. Это один из самых прибыльных, но морально спорных заработков.",
    steps: [
      "Оглушите детёныша, не убивая его. Удобно использовать Idol of the Believer (не наносит урон).",
      "Вне боя подберите ребёнка в инвентарь.",
      "Кормите его молоком каждые полдня, иначе он погибнет.",
      "Поговорите с Элизой и выберите «Sell Baby», а не обычный обмен.",
    ],
    reward: "Крупная сумма TP, достижения, шанс на Rebirth для гуманоидных детей.",
    adult: true,
    missable: true,
  },
  {
    id: "monastery-wall",
    title: "Скрытая комната монастыря",
    original: "Monastery hidden room",
    category: "location",
    place: "Монастырь, северо-западная комната",
    summary:
      "В дальней северо-западной комнате монастыря есть проход в темноте, который открывается только взаимодействием. Внутри — тайник и лор.",
    steps: [
      "Пройдите в дальнюю северо-западную комнату монастыря.",
      "Встаньте лицом к тёмному участку стены.",
      "Нажмите клавишу взаимодействия, чтобы открыть скрытый проход.",
      "Заберите содержимое и проверьте соседние комнаты.",
    ],
    reward: "Скрытый лут, лор, возможные квестовые предметы.",
    missable: true,
  },
  {
    id: "free-cocona",
    title: "Похороны родителей Коко-ны",
    original: "Cocona's parents",
    category: "quest",
    place: "Катакомбы под кладбищем",
    summary:
      "В катакомбах можно найти обе головы родителей Коко-ны и устроить им похороны. Это меняет её диалоги и добавляет эмоциональную сцену.",
    steps: [
      "Исследуйте катакомбы после знакомства с Коко-ной.",
      "Найдите обе головы её родителей в разных частях подземелья.",
      "Принесите их Коко-не и выберите похороны.",
      "Дождитесь сцены. Не продавайте головы и не выбрасывайте их.",
    ],
    reward: "Уникальная сцена, рост доверия Коко-ны, лор.",
    missable: true,
  },
  {
    id: "doom-sergeant",
    title: "Сержант из «Цельнометаллической оболочки»",
    original: "Doom Fortress Sergeant",
    category: "easter",
    place: "Doom Fortress",
    summary:
      "Сержант в крепости повторяет внешность и манеру речи сержанта Хартмана из фильма Full Metal Jacket. Диалоги — почти цитаты.",
    steps: [
      "Дойдите до Doom Fortress и найдите сержанта.",
      "Поговорите с ним, выслушайте нотацию.",
      "Сравните реплики с фильмом — это одна из самых точных отсылок в игре.",
    ],
    reward: "Пасхалка, доступ к заданиям крепости.",
  },
];

export const paintings: Painting[] = [
  {
    id: "all-buy",
    achievement: "All buy!",
    title: "All buy!",
    place: "Tripartite Exchange",
    coords: "X37 Y100",
    note: "Картина в банке. Взаимодействуйте с ней, чтобы получить достижение.",
  },
  {
    id: "best-year",
    achievement: "THE BEST YEAR: 2020!",
    title: "THE BEST YEAR: 2020!",
    place: "The Golden Bar Club",
    note: "Картина в клубе. Одна из самых заметных отсылок к пандемии.",
  },
  {
    id: "thinking-man",
    achievement: "The :thinking: man",
    title: "The :thinking: man",
    place: "Pirate's Bane",
    note: "Картина в таверне пиратов.",
  },
  {
    id: "this-is-fine",
    achievement: "This is fine...",
    title: "This is fine...",
    place: "Doom Fortress, таверна",
    note: "В левом верхнем углу главного зала. Отсылка к мему «This is fine».",
  },
  {
    id: "alpha-beta",
    achievement: "The Alpha and the Beta",
    title: "The Alpha and the Beta",
    place: "The Oriental Commerce, задняя комната",
    note: "На задней стене. Шутка про «альфу и бету» и оружие.",
  },
  {
    id: "bad-tourist",
    achievement: "Bad tourist",
    title: "Bad tourist",
    place: "Площадь перед Ring of Noer",
    note: "Не картина, а табличка. Взаимодействуйте с ней.",
  },
  {
    id: "god-emperor",
    achievement: "God Emperor of the Stars",
    title: "God Emperor of the Stars",
    place: "Coastal Fortress, подвал",
    note: "Картина в подвале таверны.",
  },
  {
    id: "sea-witch",
    achievement: "Sea Witch",
    title: "Sea Witch",
    place: "Fishtopia Market",
    note: "Картина в таверне рыболюдов.",
  },
  {
    id: "censored",
    achievement: "*CENSORED*",
    title: "*CENSORED*",
    place: "Ring of Noer, за стойкой",
    note: "Картина за ресепшн арены.",
  },
  {
    id: "painting-year",
    achievement: "Painting of the Year",
    title: "Painting of the Year",
    place: "Дом семьи Вудсон",
    note: "Картина в жилом доме. Не пропустите при выполнении квестов семьи.",
  },
  {
    id: "paint-it",
    achievement: "Paint it, *CENSORED*",
    title: "Paint it, *CENSORED*",
    place: "Armory near Doom Fortress, 2-й этаж",
    note: "Картина на втором этаже оружейной.",
  },
  {
    id: "virus-chairmonster",
    achievement: "Virus Chairmonster",
    title: "Virus Chairmonster",
    place: "Логово банды Broadblade",
    note: "Картина в логове бандитов.",
  },
  {
    id: "doomguy",
    achievement: "—",
    title: "Портрет Doomguy",
    place: "The Oriental Commerce, левая комната",
    note: "Не achievement, но пасхалка: классический Doomguy из Doom Eternal.",
  },
];

export const cutContent: CutContent[] = [
  {
    id: "family-locket",
    name: "Family Locket",
    ru: "Семейный медальон",
    type: "item",
    status: "future",
    description:
      "Золочёный медальон с портретом приёмных родителей Лоны. По данным вики, повышает минимальный Mood. В текущих сборках недоступен — помечен как будущий контент. В базе предметов оставлен как квестовый/вырезанный.",
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    ru: "Солнечные очки",
    type: "item",
    status: "debug",
    description:
      "Шуточный предмет с +300 HP, +200 STA и +200 Mood. Получается только через читы/отладку, в обычной игре не встречается.",
  },
  {
    id: "great-helms",
    name: "Great Helms",
    ru: "Большие шлемы",
    type: "item",
    status: "unused",
    description:
      "Набор неиспользуемых шлемов, оставшихся в файлах игры. Не имеют полноценных статов и не выпадают.",
  },
  {
    id: "alchemy",
    name: "Alchemy",
    ru: "Алхимия",
    type: "trait",
    status: "removed",
    description:
      "Черта, дававшая навык Dark Cauldron и позволявшая смешивать ингредиенты. Удалена в v0.6.7.0; теперь Dark Cauldron доступен с начала игры, а кулинария переработана.",
  },
  {
    id: "item2mh",
    name: "Item2MhTester*****",
    ru: "Тестовый предмет Mh",
    type: "debug",
    status: "debug",
    description:
      "Отладочный предмет с звёздочками в имени. Использовался разработчиком для тестов; в обычном луте не появляется.",
  },
  {
    id: "player-orc-child",
    name: "PlayerOrcChild***",
    ru: "Ребёнок оркинда (игрок)",
    type: "npc",
    status: "unused",
    description:
      "Неиспользуемый ребёнок оркинда, привязанный к системе беременности игрока. В текущей версии потомство оркиндов реализовано иначе.",
  },
  {
    id: "player-ogre-child",
    name: "PlayerOgreChild***",
    ru: "Ребёнок огра (игрок)",
    type: "npc",
    status: "unused",
    description:
      "Аналогичный неиспользуемый ребёнок огра. Указывает на вырезанную ветку размножения с ограми.",
  },
  {
    id: "key-stars",
    name: "Key*******",
    ru: "Ключ (отладочный)",
    type: "item",
    status: "debug",
    description:
      "Универсальный отладочный ключ. Не выдаётся в нормальном прохождении; используется для тестирования дверей.",
  },
  {
    id: "scroll-fog",
    name: "ScrollFog*****",
    ru: "Свиток тумана",
    type: "item",
    status: "unused",
    description:
      "Свиток с эффектом тумана, оставшийся в файлах. Предположительно должен был скрывать Лону или местность.",
  },
  {
    id: "scroll-light",
    name: "ScrollLight****",
    ru: "Свиток света",
    type: "item",
    status: "unused",
    description:
      "Свиток освещения. Не используется, поскольку фонарь и факелы закрывают ту же роль.",
  },
  {
    id: "asdasd",
    name: "asdasd",
    ru: "asdasd",
    type: "debug",
    status: "debug",
    description:
      "Классический отладочный идентификатор, случайно набранный на клавиатуре. Встречается в файлах предметов/событий.",
  },
  {
    id: "feast",
    name: "Feast****",
    ru: "Пир",
    type: "item",
    status: "unused",
    description:
      "Праздничная еда, повышающая Mood. В обычных магазинах не продаётся; иногда упоминается в старых гайдах. В текущей сборке недоступна.",
  },
  {
    id: "old-cooking",
    name: "Old cooking system",
    ru: "Старая система готовки",
    type: "mechanic",
    status: "removed",
    description:
      "До v0.6.7.0 готовка требовала черту Alchemy и рецепты. После переработки Dark Cauldron стал базовым навыком, а рецепты упростились.",
  },
];

export const easterEggs: EasterEgg[] = [
  {
    id: "silver-cudgel",
    name: "Silver Cudgel",
    reference: "Johnny Silverhand, Cyberpunk 2077",
    place: "Награда за спасение Томми",
    note: "Ироничное оружие с крошечным уроном.",
  },
  {
    id: "secret-formula",
    name: "The Secret Formula",
    reference: "Формула крабсбургера, SpongeBob",
    place: "Квест «Секретная формула»",
    note: "Название и подача — прямая отсылка.",
  },
  {
    id: "leeroy",
    name: "Statue of Leeruoi",
    reference: "Leeroy Jenkins, World of Warcraft",
    place: "Статуи на острове",
    note: "Имя искажено, но узнаваемо.",
  },
  {
    id: "pepe",
    name: "PepeSmug",
    reference: "Twitch-эмоут PepeSmug",
    place: "Финальные клетки после побега",
    note: "Появляется в конце игры.",
  },
  {
    id: "orkind-slayer",
    name: "Orkind Slayer",
    reference: "Goblin Slayer + Doom Slayer",
    place: "The Burning Keg, 2-й этаж",
    note: "Броня и шлем сочетают оба образа.",
  },
  {
    id: "fire-magician",
    name: "Fire Magician",
    reference: "Megumin, Konosuba",
    place: "The Burning Keg, 2-й этаж",
    note: "Рядом сидит чёрная кошка Комусукэ.",
  },
  {
    id: "david-born",
    name: "David Born",
    reference: "The Elder Scrolls",
    place: "Лагерь бандитов к северо-востоку от Ноэра",
    note: "При приближении играет узнаваемая музыка.",
  },
  {
    id: "dark-berserker",
    name: "Tomb of the Dark Berserker",
    reference: "Guts, Berserk",
    place: "Гробница Тёмного Берсерка",
    note: "Босс и меч False God Slayer отсылают к манге.",
  },
  {
    id: "iddqd",
    name: "IDDQD IDKFA",
    reference: "Читы Doom",
    place: "Способности Джастиса",
    note: "Невидимость и бесконечное оружие — те самые коды.",
  },
  {
    id: "aqua",
    name: "Hair dye: Aqua",
    reference: "Аква, Konosuba",
    place: "Центральный рынок Ноэра",
    note: "Цвет волос богини воды.",
  },
  {
    id: "this-is-fine",
    name: "This is fine...",
    reference: "Мем This is fine",
    place: "Doom Fortress",
    note: "Картина с собакой в горящей комнате.",
  },
  {
    id: "alpha-beta",
    name: "The Alpha and the Beta",
    reference: "Мем alpha vs beta",
    place: "The Oriental Commerce, задняя комната",
    note: "Шутка про билды с кинжалом и двуручем.",
  },
  {
    id: "full-metal-jacket",
    name: "Doom Fortress Sergeant",
    reference: "Сержант Хартман, Full Metal Jacket",
    place: "Doom Fortress",
    note: "Внешность и речь почти цитаты из фильма.",
  },
  {
    id: "doomguy-portrait",
    name: "Портрет Doomguy",
    reference: "Doom Eternal",
    place: "The Oriental Commerce, левая комната",
    note: "Классическая броня Прайториана.",
  },
];
