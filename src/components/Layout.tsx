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
import { searchAll, searchIndex, type SearchEntry } from "../lib/search";
import { Badge } from "./ui";

function Sigil() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <path d="M20 2 37 20 20 38 3 20Z" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <path d="M20 8 31 20 20 32 9 20Z" fill="none" stroke="currentColor" strokeWidth=".75" opacity=".35" />
      <path d="M20 12v13M15 17l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="27" r="1.4" fill="currentColor" />
    </svg>
  );
}

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
          ? "border-ember bg-gradient-to-r from-ember/[0.12] to-transparent text-parchment"
          : "border-transparent text-muted hover:border-line hover:bg-white/[0.025] hover:text-parchment"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-ember" : "text-muted/60 group-hover:text-ember/80"}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{label}</span>
        <span className="block truncate text-[10px] tracking-wide text-muted/55">{desc}</span>
      </span>
      {typeof count === "number" && (
        <span className={`text-[10px] tabular-nums ${active ? "text-ember/80" : "text-muted/40"}`}>{count}</span>
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

      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line/80 bg-void/95 backdrop-blur-md">
        <div className="flex h-full items-center gap-3 px-3 sm:px-5">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-muted hover:text-parchment lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href={href("home")} className="group flex min-w-0 items-center gap-3">
            <span className="text-ember transition group-hover:text-gold">
              <Sigil />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[17px] leading-none tracking-wide text-parchment">
                LONA<span className="text-ember">RPG</span>
              </span>
              <span className="mt-1 hidden text-[9px] uppercase tracking-[0.24em] text-muted/60 sm:block">
                {SITE.short}
              </span>
            </span>
          </a>

          <div className="mx-2 hidden h-6 w-px bg-line md:block" />
          <div className="hidden items-center gap-2 text-xs text-muted md:flex">
            <span className="text-ember/60">/</span>
            <span className="tracking-wide">{sectionLabel(route.section)}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onSearch}
              className="group flex items-center gap-2 border border-line bg-white/[0.02] px-2.5 py-2 text-xs text-muted transition hover:border-ember/40 hover:text-parchment sm:px-3"
              aria-label="Поиск по архиву"
            >
              <Search className="h-4 w-4 text-muted/70 group-hover:text-ember" />
              <span className="hidden sm:inline">Поиск</span>
              <kbd className="hidden border border-line bg-void px-1.5 py-0.5 text-[9px] text-muted/60 md:inline">
                Ctrl K
              </kbd>
            </button>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden p-2 text-muted transition hover:text-parchment sm:block"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <span className="hidden border border-blood/40 bg-blood/10 px-2 py-1 text-[10px] font-bold tracking-widest text-[#d98a8a] sm:inline">
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
        className={`fixed bottom-0 left-0 top-16 z-[45] w-[278px] border-r border-line/80 bg-abyss/95 backdrop-blur-md transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line/60 px-4 py-3 lg:hidden">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted">Навигация</span>
            <button onClick={closeMenu} className="p-1 text-muted hover:text-parchment" aria-label="Закрыть">
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto py-4">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="px-4 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-muted/40">
                  {group.label}
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

          <div className="border-t border-line/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted/60">
              <span className="h-1.5 w-1.5 rounded-full bg-moss" />
              Актуальная сборка
            </div>
            <div className="font-display text-sm text-parchment">{SITE.version}</div>
            <div className="mt-0.5 text-[10px] text-muted/50">DEV · {SITE.devDate}</div>
            <a
              href={href("sources")}
              className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-ember/80 hover:text-ember"
            >
              Источники и версии <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </aside>

      <div className="pt-16 lg:pl-[278px]">
        <main id="main" className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1180px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>

        <footer className="mt-10 border-t border-line/70 bg-abyss/40">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-8 text-xs text-muted/70 sm:px-6 lg:px-10 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-display text-sm text-parchment/80">{SITE.title}</div>
              <p className="mt-1 max-w-xl leading-relaxed">
                Неофициальный русскоязычный архив. LonaRPG создан Eccma417. Материалы сообщества
                используются с указанием источников; тексты переписаны, а не скопированы.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="blood">
                <ShieldAlert className="h-3 w-3" /> 18+
              </Badge>
              <span>{SITE.version}</span>
              <a
                href={SITE.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ember/80 hover:text-ember"
              >
                Miraheze <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<SearchEntry[]>(() => {
    if (!query.trim()) {
      return searchIndex.filter((e) =>
        ["quest-rat-tutorial", "mech-controls", "build-hq-bruiser", "loc-burning-keg", "char-cocona", "ending-normal-doom", "equipment-saber", "secret-twin-peaks-mirage"].includes(
          e.key,
        ),
      );
    }
    return searchAll(query);
  }, [query]);

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
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-void/80 px-3 pt-[10vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по архиву"
        className="w-full max-w-2xl border border-line bg-panel shadow-2xl shadow-black/60"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-5 w-5 text-ember/70" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Квест, предмет, NPC, механика…"
            className="min-w-0 flex-1 bg-transparent text-base text-parchment placeholder:text-muted/45 focus:outline-none"
          />
          <button onClick={onClose} className="border border-line px-1.5 py-0.5 text-[10px] text-muted hover:text-parchment">
            ESC
          </button>
        </div>

        <div className="max-h-[58vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted">
              Ничего не найдено. Попробуйте «Коко-на», «катана», «Doom» или «беременность».
            </div>
          ) : (
            <>
              <div className="px-4 pb-1 pt-3 text-[9px] uppercase tracking-[0.22em] text-muted/40">
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
                        ? "border-ember bg-ember/[0.08]"
                        : "border-transparent hover:bg-white/[0.025]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${i === active ? "text-ember" : "text-muted/50"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-parchment">{entry.title}</span>
                      <span className="block truncate text-[11px] text-muted/60">{entry.subtitle}</span>
                    </span>
                    <span className="shrink-0 text-[9px] uppercase tracking-wider text-muted/40">{entry.kind}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[10px] text-muted/45">
          <span>↑ ↓ — выбор · Enter — открыть · Esc — закрыть</span>
          <span>{searchIndex.length} записей</span>
        </div>
      </div>
    </div>
  );
}
