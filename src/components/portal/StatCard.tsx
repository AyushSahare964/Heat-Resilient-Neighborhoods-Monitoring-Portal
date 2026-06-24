import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "saffron" | "safe" | "high";
}

const toneMap = {
  primary: "bg-primary/10 text-primary",
  saffron: "bg-saffron-soft text-saffron",
  safe: "bg-safe-soft text-safe",
  high: "bg-heat-high-soft text-heat-high",
};

export const StatCard = ({ icon: Icon, label, value, hint, tone = "primary" }: Props) => (
  <div className="rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-elevated sm:p-4">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
        <p className="mt-1 font-display text-xl font-bold text-foreground sm:mt-1.5 sm:text-2xl">{value}</p>
        {hint && <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{hint}</p>}
      </div>
      <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md sm:h-10 sm:w-10", toneMap[tone])}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
    </div>
  </div>
);