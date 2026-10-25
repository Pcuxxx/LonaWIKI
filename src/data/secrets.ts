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
      "В храме есть стена, которая стоит на клетку не там, где надо. За ней — комната, где в конце квестовой линии умирает рыболюд, и несколько «пепе». Достижение дают именно за них, а не за прохождение храма.",
    steps: [
      "Идите в Twin Peaks Temple по координатам X76 Y85.",
      "Внутри найдите нижнюю левую часть храма — ту самую комнату, где в финале квеста умирает рыболюд.",
      "Присмотритесь к стене: одна секция смещена относительно соседних. Подойдите вплотную и пройдите сквозь неё.",
      "Внутри взаимодействуйте со скрытыми «пепе» — достижение «A mirage» выдаётся сразу.",
    ],
    reward: "Достижение «A mirage» и подтверждение, что вы внимательнее половины игроков.",
    missable: true,
  },
  {
    id: "hive-heart",
    title: "Сердце улья: «This is for Sybaris...»",
    original: "This is for Sybaris...",
    category: "quest",
    place: "The Oriental Commerce (ночью) или логово аберраций",
    summary:
      "Достижение #24 дают не за красивый диалог, а за уничтожение сердца улья аберраций. Одно такое сердце можно найти в логове, второе — в The Oriental Commerce, если сначала убить Гадалку.",
    steps: [
      "Самый простой путь — прийти в The Oriental Commerce ночью, когда там уже есть Джастис и Морская Ведьма (их линии должны быть завершены).",
      "Спровоцируйте Гадалку: пусть она бросит в вас DoT-лужу, и подведите под неё Джастиса. Дальше три «бога» начнут выяснять отношения сами.",
      "Добейте Гадалку. После смерти она превратится в Hive Heart — огромный мешок HP, который не атакует напрямую, но призывает щупальца и коконы.",
      "Уничтожьте сердце. Достижение выдаётся в момент смерти Hive Heart; из сундука падает случайный high-quality лут.",
      "Если выйти из локации и зайти снова, сердце возрождается вместе с сундуком. Так его можно фармить, но не увлекайтесь: HP у него огромное.",
      "Если не хотите связываться с богами — идите в обычное логово аберраций и уничтожьте сердце там. Для достижения результат тот же.",
    ],
    reward:
      "Достижение «This is for Sybaris...», сундук с HQ-лутом и альтернативная концовка, если Гадалка мертва.",
    missable: true,
  },
  {
    id: "nameless-warrior",
    title: "Безымянный воин",
    original: "Nameless Warrior",
    category: "quest",
    place: "Квест «Search the Forest», South Gate Camp",
    summary:
      "Достижение #42 требует уничтожить инкубационный бассейн аберраций до того, как Джастис вмешается. Это не просто «победить в бою» — нужно выжить 30 секунд и разломать бассейн своими руками.",
    steps: [
      "Возьмите квест Search the Forest у сержанта в South Gate Camp после отражения атаки аберраций.",
      "Дойдите до бассейна в лесу и войдите внутрь. Найдите солдата, который бьётся головой о стену; после катсцены начнётся таймер.",
      "Не ждите Джастиса. Уничтожьте бассейн самостоятельно: подойдите и атакуйте его, параллельно отбиваясь от личинок и быстрых аберраций.",
      "Если урон не успевает — берите огонь, AoE-магию или взрывчатку. Как только бассейн разрушен, достижение ваше. Диалог с сержантом тоже изменится.",
    ],
    reward: "Достижение «Nameless Warrior», 9000 XP за квест и доступ к Travel station.",
    missable: true,
  },
  {
    id: "prototype-bioweapon",
    title: "Прототип биологического оружия",
    original: "The Prototype Bioweapon",
    category: "adult",
    place: "Rebirth → The Oriental Commerce",
    summary:
      "Одна из самых скрытых рас в игре. Чтобы Лона переродилась аберрацией, недостаточно умереть: нужно сначала продать Элизе детёнышей аберраций, причём именно через «Sell Child», а не «Barter».",
    steps: [
      "Родите или добудьте детёнышей аберраций. Проще всего — от аберраций-самцов; детей можно держать в инвентаре.",
      "Продайте Элизе 2 детёнышей аберраций через «Sell Child» — откроется вариант Rebirth «Sick Human».",
      "Продайте 4 детёнышей — откроется «Unwell Mixed-Race». Не путайте с обычным бартером: при «Barter» прогресс не засчитается.",
      "Умрите или сбегите с острова, выберите соответствующий вариант в меню Rebirth. Признак успеха — состояние Sickly, красные глаза и бледная кожа.",
      "Чтобы получить расовые навыки, поговорите с Гадалкой в The Oriental Commerce и выберите последний вариант. Она даст Desecrate и Tendril Whip.",
    ],
    reward: "Раса аберрации, навыки Desecrate и Tendril Whip, достижение «The Prototype Bioweapon».",
    missable: true,
    adult: true,
  },
  {
    id: "metamorphosis",
    title: "Метаморфоза: истинный Deepone",
    original: "Metamorphosis",
    category: "adult",
    place: "Rebirth → Sea Witch",
    summary:
      "Deepone — не просто «синяя Лона». Чтобы получить истинную форму и достижение #72, нужно родить ребёнка от Deepone, переродиться и найти Морскую Ведьму после её спасения.",
    steps: [
      "Забеременейте от Deepone (рыболюда-самца). Ребёнок будет выглядеть как человеческий, но в меню Rebirth появится вариант «Smelly Human».",
      "Переродитесь Deepone. Признаки: запах тела и синие глаза. Это ещё не истинная форма.",
      "Спасите Морскую Ведьму в квесте Starving Mermaid и поговорите с ней после перерождения.",
      "Она откроет навык Awaken. Активируйте его: Лона станет истинным Deepone, получит Water Shot, Summon Siren, Semen Demon и Sea Witch's Gift. Достижение «Metamorphosis» выдаётся здесь.",
      "Учтите: в истинной форме Лона не может носить обычную броню и головные предметы — только реликвии, шали и вещи с требованием Prostitute. Возврат в человека даёт Sick и Gastroenteritis по 3 стака.",
    ],
    reward: "Истинный Deepone, уникальные навыки, достижение «Metamorphosis».",
    missable: true,
    adult: true,
  },
  {
    id: "snowflake",
    title: "Разбитая снежинка",
    original: "Sh-ACK-ttered snowflake",
    category: "location",
    place: "Evil Wyvern toy store, X27 Y98",
    summary:
      "Магазин игрушек, где ничего нельзя купить. Внутри живёт «особенная снежинка» — и если сказать ему правду, а потом унизить труп, дадут достижение и откроют подвал.",
    steps: [
      "Придите в Evil Wyvern toy store на X27 Y98. Днём хозяин сидит за стойкой, ночью — в восточной комнате. Ночью постучите в дверь 4 раза, чтобы его вызвать.",
      "Поговорите с хозяином и Снежинкой. Выберите вариант «...» и доведите разговор до того, что хозяин обидится: вас ударят (с шансом на Injured) и выставят за дверь.",
      "Вернитесь внутрь. На месте Снежинки будет труп. Взаимодействуйте с ним и унизьте останки — достижение «Sh-ACK-ttered snowflake» выдаётся сразу.",
      "После этого дверь в подвал на западной стороне открыта. Если хотите посмотреть, что там, — сохранитесь: при нулевой STA или сне в подвале Лону могут взять в плен.",
    ],
    reward: "Достижение «Sh-ACK-ttered snowflake», доступ в подвал магазина.",
    missable: true,
    adult: true,
  },
  {
    id: "goblin-castrator",
    title: "Гоблин-кастратор",
    original: "Goblin Castrator",
    category: "adult",
    place: "Refugee Camp near Saint's Monastery, X35 Y79",
    summary:
      "Самый чёрный мини-игровой секрет. В лагере беженцев у монастыря держат двух пленных гоблинов; за 200 TP охотник даст «поиграть» с ними.",
    steps: [
      "Дойдите до Refugee Camp east of Saint's Monastery на X35 Y79.",
      "На восточной стороне лагеря найдите охотника рядом с двумя связанными гоблинами. Заплатите ему минимум 200 TP.",
      "Взаимодействуйте с гоблином. Управление: влево/вправо — сменить направление, A — пнуть, X — выйти.",
      "Доведите мини-игру до конца, чтобы «проявить человечность» и лишить гоблина возможности размножаться. Достижение «Goblin Castrator» выдаётся после этого. Повторно платить не нужно, пока вы не вышли с карты.",
    ],
    reward: "Достижение «Goblin Castrator», 200 TP за вход (один раз за визит).",
    missable: true,
    adult: true,
  },
  {
    id: "tomb-dark-berserker",
    title: "Гробница Тёмного Берсеркера",
    original: "Tomb of the Dark Berserker",
    category: "location",
    place: "X69 Y74, к северо-западу от Pirate's Bane",
    summary:
      "Скрытая гробница в горах, где лежит меч False God Slayer. Можно вырезать всех, включая Берсеркера, а можно уйти по-тихому — если с вами Коко-на.",
    steps: [
      "Идите на X69 Y74, к северо-западу от Pirate's Bane. Вход в гробницу спрятан в горах.",
      "Внутри есть два пути. Первый: убить всех скелетов и самого Берсеркера. Он бьёт как The Beast, поэтому держите дистанцию и ломайте ему STA, а не HP.",
      "Второй: если в отряде есть Коко-на, найдите «хорошего друга» и поговорите с ним — она поможет уйти из катакомб без боя.",
      "Награда: False God Slayer и 5000 XP. Если убили Берсеркера — 15000 XP и достижение #54 «Master of the sword».",
    ],
    reward: "False God Slayer, 5000 XP (15000 с убитым Берсеркером), достижение «Master of the sword».",
    missable: true,
  },
  {
    id: "nuke-ending",
    title: "Ядерная погибель",
    original: "Nuke Doom",
    category: "ending",
    place: "The Oriental Commerce → корабль Эдварда",
    summary:
      "Обычная концовка рассказывает, что стало с Ноэром. Секретная — что от Ноэра осталось. Для неё нужно убить Гадалку до того, как вы подниметесь на корабль.",
    steps: [
      "Пройдите квест Гадалки и получите доступ к её комнате в The Oriental Commerce (или убейте её в Doom Fort Refugee Camp, если встретили там).",
      "Убейте Гадалку. После первой формы появится Hive Heart — добейте его и заберите лут из сундука.",
      "Не воскрешайте её и не загружайте более ранний сейв. Соберите 20–30 Gold Coins и заплатите Эдварду в Port of Noer.",
      "Поднимитесь на корабль и отдохните на кровати. Вместо обычного рассказа о судьбе острова вы увидите альтернативную сцену: Ноэр уничтожает существо, которое называют только «Он».",
    ],
    reward: "Концовка Nuke Doom, уникальный финальный текст и достижение «Goodbye, cruel world.» (за сам побег).",
    missable: true,
  },
  {
    id: "secret-formula",
    title: "Секретная формула",
    original: "The Secret Formula",
    category: "quest",
    place: "Broken Shell Beach, X113 Y127 → Crusty Crab's Pot Shop",
    summary:
      "Скрытый квест-отсылка к SpongeBob. На пляже рыболюд просит вернуть формулу из «пот-шопа» его брата. Можно взять формулу и уйти, а можно зачистить дом и получить больше опыта.",
    steps: [
      "Придите на Broken Shell Beach на X113 Y127 и посмотрите катсцену.",
      "Поговорите с рыболюдом три раза, каждый раз выбирая последний доступный вариант. Не будьте слишком слабы — иначе разговор закончится не в вашу пользу.",
      "Согласитесь на квест и идите в Crusty Crab's Pot Shop. Внутри будут три рыболюдки-охранницы; у Succubus-билдов с ними проблемы — Juice, огонь и Relic of Retribution здесь не работают.",
      "Зачистите дом и заберите Secret Formula, затем верните её брату. Если просто взять формулу и уйти, вы потеряете ~3500 XP и часть награды.",
      "Награда: 4000 XP за быстрый вариант или 11500 XP за полное прохождение. Название и персонажи — прямая отсылка к «Спанч Бобу».",
    ],
    reward: "4000 или 11500 XP, предмет Secret Formula, пасхалка.",
    missable: true,
  },
  {
    id: "cocona-parents",
    title: "Похороны родителей Коко-ны",
    original: "Cocona's parents",
    category: "quest",
    place: "Catacombs → кладбище Ноэра",
    summary:
      "В катакомбах можно найти головы родителей Коко-ны. Если не выбросить их и не продать, а принести на кладбище, появится тихая сцена, которую большинство игроков не видит.",
    steps: [
      "Во время квеста A Strange source of energy from the Cemetery исследуйте катакомбы и заберите головы родителей Коко-ны (они лежат в разных частях подземелья).",
      "Не продавайте и не выбрасывайте их. После того как Коко-на поселится в The Burning Keg, принесите головы на кладбище Ноэра.",
      "Найдите пустую могилу и взаимодействуйте с ней. Лона и Коко-на похоронят родителей.",
      "Сцена меняет отношение Коко-ны и добавляет ей реплики. На механику компаньона не влияет, но это одна из самых человечных сцен в игре.",
    ],
    reward: "Уникальная сцена, дополнительные диалоги Коко-ны, лор.",
    missable: true,
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
