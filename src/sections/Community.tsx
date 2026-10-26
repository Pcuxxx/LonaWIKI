import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Download,
  ExternalLink,
  FileJson,
  Github,
  MessagesSquare,
  PencilLine,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge, SectionHeader, SectionSubhead } from "../components/ui";
import { PageComments } from "../components/Comments";
import { absoluteUrl, PAGE_BY_ID, PAGES } from "../lib/pages";
import type { SectionId } from "../lib/router";
import { trackEvent } from "../lib/analytics";
import { openGitHubPopup } from "../lib/popup";
import { NATIVE_COMMENTS } from "../lib/supabase";

const GITHUB = "https://github.com/Pcuxxx/LonaWIKI";
const DISCUSSIONS = `${GITHUB}/discussions`;
const ISSUES = `${GITHUB}/issues/new`;

const DATA_EXPORTS = [
  { file: "locations.json", label: "Локации", desc: "45 локаций, регионы и координаты" },
  { file: "quests.json", label: "Квесты", desc: "53 квеста со шагами и наградами" },
  { file: "equipment.json", label: "Снаряжение", desc: "Оружие, броня, наборы и статы" },
  { file: "items.json", label: "Предметы", desc: "Расходники и квестовые предметы" },
  { file: "craft.json", label: "Крафт", desc: "Рецепты Dark Cauldron" },
  { file: "bestiary.json", label: "Бестиарий", desc: "Враги, боссы и слабости" },
  { file: "debug.json", label: "Служебные карты", desc: "Лаборатории и пометки редактора" },
  { file: "progress.json", label: "Счётчики", desc: "Размеры разделов и список страниц" },
  { file: "build.json", label: "Сборка", desc: "Версия данных и дата генерации" },
];

const HELP_CARDS = [
  {
    icon: PencilLine,
    title: "Исправить факт",
    text: "Координаты, цена, стат или название. Приложите версию игры и скриншот — так правку быстрее проверить.",
  },
  {
    icon: BookOpen,
    title: "Добавить перевод",
    text: "Оригинальные названия и реплики полезны рядом с русскими. Не переводите имена собственные наугад.",
  },
  {
    icon: Sparkles,
    title: "Найти секрет",
    text: "Пасхалки, вырезанные предметы и неочевидные взаимодействия. Помечайте, если это отладка, а не обычная игра.",
  },
  {
    icon: Code2,
    title: "Помочь с кодом",
    text: "Карта, поиск, доступность и производительность. Исходники открыты, данные лежат отдельно от компонентов.",
  },
];

export function CommunityView() {
  const [page, setPage] = useState<SectionId>("home");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [editState, setEditState] = useState<"idle" | "open" | "blocked">("idle");

  const pageMeta = PAGE_BY_ID[page] ?? PAGE_BY_ID.home;
  const pageUrl = absoluteUrl(page);

  const issueUrl = useMemo(() => {
    const firstLine = message
      .split(/\r?\n/)
      .find((line) => line.trim().length > 0)
      ?.trim()
      .slice(0, 70);
    const title = `Правка: ${pageMeta.label}${firstLine ? ` — ${firstLine}` : ""}`;
    // Только авторский текст и скрытый маркер страницы: без шапки и подписи.
    const body = `${message.trim()}\n\n<!-- lonawiki:edit ${page} -->`;
    return `${ISSUES}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  }, [message, page, pageMeta.label]);

  const sendEdit = () => {
    trackEvent("community-edit", page);
    const popup = openGitHubPopup(issueUrl, "lonawiki-edit");
    setEditState(popup ? "open" : "blocked");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      trackEvent("community-copy", page);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Архив"
        title="Сообщество"
        description="Архив живёт на проверках и правках. Здесь можно предложить исправление, обсудить игру, забрать данные в JSON и помочь с тем, что ещё не описано."
        meta={
          <>
            <Badge tone="gold">Открытые данные</Badge>
            <Badge tone="neutral">GitHub Discussions</Badge>
            <Badge tone="moss">18+</Badge>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="card p-4">
          <SectionSubhead title="Предложить правку" aside="Через GitHub" className="mb-3" />
          <p className="mb-3 text-[12px] leading-relaxed text-muted/70">
            Опишите, что не сходится с игрой. Откроется компактное окно GitHub с уже готовым
            текстом — останется проверить и отправить. Скриншот и версию сборки можно добавить там же.
          </p>

          <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="flex flex-col gap-1">
              <span className="text-[8.5px] uppercase tracking-[0.18em] text-muted/45">Страница</span>
              <select
                value={page}
                onChange={(event) => setPage(event.target.value as SectionId)}
                className="w-full border border-line bg-void px-3 py-2 text-[12px] text-parchment outline-none focus:border-ember/50"
              >
                {PAGES.filter((entry) => entry.id !== "community").map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={copyLink}
              className="mt-auto flex items-center justify-center gap-1.5 border border-line px-3 py-2 text-[11px] text-muted/70 transition hover:border-gold/40 hover:text-parchment"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-moss" /> : <ExternalLink className="h-3.5 w-3.5" />}
              {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
            </button>
          </div>

          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[8.5px] uppercase tracking-[0.18em] text-muted/45">Что исправить</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Например: у «Кольца Ноэра» неверная цена входа; на карте метка стоит на один квартал севернее…"
              className="w-full resize-y border border-line bg-void px-3 py-2 text-[12px] leading-relaxed text-parchment placeholder:text-muted/35 outline-none focus:border-ember/50"
            />
          </label>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-muted/40">
              Нужен аккаунт GitHub. В публикацию попадёт только ваш текст.
            </span>
            <button
              onClick={sendEdit}
              disabled={!message.trim()}
              className="flex items-center gap-1.5 border border-gold/40 bg-gold/[0.08] px-3.5 py-2 text-[11.5px] text-gold transition hover:bg-gold/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Отправить правку
            </button>
          </div>

          {editState === "open" && (
            <div className="mt-2 border border-gold/25 bg-gold/[0.04] px-2.5 py-2 text-[9.5px] leading-relaxed text-muted/60">
              Окно GitHub открыто. Нажмите там «Submit new issue» — текст уже подставлен.
            </div>
          )}
          {editState === "blocked" && (
            <div className="mt-2 flex flex-wrap items-center gap-2 border border-gold/25 bg-gold/[0.04] px-2.5 py-2 text-[9.5px] leading-relaxed text-muted/60">
              <span>Браузер заблокировал окно.</span>
              <a
                href={issueUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-gold/80 hover:text-gold"
              >
                Открыть форму <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </section>

        <section className="card p-4">
          <SectionSubhead title="Обсуждения" aside="GitHub" className="mb-3" />
          <div className="space-y-2">
            <a
              href={DISCUSSIONS}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("community-discussions")}
              className="flex items-start gap-3 border border-line/70 bg-void/35 p-3 transition hover:border-gold/35 hover:bg-white/[0.02]"
            >
              <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
              <span className="min-w-0">
                <span className="block text-[12.5px] text-parchment">Форум архива</span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/55">
                  Вопросы по прохождению, находки, обсуждение спорных данных и предложения по разделам.
                </span>
              </span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted/35" />
            </a>
            <a
              href={ISSUES}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("community-issues")}
              className="flex items-start gap-3 border border-line/70 bg-void/35 p-3 transition hover:border-gold/35 hover:bg-white/[0.02]"
            >
              <Github className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
              <span className="min-w-0">
                <span className="block text-[12.5px] text-parchment">Ошибки и задачи</span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/55">
                  Конкретные баги сайта, сломанные ссылки и фактические ошибки в данных.
                </span>
              </span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted/35" />
            </a>
            <a
              href={`${GITHUB}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackEvent("community-contributing")}
              className="flex items-start gap-3 border border-line/70 bg-void/35 p-3 transition hover:border-gold/35 hover:bg-white/[0.02]"
            >
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
              <span className="min-w-0">
                <span className="block text-[12.5px] text-parchment">Как устроен архив</span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/55">
                  Правила данных, структура исходников и минимальная проверка перед pull request.
                </span>
              </span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted/35" />
            </a>
          </div>

          <div className="mt-3 border-l-2 border-gold/30 pl-3 text-[10px] leading-relaxed text-muted/50">
            Спойлеры разрешены только в профильных разделах. Не публикуйте пиратские сборки и
            персональные данные; возрастной рейтинг архива — 18+.
          </div>
        </section>
      </div>

      <section className="mt-8">
        <SectionSubhead title="Чем можно помочь" aside="Без обязательств" className="mb-3" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {HELP_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card p-3.5">
                <Icon className="h-4 w-4 text-gold/65" />
                <h3 className="mt-2 font-display text-[15px] text-parchment">{card.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted/60">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="card p-4">
          <SectionSubhead title="Открытые данные" aside="JSON" className="mb-3" />
          <p className="mb-3 text-[11.5px] leading-relaxed text-muted/65">
            Данные архива можно забрать без парсинга страниц: те же объекты, что использует сайт.
            Ссылки стабильны и обновляются при каждой сборке.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {DATA_EXPORTS.map((entry) => (
              <a
                key={entry.file}
                href={`${import.meta.env.BASE_URL}data/${entry.file}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("community-export", entry.file)}
                className="group flex items-center gap-2 border border-line/60 bg-void/30 px-2.5 py-2 transition hover:border-gold/30 hover:bg-white/[0.02]"
              >
                <FileJson className="h-3.5 w-3.5 shrink-0 text-ember/60" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] text-parchment/85">{entry.label}</span>
                  <span className="block truncate text-[9px] text-muted/40">{entry.desc}</span>
                </span>
                <Download className="h-3 w-3 shrink-0 text-muted/30 transition group-hover:text-gold/70" />
              </a>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <SectionSubhead
            title="Комментарии"
            aside={NATIVE_COMMENTS ? "Без регистрации · 18+" : "Публично · 18+"}
            className="mb-3"
          />
          <PageComments pageId="community" pageTitle="Сообщество" />
        </div>
      </section>

      <section className="mt-8 border border-line/70 bg-white/[0.012] p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss/70" />
          <div>
            <h3 className="font-display text-[16px] text-parchment">Проверка важнее скорости</h3>
            <p className="mt-1 max-w-3xl text-[11.5px] leading-relaxed text-muted/60">
              Мы не выдаём служебные карты и отладочные команды за секреты. Если данные расходятся,
              приоритет у файлов игры и наблюдаемого поведения в текущей сборке. Спорные места
              помечаются прямо в тексте, а не прячутся.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
