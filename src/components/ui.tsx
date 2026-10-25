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
    <header className="mb-8 border-b border-line/70 pb-6">
      <div className="mb-2 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-ember">
        <span className="h-px w-8 bg-ember/70" />
        {eyebrow}
      </div>
      <h1 className="font-display text-3xl leading-tight text-parchment sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{description}</p>
      )}
      {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
    </header>
  );
}

const badgeTones = {
  ember: "border-ember/30 bg-ember/10 text-ember",
  blood: "border-blood/40 bg-blood/15 text-[#d98a8a]",
  gold: "border-gold/30 bg-gold/10 text-gold",
  frost: "border-frost/30 bg-frost/10 text-frost",
  moss: "border-moss/30 bg-moss/10 text-moss",
  neutral: "border-line bg-white/[0.03] text-muted",
  violet: "border-[#7f6aa8]/40 bg-[#7f6aa8]/10 text-[#b7a6d8]",
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
      className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${badgeTones[tone]} ${className}`}
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
          className="group flex w-full items-center gap-2 border border-line bg-white/[0.02] px-3 py-2 text-left text-xs text-muted transition hover:border-ember/40 hover:text-parchment"
        >
          <Eye className="h-4 w-4 text-ember/70" />
          {label}
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 border border-line bg-void/80 px-2 py-1 text-[10px] uppercase tracking-wider text-muted hover:text-parchment"
          >
            <EyeOff className="h-3 w-3" /> скрыть
          </button>
          <div className="pt-8">{children}</div>
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
          className={`border px-2.5 py-1 text-[11px] font-medium tracking-wide transition ${
            value === o.id
              ? "border-ember/60 bg-ember/15 text-ember"
              : "border-line bg-white/[0.02] text-muted hover:border-line/80 hover:text-parchment"
          }`}
        >
          {o.label}
          {typeof o.count === "number" && (
            <span className={`ml-1.5 text-[10px] ${value === o.id ? "text-ember/70" : "text-muted/50"}`}>
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
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-line bg-void/60 py-2 pl-9 pr-9 text-sm text-parchment placeholder:text-muted/45 focus:border-ember/50 focus:outline-none"
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
    <div className="border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
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
    <details open={defaultOpen} className="group border border-line bg-white/[0.015]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-parchment hover:bg-white/[0.025]">
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
    <div className="border border-line bg-white/[0.02] px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted/70">{label}</div>
      <div className="mt-0.5 font-display text-lg text-parchment">{value}</div>
    </div>
  );
}
