import { AlertTriangle, Cpu, Leaf } from "lucide-react";
import { Lang, translations } from "@/lib/i18n";

interface Props { lang: Lang }

export const ContextSidebar = ({ lang }: Props) => {
  const t = translations[lang];
  const items = [
    { icon: AlertTriangle, title: t.problem, body: t.problemBody, tone: "saffron" as const },
    { icon: Cpu, title: t.solution, body: t.solutionBody, tone: "primary" as const },
    { icon: Leaf, title: t.sustain, body: t.sustainBody, tone: "safe" as const },
  ];
  const toneClass = {
    saffron: "bg-saffron-soft text-saffron border-saffron/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    safe: "bg-safe-soft text-safe border-safe/20",
  };
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.title} className="rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border ${toneClass[it.tone]}`}>
              <it.icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">{it.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};