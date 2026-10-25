// Данные о предметах, оружии и броне

export interface Weapon {
  id: string;
  name: string;
  type: 'main-hand' | 'off-hand' | 'two-handed' | 'ext';
  class: 'common' | 'high-quality' | 'magical' | 'divine';
  damage: string;
  special: string;
  obtained: string;
  notes: string;
}

export interface Armor {
  id: string;
  name: string;
  slot: string;
  defense: string;
  special: string;
  obtained: string;
}

export interface Consumable {
  id: string;
  name: string;
  effect: string;
  obtained: string;
  price: string;
}

export const weapons: Weapon[] = [
  // Common Main Hand
  {
    id: 'short-sword',
    name: 'Короткий меч',
    type: 'main-hand',
    class: 'common',
    damage: 'Средний физический',
    special: 'Базовое оружие, легко получить',
    obtained: 'Сундук в стартовой зоне, покупка',
    notes: 'Хорош для начала игры, пока не получите Саблю'
  },
  {
    id: 'wooden-club',
    name: 'Деревянная дубина',
    type: 'main-hand',
    class: 'common',
    damage: 'Низкий физический',
    special: 'Можно создать тёмный котёл',
    obtained: 'Рубка деревьев (3 удара)',
    notes: 'Неэффективна в бою, но полезна для создания котла'
  },
  {
    id: 'sickle',
    name: 'Серп',
    type: 'main-hand',
    class: 'common',
    damage: 'Низкий физический',
    special: 'Сбор растений стоит 1 STA вместо 3',
    obtained: 'Покупка, находки',
    notes: 'ОБЯЗАТЕЛЕН для эффективного сбора еды'
  },
  {
    id: 'pickaxe',
    name: 'Кирка',
    type: 'main-hand',
    class: 'common',
    damage: 'Средний физический',
    special: 'Добыча руды',
    obtained: 'Покупка, находки',
    notes: 'Не используйте в бою если есть альтернатива'
  },
  {
    id: 'silver-cudgel',
    name: 'Серебряная булава',
    type: 'main-hand',
    class: 'common',
    damage: 'Средний физический',
    special: 'Эффективна против нежити',
    obtained: 'Редкая находка',
    notes: 'Хороша против нежити'
  },
  {
    id: 'horse-cock',
    name: 'Лошадиный член',
    type: 'main-hand',
    class: 'common',
    damage: 'Низкий',
    special: '+10 CON (Телосложение)',
    obtained: 'После победы над боссом в Перранвей',
    notes: 'Уникальный предмет, пасхалка'
  },
  {
    id: 'metal-harness',
    name: 'Металлическая упряжь',
    type: 'main-hand',
    class: 'common',
    damage: 'Средний физический',
    special: 'Можно использовать как ловушку',
    obtained: 'Покупка, находки',
    notes: 'Тяжёлая, может быть использована как ловушка'
  },
  {
    id: 'full-metal-harness',
    name: 'Полная металлическая упряжь',
    type: 'main-hand',
    class: 'common',
    damage: 'Высокий физический',
    special: 'Самая тяжёлая - максимальный урон как ловушка',
    obtained: 'Редкая находка',
    notes: 'Лучшая для использования как ловушка'
  },

  // High Quality Main Hand
  {
    id: 'whip',
    name: 'Кнут',
    type: 'main-hand',
    class: 'high-quality',
    damage: 'Урон по STA (AoE)',
    special: 'Эффективен против нежити, AoE',
    obtained: 'Покупка, находки',
    notes: 'ЛУЧШЕЕ оружие против скелетов! Урон по STA'
  },
  {
    id: 'saber',
    name: 'Сабля',
    type: 'main-hand',
    class: 'high-quality',
    damage: 'Высокий физический (игнорирует DEF)',
    special: 'Игнорирует DEF врага, +15 ATK',
    obtained: 'Покупка, находки',
    notes: 'ЛУЧШЕЕ оружие для воина. Игнорирует броню!'
  },
  {
    id: 'flail',
    name: 'Цеп',
    type: 'main-hand',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Эффективен против нежити',
    obtained: 'Покупка, находки',
    notes: 'Хорош против нежити'
  },

  // Magical Main Hand
  {
    id: 'vile-scepter',
    name: 'Нечестивый скипетр',
    type: 'main-hand',
    class: 'magical',
    damage: 'Магический',
    special: 'Тёмная магия',
    obtained: 'Редкая находка',
    notes: 'Тёмное магическое оружие'
  },
  {
    id: 'fire-staff',
    name: 'Посох огня',
    type: 'main-hand',
    class: 'magical',
    damage: 'ОГРОМНЫЙ магический (x3 множитель)',
    special: 'Огненный урон, отбрасывает',
    obtained: 'Покупка, находки',
    notes: 'САМЫЙ мощный магический урон. Может убить большинство врагов с одного удара!'
  },
  {
    id: 'water-staff',
    name: 'Посох воды',
    type: 'main-hand',
    class: 'magical',
    damage: 'Магический',
    special: 'Водный урон, одиночная цель',
    obtained: 'Покупка, находки',
    notes: 'Безопасен с союзниками, урон если враг на той же клетке'
  },
  {
    id: 'lightning-rod',
    name: 'Молниеотвод',
    type: 'main-hand',
    class: 'magical',
    damage: 'Магический (только HP)',
    special: 'Стан-лок, AoE, бьёт по толпе',
    obtained: 'Покупка, находки',
    notes: 'Отлично против толпы. Урон если Лона на воде!'
  },

  // Divine Main Hand
  {
    id: 'idol-believer',
    name: 'Идол верующего',
    type: 'main-hand',
    class: 'divine',
    damage: '0 (только стан)',
    special: 'AoE стан (9x9 минус углы), 0 урона',
    obtained: 'Редкая находка',
    notes: 'Идеален для похищения детёнышей монстров. Оглушает не нанося урона.'
  },

  // Off Hand
  {
    id: 'wooden-shield',
    name: 'Деревянный щит',
    type: 'off-hand',
    class: 'common',
    damage: 'Блок',
    special: 'Блокирует атаки (1 STA за блок)',
    obtained: 'Покупка, находки',
    notes: 'Хорош для начала игры'
  },
  {
    id: 'lantern',
    name: 'Фонарь',
    type: 'off-hand',
    class: 'common',
    damage: 'Поджог',
    special: 'Освещение, поджигает врагов',
    obtained: 'Стартовая зона, покупка',
    notes: 'ОБЯЗАТЕЛЕН! Поджог кроликов и крыс. Можно носить в EXT слоте.'
  },
  {
    id: 'bone-shield',
    name: 'Костяной щит',
    type: 'off-hand',
    class: 'common',
    damage: 'Блок',
    special: 'Выпадает с орков',
    obtained: 'Дроп с Орка-воина и босса Пронзателя',
    notes: 'Только с определённых врагов'
  },
  {
    id: 'enhanced-dagger',
    name: 'Усиленный кинжал',
    type: 'off-hand',
    class: 'high-quality',
    damage: 'Высокий крит урон',
    special: 'Огромный урон в спине',
    obtained: 'Покупка, находки',
    notes: 'ЛУЧШЕЕ оружие для скрытного стиля'
  },
  {
    id: 'throwing-kunai',
    name: 'Метательные кунаи',
    type: 'off-hand',
    class: 'high-quality',
    damage: 'Средний физический',
    special: 'Дальность 4, замедление',
    obtained: 'Покупка, находки',
    notes: 'Отлично для кайтинга и ловушек'
  },
  {
    id: 'iron-shield',
    name: 'Железный щит',
    type: 'off-hand',
    class: 'high-quality',
    damage: 'Блок',
    special: 'Улучшенный блок',
    obtained: 'Покупка, находки',
    notes: 'Поздняя игра'
  },

  // Magical Off Hand
  {
    id: 'abomination-totem',
    name: 'Тотем аборигена',
    type: 'off-hand',
    class: 'magical',
    damage: 'Призыв щупалец',
    special: 'Неограниченные призывы',
    obtained: 'Редкая находка',
    notes: 'Достаточно мощен чтобы победить любого босса!'
  },
  {
    id: 'fire-spell-book',
    name: 'Книга заклинаний огня',
    type: 'off-hand',
    class: 'magical',
    damage: 'AoE огненный урон',
    special: 'Огненный шар, стан',
    obtained: 'Покупка, находки',
    notes: 'AoE урон, может задеть Лону'
  },
  {
    id: 'electric-spell-book',
    name: 'Книга заклинаний электричества',
    type: 'off-hand',
    class: 'magical',
    damage: 'Электрический урон',
    special: 'Тесла-катушка, молнии',
    obtained: 'Покупка, находки',
    notes: 'Урон если Лона на воде'
  },
  {
    id: 'water-spell-book',
    name: 'Книга заклинаний воды',
    type: 'off-hand',
    class: 'magical',
    damage: 'AoE водный урон',
    special: 'AoE вокруг Лоны',
    obtained: 'Покупка, находки',
    notes: 'Хорош когда окружили'
  },
  {
    id: 'saints-artifact',
    name: 'Артефакт святых',
    type: 'off-hand',
    class: 'magical',
    damage: 'Священный урон',
    special: 'Эффективен против нежити',
    obtained: 'Монастырь святых',
    notes: 'Священное оружие'
  },

  // Divine Off Hand
  {
    id: 'relic-guardian',
    name: 'Реликвия хранителя',
    type: 'off-hand',
    class: 'divine',
    damage: 'Лечение/барьер',
    special: 'AoE лечение, барьеры союзников',
    obtained: 'Редкая находка',
    notes: 'Поддержка союзников'
  },
  {
    id: 'relic-retribution',
    name: 'Реликвия возмездия',
    type: 'off-hand',
    class: 'divine',
    damage: 'Снятие DEF/SUR',
    special: 'Временно снимает защиту врага',
    obtained: 'Редкая находка',
    notes: 'Сложно попасть, но очень эффективно'
  },

  // Two-Handed
  {
    id: 'wooden-spear',
    name: 'Деревянное копьё',
    type: 'two-handed',
    class: 'common',
    damage: 'Средний физический',
    special: 'Дальность 2',
    obtained: 'Покупка, находки',
    notes: 'Базовое копьё'
  },
  {
    id: 'restraint-pole',
    name: 'Сдерживающий шест',
    type: 'two-handed',
    class: 'common',
    damage: 'Урон по STA',
    special: 'Сдерживание врагов',
    obtained: 'Покупка, находки',
    notes: 'Эффективен против нежити'
  },
  {
    id: 'pitchfork',
    name: 'Вилы',
    type: 'two-handed',
    class: 'common',
    damage: 'Средний физический',
    special: 'Дальность 2',
    obtained: 'Стартовая зона',
    notes: 'Хороши для начала игры'
  },
  {
    id: 'musket',
    name: 'Мушкет',
    type: 'two-handed',
    class: 'common',
    damage: 'Высокий фиксированный',
    special: 'Масштабируется от WIS, мгновенное убийство кроликов',
    obtained: 'Покупка, квесты',
    notes: 'Эффективен против низкого SUR'
  },
  {
    id: 'longbow',
    name: 'Длинный лук',
    type: 'two-handed',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Снайпер, Дождь стрел',
    obtained: 'Покупка, находки',
    notes: 'Основное оружие лучника'
  },
  {
    id: 'halberd',
    name: 'Алебарда',
    type: 'two-handed',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Дальность 2, укол, AoE',
    obtained: 'Покупка, находки',
    notes: 'Можно получить через продажу ID и покупку поддельного'
  },
  {
    id: 'metal-spear',
    name: 'Металлическое копьё',
    type: 'two-handed',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Дальность 2',
    obtained: 'Покупка, находки',
    notes: 'Улучшенная версия деревянного копья'
  },
  {
    id: 'false-god-slayer',
    name: 'Лжебог-убийца',
    type: 'two-handed',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Быстрый спин (AoE), блок',
    obtained: 'Редкая находка',
    notes: 'Отлично против толпы, можно блокировать'
  },
  {
    id: 'shattered-katana',
    name: 'Расколотая катана',
    type: 'two-handed',
    class: 'high-quality',
    damage: 'Высокий физический',
    special: 'Блок, контратака (100% стан), широкий слэш',
    obtained: 'Редкая находка',
    notes: 'ЛУЧШАЯ для гладиатора. 1v1 мастер.'
  },

  // EXT (consumable weapons)
  {
    id: 'frag-mine',
    name: 'Осколочная мина',
    type: 'ext',
    class: 'common',
    damage: 'Огромный физический',
    special: 'Убивает большинство врагов',
    obtained: 'Покупка ночью (300 TP)',
    notes: 'ОДНА мина убивает большинство врагов!'
  },
  {
    id: 'frag-bomb',
    name: 'Осколочная бомба',
    type: 'ext',
    class: 'common',
    damage: 'Высокий физический',
    special: 'Ручная детонация',
    obtained: 'Покупка, находки',
    notes: 'Контролируемый взрыв'
  },
  {
    id: 'timed-frag-bomb',
    name: 'Осколочная бомба с таймером',
    type: 'ext',
    class: 'common',
    damage: 'Высокий физический',
    special: 'Автоматическая детонация',
    obtained: 'Покупка, находки',
    notes: 'Устанавливается и взрывается через время'
  },
  {
    id: 'throwing-knife',
    name: 'Метательный нож',
    type: 'ext',
    class: 'common',
    damage: 'Средний физический',
    special: 'Дальний бросок',
    obtained: 'Покупка, находки',
    notes: 'Расходное оружие'
  },
  {
    id: 'smoke-bomb',
    name: 'Дымовая бомба',
    type: 'ext',
    class: 'common',
    damage: '0',
    special: 'Создаёт дымовую завесу',
    obtained: 'Покупка, находки',
    notes: 'Для побега и скрытности'
  },
  {
    id: 'shock-bomb',
    name: 'Шоковая бомба',
    type: 'ext',
    class: 'common',
    damage: 'Низкий + стан',
    special: 'Оглушает врагов',
    obtained: 'Покупка, находки',
    notes: 'Стан толпы'
  },
  {
    id: 'shock-mine',
    name: 'Шоковая мина',
    type: 'ext',
    class: 'common',
    damage: 'Низкий + стан',
    special: 'Мина с оглушением',
    obtained: 'Покупка, находки',
    notes: 'Ловушка со станом'
  },
  {
    id: 'molotov-cocktail',
    name: 'Коктейль Молотова',
    type: 'ext',
    class: 'common',
    damage: 'Огненный AoE',
    special: 'Поджигает область',
    obtained: 'Покупка, находки',
    notes: 'Огненная ловушка'
  }
];

export const armors: Armor[] = [
  {
    id: 'civilian-pants',
    name: 'Гражданские штаны',
    slot: 'Ноги',
    defense: 'Низкая',
    special: '+ATK',
    obtained: 'Стартовый набор',
  },
  {
    id: 'messy-short-hair',
    name: 'Растрёпанные короткие волосы',
    slot: 'Голова',
    defense: '0',
    special: '-Weak, -Sexy, +Dirty (больше SCU)',
    obtained: 'Изменение причёски',
  },
  {
    id: 'leather-collar',
    name: 'Кожаный ошейник',
    slot: 'Аксессуар',
    defense: '-DEF',
    special: '+ATK, -Weak',
    obtained: 'Покупка, находки',
  }
];

export const consumables: Consumable[] = [
  {
    id: 'red-potion',
    name: 'Красное зелье',
    effect: 'Восстановление HP, снимает 2 раны',
    obtained: 'Элиз (дёшево), находки',
    price: 'Дёшево у Элиз'
  },
  {
    id: 'blue-potion',
    name: 'Синее зелье',
    effect: 'Восстановление STA',
    obtained: 'Элиз (дёшево), находки',
    price: 'Дёшево у Элиз'
  },
  {
    id: 'good-soup',
    name: 'Хороший суп',
    effect: 'Восстановление FOOD и SAT',
    obtained: 'Готовка (1 мясо + 1 растение)',
    price: 'Готовка'
  },
  {
    id: 'meat-soup',
    name: 'Мясной суп',
    effect: 'Восстановление FOOD и SAT',
    obtained: 'Готовка (мясо)',
    price: 'Готовка'
  },
  {
    id: 'vegetable-soup',
    name: 'Овощной суп',
    effect: 'Восстановление FOOD и SAT',
    obtained: 'Готовка (растения)',
    price: 'Готовка'
  },
  {
    id: 'smoked-meat',
    name: 'Копчёное мясо',
    effect: 'Не портится, восстановление FOOD',
    obtained: 'Копчение мяса',
    price: 'Готовка'
  },
  {
    id: 'beer',
    name: 'Пиво',
    effect: '2 банки = +3 ATK (3 банки = потеря контроля)',
    obtained: 'Таверна, покупка',
    price: 'Дёшево'
  },
  {
    id: 'milk',
    name: 'Молоко',
    effect: 'Восстановление FOOD, продажа',
    obtained: 'MOD (Breast A)',
    price: '150 TP в Golden Bar Club'
  },
  {
    id: 'burning-keg-room-key',
    name: 'Ключ от комнаты Горячей бочки',
    effect: 'Отдых в таверне (дешевле еды)',
    obtained: 'Покупка в таверне',
    price: 'Дёшево'
  }
];
