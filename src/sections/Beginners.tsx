import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Coins,
  Flame,
  HeartPulse,
  MapPin,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Utensils,
} from "lucide-react";
import { href } from "../lib/router";
import { Badge, Callout, SectionHeader, SectionSubhead } from "../components/ui";

const checklist = [
  "Выйти из стартовой комнаты и взять вилы из сундука",
  "Убить 8 крыс на мосту, не тратя всю STA",
  "Найти записку Фейры в глубине канализации",
  "Сдать обучение и получить первые монеты",
  "Купить ключ от комнаты в The Burning Keg (550 TP)",
  "Собрать 4 White Dragon Weed в джунглях",
  "Купить Short Sword и Wooden Shield",
  "Взять повторяемый заказ на скелетов",
  "Нанять Jobless Treasure Hunter на кладбище",
  "Открыть банк Tripartite Exchange",
  "Собрать первые 2–3 Gold Coin",
  "Сохраниться перед первым данжем",
];

const food = [
  ["Good Soup", "1 мясо + 1 овощ, Dark Cauldron", "Основная еда на Hard; дешёвая и сытная"],
  ["Dry Meal", "Торговцы, готовка", "Не портится; обязательна на Hell/Doom"],
  ["Smoked Meat", "Готовка при SUR", "Долго хранится, хорошая сытость"],
  ["Cheese", "Молоко + Dark Cauldron", "Не портится, полезно для младенцев"],
  ["Fruit Wine", "Торговцы, таверны", "+Mood, но опьянение и потеря контроля"],
  ["Junk Food", "Дёшево", "Быстро поднимает SAT, но повышает Puke"],
];

const mistakes = [
  {
    title: "Лезть в бой на нуле STA",
    text: "Первое правило: STA — это жизнь. Отступите, отдохните, выпейте Blue Potion. Босс подождёт.",
  },
  {
    title: "Покупать еду вместо комнаты",
    text: "Ключ от The Burning Keg окупается за пару ночей и полностью восстанавливает HP/STA/SAT.",
  },
  {
    title: "Игнорировать Morality",
    text: "Ниже 15 в Ноэре враждебны все. Если репутация рухнула — купите Fake ID в переулках.",
  },
  {
    title: "Забывать про сохранение",
    text: "На Doom смерть удаляет файл, а меню в бою недоступно. Сохраняйтесь до, а не после.",
  },
  {
    title: "Тащить весь лут",
    text: "Перегруз замедляет и мешает бегу. Деньги и редкие вещи — в банк, мусор — торговцу.",
  },
  {
    title: "Атаковать NPC",
    text: "Даже случайный удар по союзнику или горожанину может закрыть квесты и концовку.",
  },
];

export function Beginners() {
  const [done, setDone] = useState<boolean[]>(() => {
    try {
      const saved = window.localStorage.getItem("lona-beginner-checklist");
      if (saved) {
        const parsed = JSON.parse(saved) as boolean[];
        if (Array.isArray(parsed) && parsed.length === checklist.length) return parsed;
      }
    } catch {
      /* localStorage может быть недоступен */
    }
    return checklist.map(() => false);
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("lona-beginner-checklist", JSON.stringify(done));
    } catch {
      /* игнорируем */
    }
  }, [done]);

  const completed = done.filter(Boolean).length;

  return (
    <div>
      <SectionHeader
        eyebrow="Начало пути"
        title="Первые шаги на острове"
        description="Первые два часа решают, будет ли у Лоны еда, оружие и шанс дожить до корабля. Здесь — короткий маршрут без спойлеров и лишней беготни."
        meta={
          <>
            <Badge tone="gold">Hard рекомендуется</Badge>
            <Badge tone="neutral">Без сюжетных спойлеров</Badge>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display text-2xl text-parchment">Что сделать в первые 30 минут</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Обучение — единственный безопасный полигон. Не пропускайте его: там дают вилы, учат
            отдыху и дают первый капитал. Лестница справа позволяет пропустить туториал, но награды
            за это нет.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex gap-3 border border-line bg-white/[0.015] p-3">
              <span className="font-display text-ember">01</span>
              <p className="text-sm text-parchment/85">
                Выйдите на восток, затем на юг к мосту. Крысы сами прибегут на узкий проход — бейте
                по одной, не давайте окружить.
              </p>
            </div>
            <div className="flex gap-3 border border-line bg-white/[0.015] p-3">
              <span className="font-display text-ember">02</span>
              <p className="text-sm text-parchment/85">
                Обычная атака тратит меньше STA, чем размахивание клубом. Огонь фонаря (4 STA) хорош
                против крыс: подожгите и отойдите, пока они горят.
              </p>
            </div>
            <div className="flex gap-3 border border-line bg-white/[0.015] p-3">
              <span className="font-display text-ember">03</span>
              <p className="text-sm text-parchment/85">
                В западной части канализации найдите сундук с вилами и записку Фейры. Вилы бьют на две
                клетки — наденьте их сразу.
              </p>
            </div>
            <div className="flex gap-3 border border-line bg-white/[0.015] p-3">
              <span className="font-display text-ember">04</span>
              <p className="text-sm text-parchment/85">
                Соберите 8 хвостов, найдите тело Фейры, вернитесь к доске заказов. Отдохните перед
                выходом и сохранитесь.
              </p>
            </div>
          </div>
          <Callout tone="success" title="Первый заработок">
            Сразу после обучения возьмите заказ на White Dragon Weed у Элизы и повторяемый заказ на
            скелетов. Вместе они дают первые деньги, опыт и репутацию без рискованных данжей.
          </Callout>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-parchment">Чек-лист</h2>
            <span className="text-xs text-ember">{completed}/{checklist.length}</span>
          </div>
          <div className="mt-3 h-1 w-full bg-line">
            <div
              className="h-1 bg-ember transition-all"
              style={{ width: `${(completed / checklist.length) * 100}%` }}
            />
          </div>
          <div className="mt-4 space-y-1.5">
            {checklist.map((item, i) => (
              <button
                key={item}
                onClick={() => setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                className="flex w-full items-start gap-2.5 py-1 text-left text-[13px] leading-snug text-muted transition hover:text-parchment"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                    done[i] ? "border-ember bg-ember/20 text-ember" : "border-line text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className={done[i] ? "text-muted/45 line-through" : ""}>{item}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted/40">
            Отметки сохраняются в браузере. Это не игровой прогресс.
          </p>
        </div>
      </div>

      <section className="mt-10">
        <SectionSubhead title="Еда, отдых и первые деньги" />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="wiki-table">
                <thead>
                  <tr>
                    <th>Еда</th>
                    <th>Где взять</th>
                    <th>Зачем</th>
                  </tr>
                </thead>
                <tbody>
                  {food.map(([name, source, why]) => (
                    <tr key={name}>
                      <td className="font-medium text-parchment">{name}</td>
                      <td className="text-muted">{source}</td>
                      <td>{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-3">
            <div className="card p-4">
              <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted/55">
                <Utensils className="h-4 w-4 text-ember" /> Темп
              </div>
              <p className="text-sm leading-relaxed text-parchment/85">
                Не ешьте всё сразу. Держите SAT выше 40, а STA — выше половины. Отдых тратит 10 SAT и
                возвращает 20 STA; сон проматывает день и обновляет карту.
              </p>
            </div>
            <div className="card p-4">
              <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted/55">
                <Coins className="h-4 w-4 text-gold" /> Стартовый капитал
              </div>
              <p className="text-sm leading-relaxed text-parchment/85">
                Белый драконий корень (2 CC), скелеты (7 CC), шахта (2 CC + 3 CC), сквоттеры
                (1 CC). Крысиные хвосты и уши оркиндов продавайте только после сдачи заказов.
              </p>
            </div>
            <div className="card p-4">
              <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted/55">
                <MapPin className="h-4 w-4 text-frost" /> Безопасная база
              </div>
              <p className="text-sm leading-relaxed text-parchment/85">
                The Burning Keg — ваш дом. Ключ 550 TP, сон полностью восстанавливает силы, рядом
                доска заказов, банк и клиника Элизы.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionSubhead title="Куда идти дальше" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Swords,
              title: "Взять оружие",
              text: "Short Sword + Wooden Shield — надёжный старт. Вилы — дешёвая альтернатива.",
              to: href("equipment"),
            },
            {
              icon: Shield,
              title: "Выбрать билд",
              text: "HQ-боец прощает ошибки, стелс экономит ресурсы, маг убивает толпу.",
              to: href("builds"),
            },
            {
              icon: HeartPulse,
              title: "Понять статы",
              text: "CON даёт HP/STA, COM — урон, SCU — стелс, SUR — выживание.",
              to: href("mechanics", "stats"),
            },
            {
              icon: Skull,
              title: "Знать врагов",
              text: "Крысы, скелеты, гоблины и аберрации. Слабости и дроп.",
              to: href("bestiary"),
            },
          ].map((c) => (
            <a key={c.title} href={c.to} className="card card-hover group p-4">
              <c.icon className="mb-2 h-5 w-5 text-ember/70" />
              <h3 className="font-display text-base text-parchment group-hover:text-gold">{c.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{c.text}</p>
              <ArrowRight className="mt-2 h-3.5 w-3.5 text-ember/50" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div>
          <SectionSubhead title="Частые ошибки" />
          <div className="space-y-1.5">
            {mistakes.map((m) => (
              <div key={m.title} className="border border-line bg-white/[0.015] p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                  <div>
                    <div className="text-sm font-medium text-parchment">{m.title}</div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionSubhead title="Опасные места на старте" />
          <div className="space-y-1.5">
            {[
              ["Пиковый лес", "Кабаны и Король спирали. Обходите до 5–6 уровня."],
              ["Кристальная шахта", "Темно, паразиты, взрывающиеся мутанты. Нужен фонарь."],
              ["Гнёзда аберраций", "Щупальца и захваты. Без огня и репеллента не входить."],
              ["Побережье Фиштопии", "Рыболюды бьют больно, особенно в воде."],
              ["Дорога на восток", "Патрули оркиндов и случайные встречи. Держите STA."],
            ].map(([name, text]) => (
              <div key={name} className="flex gap-3 border border-line bg-white/[0.015] p-3">
                <Skull className="mt-0.5 h-4 w-4 shrink-0 text-blood/80" />
                <div>
                  <div className="text-sm font-medium text-parchment">{name}</div>
                  <p className="text-[13px] leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Callout tone="danger" title="Если всё пошло не так">
            Потеряли STA и попали в плен? Не выбирайте «сдаться». Из большинства видов рабства можно
            сбежать, а смерть на Doom удаляет сохранение. Инструкции — в разделе «Выживание».
          </Callout>
        </div>
      </section>

      <Callout tone="adult" title="18+">
        В игре есть взрослые сцены, рабство, беременность и зависимости. Они описаны в разделе
        «Механики» как системы, без графики. Если контент вам неприятен, отключите фетиши в настройках
        и играйте через стелс и высокую STA.
      </Callout>
    </div>
  );
}
