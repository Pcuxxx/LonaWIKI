import {
  ArrowRight,
  BookOpen,
  Compass,
  Coins,
  MapPin,
  ScrollText,
  ShieldAlert,
  Skull,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import { counts, SITE } from "../lib/meta";
import { href } from "../lib/router";
import { Badge, Callout } from "../components/ui";

const stats = [
  { label: "Квестов", value: counts.quests, icon: ScrollText, href: href("quests") },
  { label: "Локаций", value: counts.locations, icon: MapPin, href: href("locations") },
  { label: "Предметов", value: counts.items, icon: Coins, href: href("items") },
  { label: "Снаряжения", value: counts.equipment, icon: Swords, href: href("equipment") },
  { label: "Противников", value: counts.bestiary, icon: Skull, href: href("bestiary") },
  { label: "Достижений", value: counts.achievements, icon: Sparkles, href: href("achievements") },
];

const route = [
  {
    n: "01",
    title: "Выжить в Ноэре",
    text: "Закрыть обучение, собрать еду, купить ключ от комнаты и не умереть от голода.",
    link: "Первые шаги",
    to: href("beginners"),
  },
  {
    n: "02",
    title: "Найти работу",
    text: "Повторяемые заказы, кладбище, шахта и побережье. Капитал важнее уровня.",
    link: "Квесты",
    to: href("quests"),
  },
  {
    n: "03",
    title: "Собрать отряд",
    text: "Коко-на, Рарран, Томми и Лиза меняют и бой, и финал. Их линии легко пропустить.",
    link: "Компаньоны",
    to: href("characters"),
  },
  {
    n: "04",
    title: "Накопить 20–30 GC",
    text: "Цена билета зависит от мировой сложности. Банк, молоко и трофеи — ваши друзья.",
    link: "Экономика",
    to: href("mechanics", "economy"),
  },
  {
    n: "05",
    title: "Уплыть — или остаться",
    text: "Пять основных финалов, секретная ядерная концовка и Rebirth. Выбирать вам.",
    link: "Концовки",
    to: href("endings"),
  },
];

const inside = [
  {
    icon: ScrollText,
    title: "53 квеста",
    text: "От крысиных хвостов до штурма Восточного блокпоста: шаги, награды, провалы и пропускаемые сцены.",
    to: href("quests"),
  },
  {
    icon: Users,
    title: "18 персонажей",
    text: "Кто помогает, кто использует и кого можно забрать на корабль. Условия вербовки и слабости.",
    to: href("characters"),
  },
  {
    icon: Swords,
    title: "10 билдов",
    text: "HQ-боец, стелс-ассасин, лучник, маги, суккуб и ловчая. С ротациями и честными минусами.",
    to: href("builds"),
  },
  {
    icon: Compass,
    title: "Секреты",
    text: "Скрытые стены, картины, пасхалки и вырезанный контент — с пометками о статусе.",
    to: href("secrets"),
  },
  {
    icon: BookOpen,
    title: "Механики",
    text: "STA, SAT, SCU, беременность, рабство, сложность и экономика без мифов.",
    to: href("mechanics"),
  },
  {
    icon: ShieldAlert,
    title: "Архив версий",
    text: "Актуальная сборка, источники, расхождения между вики и игрой.",
    to: href("sources"),
  },
];

export function Home() {
  return (
    <div>
      <section className="relative border border-line/80 bg-gradient-to-br from-panel via-abyss to-void px-5 py-9 sm:px-9 sm:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 bg-[radial-gradient(circle_at_top_right,rgba(200,121,65,0.12),transparent_65%)]" />
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge tone="blood">18+</Badge>
            <Badge tone="gold">Сборка {SITE.version}</Badge>
            <Badge tone="neutral">Русский архив</Badge>
          </div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-ember">
            Ноэр · остров, который не отпускает
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.08] text-parchment sm:text-5xl lg:text-6xl">
            <span className="block">LonaRPG:</span>
            <span className="block text-gold/90">полный путеводитель</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            От первого крысиного хвоста до корабля капитана Эдварда. Квесты, билды, снаряжение,
            персонажи, монстры, механики и все финалы — в одном архиве, собранном по вики
            сообщества и проверенным данным.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a
              href={href("beginners")}
              className="inline-flex items-center gap-2 border border-ember/60 bg-ember/15 px-4 py-2.5 text-sm text-ember transition hover:bg-ember/25"
            >
              Начать прохождение <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={href("quests")}
              className="inline-flex items-center gap-2 border border-line bg-white/[0.02] px-4 py-2.5 text-sm text-parchment transition hover:border-gold/40"
            >
              Все квесты <ScrollText className="h-4 w-4 text-muted" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted/60">
            <span>LonaRPG by Eccma417</span>
            <span>·</span>
            <span>Актуально: {SITE.version}</span>
            <span>·</span>
            <span>DEV {SITE.devDate}</span>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="card card-hover px-3 py-3">
            <s.icon className="mb-2 h-4 w-4 text-ember/70" />
            <div className="font-display text-2xl text-parchment">{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted/60">{s.label}</div>
          </a>
        ))}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-line/70 pb-2">
            <h2 className="font-display text-2xl text-parchment">Маршрут к кораблю</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted/50">5 этапов</span>
          </div>
          <div className="space-y-1">
            {route.map((r, i) => (
              <a
                key={r.n}
                href={r.to}
                className="group relative flex gap-4 border border-transparent px-2 py-3 transition hover:border-line/70 hover:bg-white/[0.02]"
              >
                <div className="relative flex w-9 shrink-0 justify-center">
                  <span className="font-display text-sm text-ember/60">{r.n}</span>
                  {i < route.length - 1 && (
                    <span className="absolute top-7 h-[calc(100%+0.2rem)] w-px bg-line/80" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base text-parchment group-hover:text-gold">{r.title}</h3>
                    <ArrowRight className="h-3.5 w-3.5 text-ember/0 transition group-hover:text-ember" />
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{r.text}</p>
                  <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.15em] text-ember/65">
                    {r.link}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Callout tone="warn" title="Сначала — сложность">
            Hard — для первого знакомства. Hell добавляет порчу еды и запрет выхода из боя. Doom
            удаляет сохранение при смерти. Ачивки за Hell/Doom считаются только при включении с
            первого дня.
          </Callout>
          <Callout tone="adult" title="Взрослый контент">
            Игра содержит сцены 18+ и тяжёлые темы. В архиве они описаны как механики, без
            графических деталей. Часть контента можно отключить в настройках.
          </Callout>
          <div className="card p-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted/50">Главная цель</div>
            <div className="font-display text-3xl text-gold">20–30 GC</div>
            <p className="mt-1 text-sm text-muted">
              Столько стоит билет у капитана Эдварда. Цена растёт вместе с мировой сложностью.
            </p>
            <a href={href("endings")} className="mt-3 inline-flex items-center gap-1 text-xs text-ember hover:text-gold">
              Все концовки <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-line/70 pb-2">
          <h2 className="font-display text-2xl text-parchment">Что внутри</h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted/50">без воды</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((c) => (
            <a key={c.title} href={c.to} className="card card-hover group p-4">
              <c.icon className="mb-3 h-5 w-5 text-ember/70" />
              <h3 className="font-display text-lg text-parchment group-hover:text-gold">{c.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{c.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-ember/60">
                Открыть <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted/55">
            <ShieldAlert className="h-4 w-4 text-blood" /> Спойлеры
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Концовки, секреты и судьбы персонажей спрятаны за кнопкой «Показать спойлер». Сюжетные
            квесты описаны открыто, но без финальных поворотов.
          </p>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted/55">
            <BookOpen className="h-4 w-4 text-frost" /> Источники
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Miraheze Wiki, русский Fandom, Steam-гайд, компендиум Pimez и наблюдения сообщества.
            Расхождения отмечены в карточках.
          </p>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted/55">
            <Sparkles className="h-4 w-4 text-gold" /> Версия
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Основной ориентир — {SITE.version}. Предыдущая стабильная — {SITE.previous}. Вырезанный
            контент помечен отдельно и не выдаётся за игровой.
          </p>
        </div>
      </section>
    </div>
  );
}
