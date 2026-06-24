import { Languages, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lang, translations } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
}

export const GovHeader = ({ lang, onToggleLang }: Props) => {
  const t = translations[lang];
  return (
    <header className="border-b border-border bg-card shadow-card">
      {/* Tricolor stripe */}
      <div className="h-1 gov-stripe" />

      {/* Top utility bar */}
      <div className="bg-secondary/60 border-b border-border">
        <div className="container flex items-center justify-between py-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium text-foreground truncate">{t.govOfMaha}</span>
            <span className="hidden sm:inline shrink-0">· {t.digitalIndia}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLang}
            className="h-7 gap-1.5 text-xs font-semibold text-primary hover:bg-primary/5 shrink-0 ml-2"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "en" ? "मराठी" : "English"}
          </Button>
        </div>
      </div>

      {/* Main brand row */}
      <div className="container flex items-center gap-3 py-3 sm:gap-4 sm:py-4">
        {/* Govt emblem */}
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-gov text-primary-foreground shadow-elevated sm:h-14 sm:w-14">
          <span className="font-display text-base font-bold leading-none sm:text-lg">GoM</span>
          <span className="absolute -bottom-1 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-saffron sm:w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-base font-bold leading-tight text-foreground sm:text-xl md:text-2xl">
            {t.portalTitle}
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs sm:text-sm">{t.portalSub}</p>
        </div>

        {/* Live badge — hidden on very small, shown from sm */}
        <div className="hidden items-center gap-2 rounded-full border border-safe/30 bg-safe-soft px-2.5 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
          </span>
          <span className="text-xs font-semibold text-safe whitespace-nowrap">{t.liveMonitoring}</span>
        </div>

        {/* Compact live dot — mobile only */}
        <div className="flex sm:hidden items-center gap-1.5 rounded-full border border-safe/30 bg-safe-soft px-2 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-safe" />
          </span>
          <span className="text-[10px] font-semibold text-safe">LIVE</span>
        </div>
      </div>
    </header>
  );
};