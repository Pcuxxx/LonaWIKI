import { useMemo, useState } from "react";
import { AlertTriangle, Search, Trophy } from "lucide-react";
import { achievements } from "../data/achievements";
import type { Achievement } from "../data/types";
import { Badge, Chips, EmptyState, SectionHeader, StatPill } from "../components/ui";

const categoryLabels: Record<Achievement["category"], string> = {
  story: "Сюжет",
  quest: "Квесты",
  combat: "Бой",
  collection: "Коллекции",
  adult: "18+",
  challenge: "Испытания",
  secret: "Секреты",
};

const categoryTones: Record<Achievement["category"], "gold" | "ember" | "blood" | "frost" | "violet" | "moss" | "neutral"> = {
  story: "gold",
  quest: "moss",
  combat: "blood",
  collection: "frost",
  adult: "violet",
  challenge: "ember",
  secret: "neutral",
};

export function AchievementsView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Achievement["category"]>("all");
  const [onlyMissable, setOnlyMissable] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return achievements.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (onlyMissable && !a.missable) return false;
      if (!q) return true;
      return [a.ru, a.name, a.condition].join(" ").toLocaleLowerCase("ru").includes(q);
    });
  }, [query, category, onlyMissable]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: achievements.length };
    for (const a of achievements) map[a.category] = (map[a.category] ?? 0) + 1;
    return map;
  }, []);

  const missableCount = achievements.filter((a) => a.missable).length;

  return (
    <div>
      <SectionHeader
        eyebrow="Архив"
        title="Достижения"
        description="Все 74 достижения с русскими названиями и условиями. Пропускаемые отмечены: их можно потерять, если пройти ключевую сцену или сменить сложность."
        meta={
          <>
            <Badge tone="gold">{achievements.length} всего</Badge>
            <Badge tone="blood">{missableCount} пропускаемых</Badge>
            <Badge tone="neutral">Steam / встроенные</Badge>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <StatPill label="Всего" value={achievements.length} />
        <StatPill label="Пропускаемых" value={missableCount} />
        <StatPill label="Сложность" value="Hard+" />
      </div>

      <div className="mb-4 border border-line bg-white/[0.015] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название или условие…"
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chips
            options={[
              { id: "all", label: "Все", count: counts.all },
              ...(Object.keys(categoryLabels) as Achievement["category"][]).map((c) => ({
                id: c,
                label: categoryLabels[c],
                count: counts[c] ?? 0,
              })),
            ]}
            value={category}
            onChange={setCategory}
          />
          <button
            onClick={() => setOnlyMissable((v) => !v)}
            className={`ml-auto border px-2 py-1 text-[10px] transition ${
              onlyMissable ? "border-blood/50 text-[#d98a8a]" : "border-line text-muted hover:text-parchment"
            }`}
          >
            Только пропускаемые
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState text="Достижения не найдены." />
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="wiki-table min-w-[700px]">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Достижение</th>
                <th>Категория</th>
                <th>Условие</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr
                  key={a.id}
                  id={`ach-${a.id}`}
                  className={`scroll-mt-24 ${focusId === String(a.id) ? "bg-ember/[0.07]" : ""}`}
                >
                  <td className="font-mono text-[11px] text-muted/40">{a.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 shrink-0 text-gold/50" />
                      <div className="min-w-0">
                        <div className="font-medium text-parchment">{a.ru}</div>
                        <div className="text-[10px] italic text-muted/45">{a.name}</div>
                      </div>
                    </div>
                    {a.missable && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#d98a8a]">
                        <AlertTriangle className="h-3 w-3" /> пропускаемое
                      </div>
                    )}
                  </td>
                  <td>
                    <Badge tone={categoryTones[a.category]}>{categoryLabels[a.category]}</Badge>
                  </td>
                  <td className="text-[12px] leading-relaxed">{a.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="border border-gold/20 bg-gold/[0.04] p-4">
          <h2 className="mb-2 font-display text-base text-parchment">Сложность и достижения</h2>
          <p className="text-[13px] leading-relaxed text-parchment/80">
            Ачивки за Hell и Doom засчитываются, только если режим включён с первого дня новой игры.
            Переключение сложности посреди прохождения их аннулирует. Проверяйте это до старта.
          </p>
        </div>
        <div className="border border-blood/25 bg-blood/[0.05] p-4">
          <h2 className="mb-2 font-display text-base text-parchment">Самые обидные промахи</h2>
          <ul className="space-y-1 text-[12px] leading-relaxed text-parchment/80">
            <li>• Пропустить картину в локации, которую нельзя посетить повторно.</li>
            <li>• Убить Гадалку до отплытия — меняется концовка.</li>
            <li>• Не завершить линии спутников до покупки билета.</li>
            <li>• Согласиться на помощь Джастиса в квесте с инкубатором.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
