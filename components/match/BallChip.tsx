import type { Rec } from "@/lib/types";
import { ballTone } from "@/lib/format";

const TONE: Record<string, string> = {
  wicket: "bg-wicket text-white",
  six: "bg-six text-white",
  four: "bg-four text-white",
  extra: "bg-extra/15 text-extra border border-extra/40",
  run: "bg-surface2 text-ink",
  dot: "bg-surface2 text-faint",
};

export function BallChip({ ball, size = 32 }: { ball: Rec; size?: number }) {
  const raw = String(ball.ballLabel ?? ball.runs ?? "0");
  const label = raw === "0" ? "•" : raw;
  const tone = ballTone(raw, ball);
  return (
    <span
      title={ball.commentary || raw}
      style={{ minWidth: size, height: size }}
      className={`num inline-grid place-items-center rounded-full px-1.5 text-[12px] font-semibold ${TONE[tone]}`}
    >
      {label}
    </span>
  );
}
