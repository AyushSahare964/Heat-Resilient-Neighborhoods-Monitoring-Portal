import { useMemo, useState } from "react";
import { AlertTriangle, Droplets, Flame, MapPin, Menu, RefreshCw, Thermometer, Wifi, X } from "lucide-react";
import { GovHeader } from "@/components/portal/GovHeader";
import { StatCard } from "@/components/portal/StatCard";
import { HeatMap } from "@/components/portal/HeatMap";
import { RelayCard } from "@/components/portal/RelayCard";
import { SensorTable } from "@/components/portal/SensorTable";
import { ContextSidebar } from "@/components/portal/ContextSidebar";
import { SensorConfigDialog } from "@/components/portal/SensorConfigDialog";
import { Button } from "@/components/ui/button";
import { Dict, Lang, translations } from "@/lib/i18n";
import { useSensors, zoneOf } from "@/lib/sensors";
import { cn } from "@/lib/utils";
import { LiveChart } from "@/components/portal/LiveChart";

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  const { sensors, loading, updatedAt, refresh, error } = useSensors(15_000);
  const [configOpen, setConfigOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = useMemo(() => {
    if (!sensors.length) return { avgT: 0, peak: 0, avgH: 0, anyHigh: false };
    const avgT = sensors.reduce((a, s) => a + s.temperature, 0) / sensors.length;
    const peak = Math.max(...sensors.map((s) => s.temperature));
    const avgH = sensors.reduce((a, s) => a + s.humidity, 0) / sensors.length;
    return { avgT, peak, avgH, anyHigh: sensors.some((s) => zoneOf(s.temperature) === "high") };
  }, [sensors]);

  return (
    <div className="min-h-screen bg-background">
      {error && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-heat-high px-4 py-1.5 text-xs font-semibold text-white">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}
      <GovHeader lang={lang} onToggleLang={() => setLang(lang === "en" ? "mr" : "en")} />

      {/* Heat Advisory banner */}
      <div
        className={cn(
          "border-b",
          stats.anyHigh
            ? "border-heat-high/30 bg-heat-high-soft"
            : "border-safe/30 bg-safe-soft"
        )}
      >
        <div className="container flex items-start gap-2 py-2 text-xs sm:items-center sm:gap-3 sm:py-2.5 sm:text-sm">
          <AlertTriangle
            className={cn(
              "mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0 sm:h-4 sm:w-4",
              stats.anyHigh ? "text-heat-high" : "text-safe"
            )}
          />
          <span
            className={cn(
              "font-semibold shrink-0",
              stats.anyHigh ? "text-heat-high" : "text-safe"
            )}
          >
            {t.advisory}:
          </span>
          <span className="text-foreground/80 leading-snug">
            {stats.anyHigh ? t.advisoryHigh : t.advisoryOk}
          </span>
        </div>
      </div>

      <main className="container py-4 sm:py-6">
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
              {t.streetMap}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">{t.streetMapSub}</p>
          </div>

          {/* Desktop toolbar actions */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {t.lastUpdated}: {updatedAt ? updatedAt.toLocaleTimeString() : "—"}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfigOpen(true)}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <MapPin className="h-3.5 w-3.5" />
              {t.sensorSettings}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              disabled={loading}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              {t.refresh}
            </Button>
          </div>

          {/* Mobile toolbar actions */}
          <div className="flex sm:hidden items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">
              {t.lastUpdated}: {updatedAt ? updatedAt.toLocaleTimeString() : "—"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refresh}
                disabled={loading}
                className="h-8 gap-1.5 border-primary/30 px-2.5 text-xs text-primary hover:bg-primary/5"
              >
                <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                {t.refresh}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-8 w-8 border-primary/30 p-0 text-primary hover:bg-primary/5"
              >
                {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-card">
              <button
                onClick={() => { setConfigOpen(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                {t.sensorSettings}
              </button>
            </div>
          )}
        </div>

        {/* Stat row — 2×2 on mobile, 4 columns on large */}
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          <StatCard
            icon={Thermometer}
            label={t.avgTemp}
            value={`${stats.avgT.toFixed(1)}°C`}
            tone="primary"
          />
          <StatCard
            icon={Flame}
            label={t.peakTemp}
            value={`${stats.peak.toFixed(1)}°C`}
            tone={stats.peak > 35 ? "high" : "saffron"}
          />
          <StatCard
            icon={Droplets}
            label={t.avgHumidity}
            value={`${stats.avgH.toFixed(0)}%`}
            tone="primary"
          />
          <StatCard
            icon={Wifi}
            label={t.activeSensors}
            value={`${sensors.length} / 2`}
            hint="ESP32 · DHT22"
            tone="safe"
          />
        </div>

        {/* Main grid — stacked on mobile, 3-col on large */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <div className="space-y-4 sm:space-y-5 lg:col-span-2">
            {/* Map card */}
            <div className="overflow-hidden rounded-lg border border-border bg-card p-3 shadow-card sm:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <Legend t={t} />
              </div>
              <HeatMap sensors={sensors} lang={lang} />
            </div>

            <SensorTable sensors={sensors} lang={lang} />

            {/* Real-time chart */}
            <LiveChart sensors={sensors} lang={lang} />
          </div>

          <aside className="space-y-4 sm:space-y-5">
            <RelayCard sensors={sensors} lang={lang} />
            <ContextSidebar lang={lang} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-border bg-card sm:mt-8">
        <div className="h-1 gov-stripe" />
        <div className="container flex flex-col items-center justify-between gap-1.5 py-3 text-center text-xs text-muted-foreground sm:flex-row sm:gap-2 sm:py-4 sm:text-left">
          <span>© {new Date().getFullYear()} {t.footer}</span>
          <span className="opacity-70">Powered by ESP32 · ThingSpeak · React</span>
        </div>
      </footer>

      {/* Sensor Config Dialog */}
      <SensorConfigDialog
        lang={lang}
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
      />
    </div>
  );
};

const Legend = ({ t }: { t: Dict }) => (
  <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3">
    <LegendDot color="bg-heat-high" label={`${t.high} >35°C`} />
    <LegendDot color="bg-heat-mod" label={`${t.moderate} 28–35°C`} />
    <LegendDot color="bg-safe" label={`${t.safe} <28°C`} />
  </div>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
    <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", color)} />
    {label}
  </span>
);

export default Index;
