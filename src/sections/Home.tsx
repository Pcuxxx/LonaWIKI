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
import type { ReactNode } from "react";
import { counts, SITE } from "../lib/meta";
import { href } from "../lib/router";
import { Badge, Callout, SectionSubhead, SigilWatermark } from "../components/ui";

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
    text: "Повторяемые заказы, кладбище, шахта и побережье. Деньги важнее уровня.",
    link: "Квесты",
    to: href("quests"),
  },
  {
    n: "03",
    title: "Собрать отряд",
    text: "Коко-на, Рарран, Томми и Лиза меняют бой и концовку. Их сюжетные линии легко пропустить.",
    link: "Компаньоны",
    to: href("characters"),
  },
  {
    n: "04",
    title: "Накопить 20–30 GC",
    text: "Цена билета зависит от сложности мира. Банк, молоко и трофеи помогут накопить.",
    link: "Экономика",
    to: href("mechanics", "economy"),
  },
  {
    n: "05",
    title: "Уплыть — или остаться",
    text: "Пять основных финалов, секретная ядерная концовка и Rebirth. Выбор за вами.",
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
    title: "10 сборок",
    text: "Воин, ассасин, лучник, маг, суккуб и ловчий. С порядком боя и честными минусами.",
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

function SectionHead({ title, aside }: { title: string; aside?: ReactNode }) {
  return <SectionSubhead title={title} aside={aside} className="mb-5" />;
}

/** Скалистый силуэт острова у нижней кромки героя. */
function IslandRidge() {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-void sm:h-28"
    >
      <path
        d="M0 160V84l118-30 92 40 108-52 112 44 96-34 120 46 118-50 120 44 100-32 106 40 120-38v78Z"
        fill="rgba(7,6,10,0.9)"
      />
      <path
        d="M0 160V116l140-24 120 34 120-38 118 32 122-30 118 36 120-34 142 30 120-22v80Z"
        fill="#07060a"
      />
      <path
        d="M0 84l118-30 92 40 108-52 112 44 96-34 120 46 118-50 120 44 100-32 106 40 120-38"
        fill="none"
        stroke="rgba(216,181,107,0.22)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Декоративная роза ветров для правой колонки героя. */
function CompassRose() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="h-64 w-64 text-gold">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeOpacity=".22" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeOpacity=".12" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeOpacity=".1" />
      <path d="M100 12v176M12 100h176" stroke="currentColor" strokeOpacity=".18" />
      <path d="M38 38l124 124M162 38L38 162" stroke="currentColor" strokeOpacity=".08" />
      <path d="M100 24 110 100 100 176 90 100Z" fill="currentColor" fillOpacity=".14" />
      <path d="M24 100 100 90 176 100 100 110Z" fill="currentColor" fillOpacity=".14" />
      <path d="M100 24 100 176M24 100 176 100" stroke="currentColor" strokeOpacity=".3" />
      <circle cx="100" cy="100" r="4.5" fill="currentColor" fillOpacity=".6" />
      <path d="M100 12l4 8-4 8-4-8Z" fill="currentColor" fillOpacity=".5" />
    </svg>
  );
}

export function Home() {
  return (
    <div>
      <section className="card-hero relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 hero-ember bg-[radial-gradient(ellipse_60%_55%_at_86%_-8%,rgba(200,121,65,0.22),transparent_62%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_52%_at_-5%_112%,rgba(132,174,189,0.08),transparent_60%)]" />

        <div className="pointer-events-none absolute -right-24 -top-24 hidden h-[28rem] w-[28rem] text-gold opacity-[0.05] sm:block">
          <SigilWatermark />
        </div>

        <span className="ornament-corner left-3 top-3 border-l border-t" />
        <span className="ornament-corner right-3 top-3 border-r border-t" />
        <span className="ornament-corner bottom-3 left-3 border-b border-l" />
        <span className="ornament-corner bottom-3 right-3 border-b border-r" />

        <IslandRidge />

        <div className="relative z-10 grid gap-8 px-5 py-11 sm:px-10 sm:py-14 lg:grid-cols-[1.65fr_0.85fr] lg:items-center lg:px-12 lg:py-16">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge tone="blood">18+</Badge>
              <Badge tone="gold">Сборка {SITE.version}</Badge>
              <Badge tone="neutral">Русский архив</Badge>
            </div>

            <p className="mb-3 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-ember/90">
              <span className="h-px w-7 bg-gradient-to-r from-ember/70 to-transparent" />
              Русский путеводитель по LonaRPG
            </p>

            <h1 className="max-w-3xl font-display text-[2.9rem] leading-[0.98] sm:text-[3.7rem] lg:text-[4.35rem]">
              <span className="title-glow block">LonaRPG:</span>
              <span className="title-glow block">полный путеводитель</span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-[1.78] text-muted/95 sm:text-[16px]">
              Здесь собраны квесты, сборки, снаряжение, персонажи, монстры, механики и все
              концовки игры. Данные взяты из вики сообщества и проверены.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <a
                href={href("beginners")}
                className="group inline-flex items-center gap-2 border border-ember/55 bg-gradient-to-b from-ember/25 to-ember/[0.08] px-5 py-2.5 text-sm text-[#edb489] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_30px_-18px_rgba(200,121,65,0.8)] transition hover:border-gold/60 hover:from-gold/25 hover:to-gold/[0.08] hover:text-gold"
              >
                Начать прохождение
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href={href("quests")}
                className="group inline-flex items-center gap-2 border border-line/90 bg-white/[0.02] px-5 py-2.5 text-sm text-parchment transition hover:border-gold/40 hover:bg-white/[0.04]"
              >
                Все квесты
                <ScrollText className="h-4 w-4 text-muted/70 transition group-hover:text-gold/80" />
              </a>
              <a
                href={href("map")}
                className="group inline-flex items-center gap-2 border border-line/90 bg-white/[0.02] px-5 py-2.5 text-sm text-parchment transition hover:border-frost/40 hover:bg-white/[0.04]"
              >
                Карта острова
                <MapPin className="h-4 w-4 text-muted/70 transition group-hover:text-frost/80" />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-muted/45">
              <span>LonaRPG создан Eccma417</span>
              <span className="h-1 w-1 rotate-45 bg-ember/40" />
              <span>Версия: {SITE.version}</span>
              <span className="h-1 w-1 rotate-45 bg-ember/40" />
              <span>Обновлено: {SITE.devDate}</span>
            </div>
          </div>

          <div className="relative hidden justify-center lg:flex">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gold opacity-[0.07]">
              <CompassRose />
            </div>
            <div className="relative w-full max-w-[15rem] space-y-2.5 pt-2">
              {[
                { k: "Сложности", v: "Hard, Hell, Doom" },
                { k: "Концовок", v: "5+" },
                { k: "Сборок", v: "10" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline justify-between gap-3 border-b border-line/50 pb-2"
                >
                  <span className="text-[9.5px] uppercase tracking-[0.2em] text-muted/55">{row.k}</span>
                  <span className="font-display text-[15px] text-parchment/90">{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Объём архива"
        className="mt-4 grid grid-cols-2 overflow-hidden border border-line/50 bg-panel/25 sm:grid-cols-3 lg:grid-cols-6"
      >
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="stat-cell group -mb-px -mr-px flex flex-col gap-2 border-b border-r border-line/50 px-4 py-4 hover:bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-4 w-4 text-ember/70 transition group-hover:text-gold" />
              <ArrowRight className="h-3 w-3 -translate-x-1 text-gold/0 transition group-hover:translate-x-0 group-hover:text-gold/70" />
            </div>
            <div className="font-display text-[2rem] leading-none text-parchment tabular-nums transition group-hover:text-gold">
              {s.value}
            </div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-muted/55">{s.label}</div>
          </a>
        ))}
      </section>

      <div className="mt-11 grid gap-9 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <SectionHead title="Основной путь" aside="5 этапов" />
          <div className="space-y-1">
            {route.map((r, i) => (
              <a
                key={r.n}
                href={r.to}
                className="group relative -mx-2 flex gap-4 rounded-[2px] border border-transparent px-2 py-3 transition hover:border-line/60 hover:bg-gradient-to-r hover:from-ember/[0.05] hover:to-transparent"
              >
                <div className="relative flex w-8 shrink-0 justify-center pt-1">
                  <span className="flex h-6 w-6 items-center justify-center border border-line/80 bg-void/60 font-display text-[11px] leading-none text-ember/70 transition group-hover:border-gold/40 group-hover:bg-ember/[0.08] group-hover:text-gold">
                    {r.n}
                  </span>
                  {i < route.length - 1 && (
                    <span className="absolute top-8 h-[calc(100%+0.1rem)] w-px bg-gradient-to-b from-line/80 to-line/20" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[1.08rem] leading-tight text-parchment transition group-hover:text-gold">
                      {r.title}
                    </h3>
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-ember/0 transition group-hover:translate-x-0 group-hover:text-ember/80" />
                  </div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted/90">{r.text}</p>
                  <span className="mt-1.5 inline-block text-[9.5px] uppercase tracking-[0.18em] text-ember/60">
                    {r.link}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <Callout tone="warn" title="Сначала — сложность">
            Для первого прохождения выбирайте Hard. На Hell еда портится, а выйти из боя нельзя.
            На Doom смерть удаляет сохранение. Достижения за Hell и Doom засчитываются, только
            если сложность выбрана с самого начала.
          </Callout>
          <Callout tone="adult" title="Взрослый контент">
            В игре есть сцены 18+ и тяжёлые темы. В архиве они описаны как обычные механики, без
            подробностей. Часть контента можно отключить в настройках.
          </Callout>
          <div className="card card-hero p-5">
            <div className="mb-2.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-muted/55">
              <span className="tick-diamond" />
              Главная цель
            </div>
            <div className="font-display text-[2.4rem] leading-none text-gold">20–30 GC</div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted/90">
              Столько стоит билет у капитана Эдварда. Чем выше сложность мира, тем дороже билет.
            </p>
            <a
              href={href("endings")}
              className="group mt-3.5 inline-flex items-center gap-1.5 border-t border-line/60 pt-3 text-[11px] uppercase tracking-[0.12em] text-ember/80 transition hover:text-gold"
            >
              Все концовки
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </aside>
      </div>

      <section className="mt-11">
        <SectionHead title="Что есть в архиве" aside="кратко" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((c) => (
            <a key={c.title} href={c.to} className="card card-hover group p-[18px]">
              <div className="mb-3 flex h-8 w-8 items-center justify-center border border-ember/20 bg-ember/[0.05] text-ember/75 transition group-hover:border-gold/40 group-hover:bg-gold/[0.06] group-hover:text-gold">
                <c.icon className="h-4 w-4" />
              </div>
              <h3 className="font-display text-[1.15rem] leading-tight text-parchment transition group-hover:text-gold">
                {c.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted/85">{c.text}</p>
              <span className="mt-3.5 inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.18em] text-ember/60 transition group-hover:text-gold/80">
                Открыть <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-11 grid gap-2.5 md:grid-cols-3">
        <div className="card p-5">
          <div className="mb-2.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted/55">
            <ShieldAlert className="h-4 w-4 text-blood/90" /> Спойлеры
          </div>
          <p className="text-[13px] leading-relaxed text-muted/90">
            Концовки, секреты и судьбы персонажей спрятаны под кнопкой «Показать спойлер». Сюжетные
            квесты описаны открыто, но без финальных поворотов.
          </p>
        </div>
        <div className="card p-5">
          <div className="mb-2.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted/55">
            <BookOpen className="h-4 w-4 text-frost/90" /> Источники
          </div>
          <p className="text-[13px] leading-relaxed text-muted/90">
            Miraheze Wiki, русский Fandom, Steam-гайд, компендиум Pimez и наблюдения сообщества.
            Расхождения отмечены в карточках.
          </p>
        </div>
        <div className="card p-5">
          <div className="mb-2.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted/55">
            <Sparkles className="h-4 w-4 text-gold/90" /> Версия
          </div>
          <p className="text-[13px] leading-relaxed text-muted/90">
            Основной ориентир — {SITE.version}. Предыдущая стабильная — {SITE.previous}. Вырезанный
            контент помечен отдельно и не выдаётся за игровой.
          </p>
        </div>
      </section>
    </div>
  );
}
