import { Sensor, zoneOf } from "@/lib/sensors";
import { Lang, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Droplets, Thermometer } from "lucide-react";

interface Props {
  sensors: Sensor[];
  lang: Lang;
}

export const SensorTable = ({ sensors, lang }: Props) => {
  const t = translations[lang];

  const zoneLabel = (z: string) =>
    z === "high" ? t.high : z === "mod" ? t.moderate : t.safe;
  const action = (z: string) =>
    z === "high" ? t.actionHigh : z === "mod" ? t.actionMod : t.actionSafe;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="border-b border-border bg-secondary/40 px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">{t.sensorReadings}</h3>
        <p className="text-xs text-muted-foreground">{t.sensorReadingsSub}</p>
      </div>

      {/* ── Mobile card view (< sm) ── */}
      <div className="sm:hidden divide-y divide-border/60">
        {sensors.map((s) => {
          const z = zoneOf(s.temperature);
          return (
            <div key={s.id} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {lang === "mr" ? s.streetMr : s.street}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">{s.id}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold shrink-0",
                    z === "high" && "border-heat-high/30 bg-heat-high-soft text-heat-high",
                    z === "mod"  && "border-heat-mod/30 bg-heat-mod-soft text-heat-mod",
                    z === "safe" && "border-safe/30 bg-safe-soft text-safe"
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    z === "high" && "bg-heat-high",
                    z === "mod"  && "bg-heat-mod",
                    z === "safe" && "bg-safe"
                  )} />
                  {zoneLabel(z)}
                </span>
              </div>
              <div className="flex gap-4 text-sm mb-1.5">
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <Thermometer className="h-3.5 w-3.5 text-heat-high" />
                  {s.temperature}°C
                </span>
                <span className="inline-flex items-center gap-1.5 text-foreground">
                  <Droplets className="h-3.5 w-3.5 text-primary" />
                  {s.humidity}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{action(z)}</p>
            </div>
          );
        })}
      </div>

      {/* ── Desktop table view (≥ sm) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5">{t.sensor}</th>
              <th className="px-4 py-2.5">{t.temperature}</th>
              <th className="px-4 py-2.5">{t.humidity}</th>
              <th className="px-4 py-2.5">{t.zone}</th>
              <th className="px-4 py-2.5">{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => {
              const z = zoneOf(s.temperature);
              return (
                <tr
                  key={s.id}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">
                      {lang === "mr" ? s.streetMr : s.street}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">{s.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <Thermometer className="h-3.5 w-3.5 text-heat-high" />
                      {s.temperature}°
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-foreground">
                      <Droplets className="h-3.5 w-3.5 text-primary" />
                      {s.humidity}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        z === "high" && "border-heat-high/30 bg-heat-high-soft text-heat-high",
                        z === "mod"  && "border-heat-mod/30 bg-heat-mod-soft text-heat-mod",
                        z === "safe" && "border-safe/30 bg-safe-soft text-safe"
                      )}
                    >
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        z === "high" && "bg-heat-high",
                        z === "mod"  && "bg-heat-mod",
                        z === "safe" && "bg-safe"
                      )} />
                      {zoneLabel(z)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{action(z)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};