import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  MapPin,
  ScrollText,
  Sparkles,
  User,
} from "lucide-react";
import { quests } from "../data/quests";
import type { Quest, QuestKind } from "../data/types";
import { href } from "../lib/router";
import { Badge, Callout, Chips, EmptyState, SearchField, SectionHeader } from "../components/ui";

const kindLabels: Record<QuestKind, string> = {
  main: "Сюжет",
  side: "Побочный",
  repeatable: "Повторяемый",
  companion: "Компаньон",
  dlc: "DLC",
  secret: "Секрет",
};

const kindTones: Record<QuestKind, "gold" | "neutral" | "moss" | "violet" | "frost" | "blood"> = {
  main: "gold",
  side: "neutral",
  repeatable: "moss",
  companion: "violet",
  dlc: "frost",
  secret: "blood",
};

export function Quests({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | QuestKind>("all");
  const [selectedId, setSelectedId] = useState<string>(focusId ?? quests[0]?.id ?? "");

  useEffect(() => {
    if (focusId) setSelectedId(focusId);
  }, [focusId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return quests.filter((quest) => {
      if (kind !== "all" && quest.kind !== kind) return false;
      if (!q) return true;
      return [quest.title, quest.original, quest.region, quest.giver, quest.summary]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, kind]);

  const selected = quests.find((q) => q.id === selectedId) ?? filtered[0] ?? quests[0];

  const select = (id: string) => {
    setSelectedId(id);
    window.history.replaceState(null, "", href("quests", id));
    if (window.innerWidth < 1024) {
      window.setTimeout(() => {
        document.getElementById("quest-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: quests.length };
    for (const q of quests) map[q.kind] = (map[q.kind] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Прохождение"
        title="Квесты острова Ноэр"
        description="53 задания: сюжет, побочные линии, повторяемые заказы и истории компаньонов. Порядок в списке — примерная прогрессия, а не жёсткое требование."
        meta={
          <>
            <Badge tone="gold">{quests.length} квестов</Badge>
            <Badge tone="blood">Есть пропускаемое</Badge>
            <Badge tone="neutral">Спойлеры в шагах</Badge>
          </>
        }
      />

      <Callout tone="warn" title="Как читать">
        В шагах есть спойлеры конкретных сцен. Награды и требования указаны для текущей сборки;
        на разных сложностях суммы опыта и цена билета могут отличаться. Пропускаемые квесты отмечены
        отдельно — сохраняйтесь до ключевых диалогов.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="min-w-0">
          <div className="sticky top-20 z-10 border border-line bg-abyss/95 p-3 backdrop-blur">
            <SearchField value={query} onChange={setQuery} placeholder="Название, регион, NPC…" />
            <div className="mt-2 flex flex-wrap gap-1">
              {(["all", "main", "side", "repeatable", "companion", "dlc", "secret"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`border px-2 py-1 text-[10px] uppercase tracking-wider transition ${
                    kind === k
                      ? "border-ember/50 bg-ember/10 text-ember"
                      : "border-line text-muted hover:text-parchment"
                  }`}
                >
                  {k === "all" ? "Все" : kindLabels[k]}
                  <span className="ml-1 opacity-50">{counts[k] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 max-h-[70vh] overflow-y-auto border border-line bg-void/30">
            {filtered.length === 0 ? (
              <EmptyState text="Квесты не найдены. Попробуйте другой запрос." />
            ) : (
              filtered.map((quest, i) => (
                <button
                  key={quest.id}
                  onClick={() => select(quest.id)}
                  className={`flex w-full items-start gap-3 border-b border-line/60 px-3 py-3 text-left transition last:border-b-0 ${
                    selected?.id === quest.id
                      ? "border-l-2 border-l-ember bg-ember/[0.07]"
                      : "border-l-2 border-l-transparent hover:bg-white/[0.025]"
                  }`}
                >
                  <span className="mt-0.5 w-6 shrink-0 text-right font-display text-[11px] text-muted/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-parchment">{quest.title}</span>
                      {quest.missable && (
                        <AlertTriangle className="h-3 w-3 shrink-0 text-blood" aria-label="Пропускаемый" />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted/55">
                      {quest.region} · {quest.level}
                    </span>
                  </span>
                  <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted/25" />
                </button>
              ))
            )}
          </div>
        </div>

        {selected && <QuestDetail quest={selected} />}
      </div>
    </div>
  );
}

function QuestDetail({ quest }: { quest: Quest }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard может быть недоступен */
    }
  };

  return (
    <article id="quest-detail" className="card min-w-0 scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={kindTones[quest.kind]}>{kindLabels[quest.kind]}</Badge>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted/50">Уровень {quest.level}</span>
            {quest.missable && <Badge tone="blood">Пропускаемый</Badge>}
          </div>
          <h2 className="font-display text-2xl leading-tight text-parchment sm:text-3xl">{quest.title}</h2>
          <p className="mt-1 text-xs italic text-muted/55">{quest.original}</p>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 border border-line px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted hover:border-ember/40 hover:text-parchment"
        >
          {copied ? <Check className="h-3 w-3 text-moss" /> : <Copy className="h-3 w-3" />}
          {copied ? "Скопировано" : "Ссылка"}
        </button>
      </div>

      <div className="mt-4 grid gap-1.5 text-[12px] text-muted sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-ember/60" /> {quest.region}
        </div>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-ember/60" /> {quest.giver}
        </div>
      </div>

      <p className="mt-4 border-l-2 border-ember/30 pl-3 text-sm leading-relaxed text-parchment/85">
        {quest.summary}
      </p>

      {quest.requirements.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
            Требования
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {quest.requirements.map((r) => (
              <span key={r} className="border border-line bg-white/[0.02] px-2 py-1 text-[11px] text-muted">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
          <ScrollText className="h-3.5 w-3.5 text-ember/60" /> Прохождение
        </h3>
        <ol className="space-y-3">
          {quest.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-ember/20 bg-ember/[0.06] font-display text-[11px] text-ember">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-parchment/85">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
            <Sparkles className="h-3.5 w-3.5 text-gold/70" /> Награды
          </h3>
          <ul className="space-y-1.5">
            {quest.rewards.map((r) => (
              <li key={r} className="flex gap-2 text-[13px] text-parchment/80">
                <span className="mt-[7px] h-1 w-1 shrink-0 bg-gold/70" /> {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
            <Check className="h-3.5 w-3.5 text-moss/70" /> Советы
          </h3>
          <ul className="space-y-1.5">
            {quest.tips.map((t) => (
              <li key={t} className="flex gap-2 text-[13px] text-parchment/80">
                <span className="mt-[7px] h-1 w-1 shrink-0 bg-moss/70" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {quest.missable && (
        <Callout tone="danger" title="Можно пропустить">
          {quest.missable}
        </Callout>
      )}

      {quest.related && quest.related.length > 0 && (
        <div className="mt-5 border-t border-line/70 pt-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
            Связанное
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quest.related.map((r) => {
              const target = quests.find((q) => q.id === r || q.title === r);
              return target ? (
                <a
                  key={r}
                  href={href("quests", target.id)}
                  className="border border-line px-2 py-1 text-[11px] text-ember/80 hover:border-ember/40 hover:text-ember"
                >
                  {target.title}
                </a>
              ) : (
                <span key={r} className="border border-line px-2 py-1 text-[11px] text-muted">
                  {r}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-3 text-[10px] text-muted/40">
        <span>{quest.version ? `Версия: ${quest.version}` : "Актуально для B.0.10.8.31"}</span>
        <a href={href("quests")} className="inline-flex items-center gap-1 text-ember/60 hover:text-ember">
          <ArrowLeft className="h-3 w-3" /> К списку
        </a>
      </div>
    </article>
  );
}
