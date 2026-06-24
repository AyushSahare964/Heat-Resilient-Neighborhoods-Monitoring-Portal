import { Power, Zap } from "lucide-react";
import { Sensor, zoneOf } from "@/lib/sensors";
import { Lang, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  sensors: Sensor[];
  lang: Lang;
}

export const RelayCard = ({ sensors, lang }: Props) => {
  const t = translations[lang];
  const triggers = sensors.filter((s) => zoneOf(s.temperature) !== "safe");
  const isActive = triggers.length > 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Zap className="h-4 w-4 text-saffron" />
          {t.relayStatus}
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t.threshold}
        </span>
      </div>

      <div className="p-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-md border-2 p-4 transition-colors",
            isActive
              ? "border-heat-high/40 bg-heat-high-soft"
              : "border-safe/30 bg-safe-soft"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full text-white shadow-md",
                isActive ? "bg-heat-high animate-pulse" : "bg-safe"
              )}
            >
              <Power className="h-6 w-6" />
            </div>
            <div>
              <p
                className={cn(
                  "font-display text-base font-bold",
                  isActive ? "text-heat-high" : "text-safe"
                )}
              >
                {isActive ? t.active : t.idle}
              </p>
              <p className="text-xs text-muted-foreground">
                {triggers.length} / {sensors.length} {lang === "mr" ? "सेन्सर ट्रिगर" : "sensors triggered"}
              </p>
            </div>
          </div>

          {/* Toggle visual */}
          <div
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              isActive ? "bg-heat-high" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                isActive ? "translate-x-[22px]" : "translate-x-0.5"
              )}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          {sensors.map((s) => {
            const z = zoneOf(s.temperature);
            return (
              <div
                key={s.id}
                className={cn(
                  "rounded-md border px-2 py-1.5 font-medium",
                  z === "high" && "border-heat-high/30 bg-heat-high-soft text-heat-high",
                  z === "mod" && "border-heat-mod/30 bg-heat-mod-soft text-heat-mod",
                  z === "safe" && "border-safe/30 bg-safe-soft text-safe"
                )}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-70">{s.id.split("-").pop()}</div>
                <div className="font-bold">{s.temperature}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};