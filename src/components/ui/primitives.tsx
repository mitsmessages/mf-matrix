import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------- Button */

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-400",
  accent: "bg-brand-amber text-white hover:bg-amber-700 disabled:bg-amber-300",
  outline: "bg-white text-stone-800 border border-stone-300 hover:border-stone-500",
  ghost: "bg-transparent text-stone-700 hover:bg-stone-100",
  danger: "bg-rose-700 text-white hover:bg-rose-800 disabled:bg-rose-300",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ Card */

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-stone-200 bg-white shadow-soft-sm",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------- Badge */

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-rose-50 text-rose-800 border-rose-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
  brand: "bg-amber-100 text-amber-900 border-amber-200",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- StatCard */

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning" | "brand";
  className?: string;
}) {
  const valueTone = {
    neutral: "text-stone-900",
    success: "text-emerald-700",
    danger: "text-rose-700",
    warning: "text-amber-700",
    brand: "text-brand-amber",
  }[tone];
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white p-3.5", className)}>
      <span className="block text-[11px] font-medium uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <span className={cn("mt-1 block font-serif text-xl font-bold", valueTone)}>{value}</span>
      {hint ? <span className="mt-0.5 block text-[11px] text-stone-500">{hint}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------ ProgressBar */

export function ProgressBar({
  value,
  tone = "brand",
  className,
  label,
}: {
  value: number;
  tone?: "brand" | "success" | "danger" | "neutral" | "warning";
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const barTone = {
    brand: "bg-brand-amber",
    success: "bg-emerald-600",
    danger: "bg-rose-600",
    neutral: "bg-stone-700",
    warning: "bg-amber-500",
  }[tone];
  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>{label}</span>
          <span className="font-mono">{clamped.toFixed(0)}%</span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "progress"}
      >
        <div className={cn("h-full rounded-full transition-all", barTone)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Segmented */

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("inline-flex flex-wrap gap-1 rounded-xl border border-stone-200 bg-stone-100 p-1", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              active
                ? "bg-white text-stone-900 shadow-soft-sm"
                : "text-stone-600 hover:text-stone-900",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- Slider */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  hint,
  formatValue,
  accent = "stone",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  hint?: ReactNode;
  formatValue?: (value: number) => string;
  accent?: "stone" | "amber" | "emerald";
}) {
  const accentClass = {
    stone: "accent-stone-900",
    amber: "accent-brand-amber",
    emerald: "accent-emerald-700",
  }[accent];
  const id = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-stone-700">
        <label htmlFor={id}>{label}</label>
        <span className="font-mono font-semibold text-stone-900">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("smooth-slider", accentClass)}
      />
      {hint ? <p className="text-[11px] leading-snug text-stone-500">{hint}</p> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- Callout */

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "success" | "warning" | "danger" | "brand";
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-stone-200 bg-stone-50 text-stone-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-900",
    brand: "border-amber-200 bg-amber-50/60 text-stone-800",
  }[tone];
  return (
    <div className={cn("rounded-xl border p-3.5 text-xs leading-relaxed", tones, className)}>
      {title ? <div className="mb-1 font-bold">{title}</div> : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ SectionTitle */

export function SectionTitle({
  eyebrow,
  title,
  hint,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        {eyebrow ? (
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-amber">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>
        {hint ? <p className="mt-0.5 max-w-2xl text-xs text-stone-500">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}
