import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Compass } from "lucide-react";
import { mechanics } from "../data/mechanics";
import { href } from "../lib/router";
import { SectionHeader } from "../components/ui";

export function Mechanics({ focusId }: { focusId?: string }) {
  const [active, setActive] = useState(focusId ?? mechanics[0]?.id ?? "");

  useEffect(() => {
    if (!focusId) return;
    setActive(focusId);
    const t = window.setTimeout(() => {
      document.getElementById(`mech-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(t);
  }, [focusId]);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(`mech-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href("mechanics", id));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Системы"
        title="Механики LonaRPG"
        description="Как устроены статы, бой, стелс, выживание, взрослые системы и Rebirth. Здесь нет советов «просто играйте лучше» — только правила, числа и последствия."
        meta={
          <>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted/50">
              {mechanics.length} разделов
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-blood/70">18+ в разделе «Секс»</span>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block">
          <div className="sticky top-20 border border-line bg-panel/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted/45">
              <Compass className="h-3.5 w-3.5 text-ember/60" /> Содержание
            </div>
            <div className="space-y-0.5">
              {mechanics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => jump(m.id)}
                  className={`flex w-full items-center justify-between gap-2 border-l-2 px-2 py-1.5 text-left text-[12px] leading-snug transition ${
                    active === m.id
                      ? "border-ember bg-ember/[0.07] text-parchment"
                      : "border-transparent text-muted hover:text-parchment"
                  }`}
                >
                  <span>{m.title}</span>
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-30" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="min-w-0 space-y-5">
          {mechanics.map((section) => (
            <section
              key={section.id}
              id={`mech-${section.id}`}
              className="card section-anchor scroll-mt-24 p-5 sm:p-6"
            >
              <div className="mb-1 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-ember/60">
                <BookOpen className="h-3.5 w-3.5" /> Раздел
              </div>
              <h2 className="font-display text-2xl text-parchment">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{section.lead}</p>
              <div className="mt-5 space-y-5">
                {section.blocks.map((block) => (
                  <div key={block.title}>
                    <h3 className="mb-2 border-l-2 border-ember/40 pl-2.5 font-display text-base text-parchment">
                      {block.title}
                    </h3>
                    <div className="prose-wiki">
                      {block.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    {block.table && (
                      <div className="mt-3 overflow-x-auto border border-line">
                        <table className="wiki-table">
                          <thead>
                            <tr>
                              {block.table.head.map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.table.rows.map((row, ri) => (
                              <tr key={ri}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className={ci === 0 ? "font-medium text-parchment" : ""}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end border-t border-line/60 pt-3">
                <a
                  href={href("mechanics", section.id)}
                  className="text-[10px] uppercase tracking-[0.16em] text-muted/40 hover:text-ember"
                >
                  Ссылка на раздел
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
