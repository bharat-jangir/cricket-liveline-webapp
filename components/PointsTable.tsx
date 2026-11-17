"use client";

import { useMemo, useState } from "react";
import type { Rec } from "@/lib/types";
import { fixed, formatLabel, idOf, teamCode, teamName } from "@/lib/format";
import { EmptyState, Pills, TeamLogo } from "./ui";

const th = "px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted";
const td = "px-3 py-2.5 text-right num text-sm";

export function PointsTable({ entries }: { entries: Rec[] }) {
  const formats = useMemo(() => Array.from(new Set(entries.map((e) => String(e.matchFormat || "")).filter(Boolean))), [entries]);
  const [format, setFormat] = useState(formats[0] || "");

  const rows = entries.filter((e) => !format || !e.matchFormat || e.matchFormat === format);
  const groups = useMemo(() => {
    const map = new Map<string, Rec[]>();
    rows.forEach((r) => {
      const k = r.groupName || "";
      map.set(k, [...(map.get(k) || []), r]);
    });
    return Array.from(map.entries()).map(([name, items]) => ({ name, items: items.sort((a, b) => a.position - b.position) }));
  }, [rows]);

  if (entries.length === 0) return <EmptyState title="Points table isn’t available yet" hint="Standings will appear after the first results." />;

  return (
    <div className="space-y-5">
      {formats.length > 1 && (
        <Pills label="Format" value={format} onChange={setFormat} options={formats.map((f) => ({ value: f, label: formatLabel(f) }))} />
      )}
      {groups.map((g) => (
        <section key={g.name || "all"} className="card overflow-hidden" aria-label={g.name || "Points table"}>
          {g.name && <h3 className="border-b border-line bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink">{g.name}</h3>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <caption className="sr-only">{g.name || "Points table"}</caption>
              <thead className="bg-surface2/60">
                <tr>
                  <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Team</th>
                  <th scope="col" className={th}>P</th>
                  <th scope="col" className={th}>W</th>
                  <th scope="col" className={th}>L</th>
                  <th scope="col" className={th}>T</th>
                  <th scope="col" className={th}>NR</th>
                  <th scope="col" className={th}>NRR</th>
                  <th scope="col" className={th}>Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {g.items.map((r, i) => (
                  <tr key={idOf(r) || i} className={r.qualify ? "bg-accentsoft/40" : ""}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-xs text-muted num">{r.position}</span>
                        <TeamLogo name={teamName(r.teamId)} logo={r.teamId?.logo} size={24} />
                        <span className="text-sm font-medium text-ink">{teamName(r.teamId)}</span>
                        <span className="hidden text-xs text-faint sm:inline">{teamCode(r.teamId, "")}</span>
                        {r.qualify && <span className="rounded bg-accentsoft px-1.5 text-[10px] font-semibold text-accent">Q</span>}
                      </div>
                    </td>
                    <td className={td}>{r.played ?? 0}</td>
                    <td className={td}>{r.won ?? 0}</td>
                    <td className={td}>{r.lost ?? 0}</td>
                    <td className={td}>{(r.tied ?? 0) + (r.draw ?? 0)}</td>
                    <td className={td}>{r.noResult ?? 0}</td>
                    <td className={`${td} text-muted`}>{Number(r.netRunRate) > 0 ? "+" : ""}{fixed(r.netRunRate, 3)}</td>
                    <td className={`${td} font-semibold text-ink`}>{r.points ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
