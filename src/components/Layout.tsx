import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookMarked,
  ExternalLink,
  Github,
  Menu,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { allSections, navGroups, SITE, sectionLabel } from "../lib/meta";
import { href, navigate, type Route, type SectionId } from "../lib/router";
import type { SearchEntry } from "../lib/search";
import { Badge, Sigil } from "./ui";

function SidebarLink({
  id,
  label,
  desc,
  icon: Icon,
  count,
  active,
  onClick,
}: {
  id: SectionId;
  label: string;
  desc: string;
  icon: typeof BookMarked;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={href(id)}
      onClick={onClick}
      className={`group relative flex items-center gap-3 border-l-2 px-4 py-2.5 transition ${
        active
          ? "border-gold/80 bg-gradient-to-r from-ember/[0.16] via-ember/[0.05] to-transparent text-parchment"
          : "border-transparent text-muted/90 hover:border-line hover:bg-white/[0.025] hover:text-parchment"
      }`}
    >
      {active && (
        <span className="pointer-events-none absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-gold/70 shadow-[0_0_10px_rgba(216,181,107,0.6)]" />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition ${
          active ? "text-gold/90" : "text-muted/55 group-hover:text-ember/80"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{label}</span>
        <span
          className={`block truncate text-[10px] tracking-wide transition ${
            active ? "text-muted/65" : "text-muted/50"
          }`}
        >
          {desc}
        </span>
      </span>
      {typeof count === "number" && (
        <span
          className={`min-w-[20px] text-right text-[9.5px] tabular-nums transition ${
            active ? "text-gold/80" : "text-muted/30 group-hover:text-muted/60"
          }`}
        >
          {count}
        </span>
      )}
    </a>
  );
}

export function Layout({
  route,
  onSearch,
  children,
}: {
  route: Route;
  onSearch: () => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [route.section, route.id]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen text-parchment">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-panel focus:px-4 focus:py-2 focus:text-sm"
      >
        К содержимому
      </a>

      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line/70 bg-void/85 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="flex h-full items-center gap-3 px-3 sm:px-5">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-muted hover:text-parchment lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href={href("home")} className="group flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ember/25 bg-ember/[0.06] text-ember/90 transition group-hover:border-gold/45 group-hover:bg-gold/[0.07] group-hover:text-gold">
              <Sigil className="h-8 w-8" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[18px] leading-none tracking-[0.1em] text-parchment">
                LONA<span className="text-gold/90">RPG</span>
              </span>
              <span className="mt-1 hidden text-[8.5px] uppercase tracking-[0.28em] text-muted/55 sm:block">
                {SITE.short}
              </span>
            </span>
          </a>

          <div className="mx-2 hidden h-7 w-px bg-gradient-to-b from-transparent via-line to-transparent md:block" />
          <div className="hidden items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-muted/80 md:flex">
            <span className="text-gold/50">/</span>
            <span>{sectionLabel(route.section)}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onSearch}
              className="group flex items-center gap-2 rounded-[2px] border border-line/85 bg-white/[0.02] px-2.5 py-2 text-xs text-muted transition hover:border-ember/45 hover:bg-ember/[0.05] hover:text-parchment sm:px-3"
              aria-label="Поиск по архиву"
            >
              <Search className="h-4 w-4 text-muted/70 transition group-hover:text-gold" />
              <span className="hidden sm:inline">Поиск</span>
              <kbd className="hidden border border-line bg-void/80 px-1.5 py-0.5 text-[9px] tracking-wider text-muted/55 md:inline">
                Ctrl K
              </kbd>
            </button>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden p-2 text-muted transition hover:text-gold sm:block"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <span className="hidden border border-blood/45 bg-blood/15 px-2 py-1 text-[9.5px] font-semibold tracking-[0.18em] text-[#e09a9a] sm:inline">
              18+
            </span>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
          aria-label="Закрыть меню"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-[45] w-[278px] border-r border-line/60 bg-gradient-to-b from-abyss/97 via-abyss/95 to-void/95 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line/60 px-4 py-3 lg:hidden">
            <span className="text-[9.5px] uppercase tracking-[0.24em] text-muted">Навигация</span>
            <button onClick={closeMenu} className="p-1 text-muted hover:text-parchment" aria-label="Закрыть">
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto py-5">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-5">
                <div className="mb-1.5 flex items-center gap-2 px-4 text-[8.5px] font-semibold uppercase tracking-[0.26em] text-muted/40">
                  <span className="h-1 w-1 rotate-45 bg-ember/50" />
                  {group.label}
                  <span className="ml-auto h-px w-7 bg-gradient-to-r from-line/80 to-transparent" />
                </div>
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.id}
                    {...item}
                    active={route.section === item.id}
                    onClick={closeMenu}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className="border-t border-line/60 bg-void/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-[9.5px] uppercase tracking-[0.18em] text-muted/55">
              <span className="h-1.5 w-1.5 rounded-full bg-moss shadow-[0_0_8px_rgba(124,154,114,0.6)]" />
              Актуальная сборка
            </div>
            <div className="font-display text-lg leading-none text-parchment">{SITE.version}</div>
            <div className="mt-1 text-[10px] text-muted/50">DEV · {SITE.devDate}</div>
            <a
              href={href("sources")}
              className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-ember/75 transition hover:text-gold"
            >
              Источники и версии <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </aside>

      <div className="pt-16 lg:pl-[278px]">
        <main id="main" className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1180px] px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </main>

        <footer className="mt-14 border-t border-line/60 bg-void/35">
          <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ember/20 bg-ember/[0.04] text-ember/70">
                    <Sigil className="h-7 w-7" />
                  </span>
                  <div>
                    <div className="font-display text-lg leading-none text-parchment/85">{SITE.title}</div>
                    <div className="mt-1.5 text-[8.5px] uppercase tracking-[0.24em] text-muted/40">
                      Русский архив · {SITE.version}
                    </div>
                  </div>
                </div>
                <p className="mt-3.5 text-xs leading-relaxed text-muted/60">
                  Неофициальный русскоязычный архив. LonaRPG создан Eccma417. Материалы сообщества
                  используются с указанием источников; тексты переписаны, а не скопированы.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <Badge tone="blood">
                  <ShieldAlert className="h-3 w-3" /> 18+
                </Badge>
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-muted/40">
                  DEV · {SITE.devDate}
                </span>
                <a
                  href={SITE.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-ember/75 transition hover:text-gold"
                >
                  Miraheze <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-line/50 pt-4 text-[10px] text-muted/35 sm:flex-row sm:items-center sm:justify-between">
              <span>LonaRPG © Eccma417 · неофициальный фанатский проект</span>
              <span>Тексты переписаны · источники указаны</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

type SearchModule = {
  searchAll: (query: string, limit?: number) => SearchEntry[];
  searchIndex: SearchEntry[];
};

const QUICK_LINKS: SearchEntry[] = [
  {
    key: "quick-quest-rat-tutorial",
    section: "quests",
    targetId: "rat-tutorial",
    kind: "Квест",
    title: "Крысиные хвосты",
    subtitle: "Первый заработок в Ноэре",
    haystack: "",
  },
  {
    key: "quick-map",
    section: "map",
    kind: "Карта",
    title: "Интерактивная карта",
    subtitle: "45 локаций и координаты",
    haystack: "",
  },
  {
    key: "quick-mech-controls",
    section: "mechanics",
    targetId: "controls",
    kind: "Механика",
    title: "Управление и интерфейс",
    subtitle: "Клавиши, прицеливание, инвентарь",
    haystack: "",
  },
  {
    key: "quick-burning-keg",
    section: "locations",
    targetId: "burning-keg",
    kind: "Локация",
    title: "«Горящая бочка»",
    subtitle: "Главная таверна Ноэра",
    haystack: "",
  },
  {
    key: "quick-cocona",
    section: "characters",
    targetId: "cocona",
    kind: "Персонаж",
    title: "Коко-на",
    subtitle: "Компаньон и линия квестов",
    haystack: "",
  },
  {
    key: "quick-tools",
    section: "tools",
    kind: "Инструмент",
    title: "Калькулятор крафта",
    subtitle: "Что можно сварить из лута",
    haystack: "",
  },
  {
    key: "quick-tracker",
    section: "tracker",
    kind: "Прогресс",
    title: "Трекер прохождения",
    subtitle: "Квесты, достижения, секреты",
    haystack: "",
  },
];

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [searchModule, setSearchModule] = useState<SearchModule | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || searchModule) return;
    let cancelled = false;
    import("../lib/search").then((module) => {
      if (!cancelled) setSearchModule({ searchAll: module.searchAll, searchIndex: module.searchIndex });
    });
    return () => {
      cancelled = true;
    };
  }, [open, searchModule]);

  const results = useMemo<SearchEntry[]>(() => {
    if (!query.trim()) return QUICK_LINKS;
    if (!searchModule) return [];
    return searchModule.searchAll(query);
  }, [query, searchModule]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((v) => Math.min(v + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((v) => Math.max(v - 1, 0));
      } else if (event.key === "Enter" && results[active]) {
        event.preventDefault();
        navigate(results[active].section, results[active].targetId);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, active, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-void/85 px-3 pt-[10vh] backdrop-blur-md" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по архиву"
        className="relative w-full max-w-2xl overflow-hidden border border-gold/15 bg-panel/95 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
        <div className="flex items-center gap-3 border-b border-line/80 px-5 py-4">
          <Search className="h-5 w-5 text-gold/70" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Квест, предмет, NPC, механика…"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-parchment placeholder:text-muted/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="border border-line px-1.5 py-0.5 text-[9px] tracking-wider text-muted transition hover:border-ember/40 hover:text-parchment"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[58vh] overflow-y-auto">
          {query.trim() && !searchModule ? (
            <div className="px-5 py-12 text-center text-sm text-muted">Загружаю поисковый индекс…</div>
          ) : results.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted">
              Ничего не найдено. Попробуйте «Коко-на», «катана», «Doom» или «беременность».
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-5 pb-1 pt-4 text-[8.5px] uppercase tracking-[0.24em] text-muted/40">
                <span className="h-1 w-1 rotate-45 bg-ember/50" />
                {query.trim() ? `Найдено: ${results.length}` : "Быстрый переход"}
              </div>
              {results.map((entry, i) => {
                const Icon = allSections.find((s) => s.id === entry.section)?.icon ?? Search;
                return (
                  <button
                    key={entry.key}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      navigate(entry.section, entry.targetId);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition ${
                      i === active
                        ? "border-gold/70 bg-gradient-to-r from-ember/[0.12] via-ember/[0.03] to-transparent"
                        : "border-transparent hover:bg-white/[0.025]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center border transition ${
                        i === active
                          ? "border-gold/30 bg-gold/[0.08] text-gold"
                          : "border-line/70 text-muted/45"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] text-parchment">{entry.title}</span>
                      <span className="block truncate text-[11px] text-muted/55">{entry.subtitle}</span>
                    </span>
                    <span className="shrink-0 text-[8.5px] uppercase tracking-[0.14em] text-muted/35">
                      {entry.kind}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line/80 px-5 py-2.5 text-[10px] text-muted/40">
          <span>↑ ↓ — выбор · Enter — открыть · Esc — закрыть</span>
          <span>{searchModule ? `${searchModule.searchIndex.length} записей` : "индекс по запросу"}</span>
        </div>
      </div>
    </div>
  );
}
