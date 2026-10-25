import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

export function SigilWatermark() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <path d="M60 6 114 60 60 114 6 60Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M60 22 98 60 60 98 22 60Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <path d="M60 38v44M46 53l14-15 14 15" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="60" cy="85" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Sigil({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 2 37 20 20 38 3 20Z" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <path d="M20 8 31 20 20 32 9 20Z" fill="none" stroke="currentColor" strokeWidth=".75" opacity=".35" />
      <path d="M20 12v13M15 17l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="27" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="relative mb-9 overflow-hidden border-b border-line/70 pb-7">
      <div className="pointer-events-none absolute -right-5 -top-12 hidden h-44 w-44 text-gold opacity-[0.055] sm:block">
        <SigilWatermark />
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-ember/90">
        <span className="h-1.5 w-1.5 rotate-45 border border-ember/70 bg-ember/25" />
        {eyebrow}
        <span className="h-px w-10 bg-gradient-to-r from-ember/50 to-transparent" />
      </div>
      <h1 className="title-glow relative font-display text-[2.55rem] leading-[1.03] sm:text-[3.15rem]">
        {title}
      </h1>
      {description && (
        <p className="relative mt-3.5 max-w-3xl text-[15px] leading-[1.75] text-muted/95">{description}</p>
      )}
      {meta && <div className="relative mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
    </header>
  );
}

export function SectionSubhead({
  title,
  aside,
  className = "mb-4",
}: {
  title: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 shrink-0 rotate-45 border border-ember/70 bg-ember/25" />
          <h2 className="font-display text-[1.6rem] leading-none text-parchment">{title}</h2>
        </div>
        {aside && (
          <span className="shrink-0 pb-0.5 text-[9.5px] uppercase tracking-[0.2em] text-muted/45">
            {aside}
          </span>
        )}
      </div>
      <div className="mt-2.5 h-px bg-gradient-to-r from-gold/25 via-line/50 to-transparent" />
    </div>
  );
}

const badgeTones = {
  ember: "border-ember/35 bg-ember/[0.12] text-[#e2a877]",
  blood: "border-blood/45 bg-blood/15 text-[#e09a9a]",
  gold: "border-gold/35 bg-gold/[0.11] text-[#e2c489]",
  frost: "border-frost/30 bg-frost/[0.09] text-[#9cc3d0]",
  moss: "border-moss/35 bg-moss/[0.1] text-[#9ab98f]",
  neutral: "border-line bg-white/[0.025] text-muted/90",
  violet: "border-[#7f6aa8]/45 bg-[#7f6aa8]/[0.12] text-[#c2b2e0]",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.14em] ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const calloutTones = {
  info: {
    box: "border-frost/25 bg-frost/[0.06]",
    icon: "text-frost",
    Icon: Info,
  },
  warn: {
    box: "border-gold/25 bg-gold/[0.06]",
    icon: "text-gold",
    Icon: AlertTriangle,
  },
  danger: {
    box: "border-blood/35 bg-blood/[0.08]",
    icon: "text-[#d98a8a]",
    Icon: ShieldAlert,
  },
  success: {
    box: "border-moss/30 bg-moss/[0.06]",
    icon: "text-moss",
    Icon: Sparkles,
  },
  adult: {
    box: "border-[#7f6aa8]/35 bg-[#7f6aa8]/[0.08]",
    icon: "text-[#b7a6d8]",
    Icon: Eye,
  },
} as const;

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof calloutTones;
  title?: string;
  children: ReactNode;
}) {
  const c = calloutTones[tone];
  const Icon = c.Icon;
  return (
    <div className={`my-5 border-l-2 border-y border-r ${c.box} px-4 py-3`}>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${c.icon}`} />
        <div className="min-w-0 text-sm leading-relaxed text-parchment/85">
          {title && (
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-parchment">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function Spoiler({
  children,
  label = "Показать спойлер",
  className = "",
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-2.5 border border-line/80 bg-gradient-to-r from-white/[0.03] to-transparent px-3.5 py-2.5 text-left text-[12px] text-muted transition hover:border-ember/40 hover:bg-ember/[0.045] hover:text-parchment"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-ember/25 bg-ember/[0.07] text-ember/80">
            <Eye className="h-3.5 w-3.5" />
          </span>
          {label}
        </button>
      ) : (
        <div className="relative border border-line/70 bg-void/35 p-3.5">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 border border-line bg-void/90 px-2 py-1 text-[9.5px] uppercase tracking-[0.12em] text-muted transition hover:border-ember/40 hover:text-parchment"
          >
            <EyeOff className="h-3 w-3" /> скрыть
          </button>
          <div className="pt-7">{children}</div>
        </div>
      )}
    </div>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-[2px] border px-2.5 py-1.5 text-[11px] font-medium tracking-wide transition ${
            value === o.id
              ? "border-gold/50 bg-gradient-to-b from-ember/25 to-ember/[0.08] text-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "border-line bg-white/[0.015] text-muted hover:border-ember/30 hover:bg-white/[0.03] hover:text-parchment"
          }`}
        >
          {o.label}
          {typeof o.count === "number" && (
            <span
              className={`ml-1.5 text-[10px] tabular-nums ${
                value === o.id ? "text-gold/70" : "text-muted/45"
              }`}
            >
              {o.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Поиск…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[2px] border border-line/90 bg-void/55 py-2.5 pl-10 pr-9 text-sm text-parchment placeholder:text-muted/40 transition focus:border-ember/55 focus:bg-void/80 focus:outline-none focus:ring-1 focus:ring-ember/15"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-parchment"
          aria-label="Очистить"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function DangerDots({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`Опасность ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= value
              ? value >= 4
                ? "bg-blood"
                : value >= 3
                  ? "bg-ember"
                  : "bg-moss"
              : "bg-line"
          }`}
        />
      ))}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-line/80 bg-white/[0.012] px-6 py-14 text-center text-sm text-muted/80">
      <span className="mx-auto mb-3 block h-1.5 w-1.5 rotate-45 border border-ember/50 bg-ember/20" />
      {text}
    </div>
  );
}

export function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-parchment/85">
          <span className="mt-[9px] h-1 w-1 shrink-0 bg-ember/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Disclosure({
  title,
  children,
  hint,
  defaultOpen = false,
}: {
  title: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border border-line/80 bg-white/[0.015]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm text-parchment transition hover:bg-ember/[0.04]">
        <span className="min-w-0">{title}</span>
        <span className="flex shrink-0 items-center gap-2 text-muted">
          {hint}
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-line/70 px-4 py-4">{children}</div>
    </details>
  );
}

export function StatPill({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border border-line/80 bg-white/[0.02] px-3.5 py-2.5 transition hover:border-ember/25 hover:bg-ember/[0.03]">
      <div className="text-[9.5px] uppercase tracking-[0.18em] text-muted/65">{label}</div>
      <div className="mt-0.5 font-display text-xl text-parchment">{value}</div>
    </div>
  );
}
