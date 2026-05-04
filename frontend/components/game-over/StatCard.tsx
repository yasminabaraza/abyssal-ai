"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "danger" | "warning" | "muted";
  subtext?: string;
  icon?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  default: "text-cyan-200",
  success: "text-green-400",
  danger: "text-red-400",
  warning: "text-orange-400",
  muted: "text-cyan-800",
};

export default function StatCard({
  label,
  value,
  variant = "default",
  subtext,
  icon,
}: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 bg-[#07182a] border border-cyan-900/30 rounded px-3 py-4">
      {icon && <span className="text-base text-cyan-900">{icon}</span>}
      <dt className="text-[9px] tracking-[0.4em] text-cyan-800 uppercase text-center leading-tight">
        {label}
      </dt>
      <dd
        className={`text-2xl font-black tracking-wide ${VARIANT_CLASSES[variant]}`}
      >
        {value}
      </dd>
      {subtext && (
        <span className="text-[8px] text-cyan-900 tracking-widest text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
