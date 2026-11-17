import type { ReactNode } from "react";
import { initials } from "@/lib/format";

export function LiveBadge({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-livesoft px-2 py-0.5 text-[11px] font-semibold tracking-wide text-live">
      <span className="live-dot" aria-hidden />
      {label}
    </span>
  );
}

export function FormatBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-surface2 px-1.5 py-0.5 text-[11px] font-semibold text-muted uppercase tracking-wide">{children}</span>
  );
}

export function TeamLogo({ name, logo, size = 32 }: { name: string; logo?: string; size?: number }) {
  const style = { width: size, height: size, fontSize: Math.max(10, size * 0.36) };
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" width={size} height={size} style={style} className="rounded-full object-cover bg-surface2 shrink-0" loading="lazy" />;
  }
  return (
    <span aria-hidden style={style} className="grid place-items-center rounded-full bg-surface2 text-muted font-semibold shrink-0">
      {initials(name)}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card px-6 py-10 text-center">
      <p className="font-medium text-ink">Couldn’t load this right now</p>
      <p className="mt-1 text-sm text-muted">{message || "Please check your connection and try again."}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 space-y-4">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Horizontal pill filter (single select). */
export function Pills<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="scroll-x flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
            value === o.value ? "border-brand bg-brand text-white" : "border-line bg-surface text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Accessible underline tabs. */
export function Tabs<T extends string>({
  value,
  tabs,
  onChange,
  label,
}: {
  value: T;
  tabs: { value: T; label: string; badge?: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="scroll-x flex gap-1 border-b border-line">
      {tabs.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            role="tab"
            id={`tab-${t.value}`}
            aria-selected={active}
            aria-controls={`panel-${t.value}`}
            tabIndex={active ? 0 : -1}
            type="button"
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.value === value);
              if (e.key === "ArrowRight") onChange(tabs[(i + 1) % tabs.length].value);
              if (e.key === "ArrowLeft") onChange(tabs[(i - 1 + tabs.length) % tabs.length].value);
            }}
            className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            <span className="inline-flex items-center gap-2">
              {t.label}
              {t.badge}
            </span>
            {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} className="pt-5">
      {children}
    </div>
  );
}
