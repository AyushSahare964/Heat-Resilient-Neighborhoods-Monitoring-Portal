import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Save, RotateCcw, X, Settings } from "lucide-react";
import { DEFAULT_BASE, SensorBase, useSensorConfig } from "@/lib/sensors";
import { Lang, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ── Leaflet default icon fix ───────────────────────────────────────────── */
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadowUrl, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

/* ── Map click handler ──────────────────────────────────────────────────── */
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

/* ── Recenter helper ────────────────────────────────────────────────────── */
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
}

/* ── Main dialog ────────────────────────────────────────────────────────── */
interface Props {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
}

export const SensorConfigDialog = ({ lang, isOpen, onClose }: Props) => {
  const t = translations[lang];
  const { config, update, reset } = useSensorConfig();

  const [selectedId, setSelectedId] = useState(config[0]?.id ?? "MH-PUN-01");
  const [draft, setDraft] = useState<SensorBase[]>(() => config.map((b) => ({ ...b })));
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync draft when dialog opens */
  useEffect(() => {
    if (isOpen) setDraft(config.map((b) => ({ ...b })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const selectedIdx = draft.findIndex((b) => b.id === selectedId);
  const selected = draft[selectedIdx];

  const patchSelected = (patch: Partial<SensorBase>) => {
    setDraft((prev) =>
      prev.map((b, i) => (i === selectedIdx ? { ...b, ...patch } : b))
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => {
    update(draft);
    showToast(t.configSaved);
  };

  const handleReset = () => {
    setDraft(DEFAULT_BASE.map((b) => ({ ...b })));
    reset();
    showToast(lang === "en" ? "Reset to defaults." : "डिफॉल्टवर रीसेट.");
  };

  const handleMapClick = (lat: number, lng: number) => {
    patchSelected({ lat, lng });
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog panel — bottom sheet on mobile, centered modal on sm+ */}
      <div className="relative z-[2001] flex w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:h-[90vh] sm:max-w-3xl sm:rounded-2xl"
           style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Settings className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-base font-bold text-foreground">{t.sensorSettings}</h2>
            <p className="text-xs text-muted-foreground">{t.sensorSettingsSub}</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — vertical on mobile, horizontal on sm+ */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5 sm:flex-row sm:overflow-hidden">
          {/* Left panel — controls */}
          <div className="flex w-full flex-col gap-3 sm:w-72 sm:shrink-0 sm:gap-4">
            {/* Sensor selector */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.sensorSelect}
              </label>
              <div className="flex flex-col gap-2">
                {draft.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                      selectedId === b.id
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-foreground hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold">{b.id}</div>
                      <div className="truncate text-[11px] opacity-70">{b.street}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <>
                {/* Street name EN */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.streetNameEn}
                  </label>
                  <input
                    value={selected.street}
                    onChange={(e) => patchSelected({ street: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Street name MR */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.streetNameMr}
                  </label>
                  <input
                    value={selected.streetMr}
                    onChange={(e) => patchSelected({ streetMr: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none ring-0 transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    dir="auto"
                  />
                </div>

                {/* Lat/Lng display */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.latitude}
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={selected.lat}
                      onChange={(e) => patchSelected({ lat: +parseFloat(e.target.value).toFixed(6) })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.longitude}
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={selected.lng}
                      onChange={(e) => patchSelected({ lng: +parseFloat(e.target.value).toFixed(6) })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <p className="rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
                  📍 {t.clickMapToPin}
                </p>
              </>
            )}

            {/* Action buttons */}
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                {t.saveConfig}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-heat-high/40 hover:bg-heat-high-soft hover:text-heat-high active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" />
                {t.resetDefault}
              </button>
            </div>
          </div>

          {/* Right panel — map */}
          <div className="relative flex-1 overflow-hidden rounded-xl border border-border" style={{ minHeight: 220 }}>
            {selected && (
              <MapContainer
                center={[selected.lat, selected.lng]}
                zoom={15}
                scrollWheelZoom
                className="h-full w-full"
                style={{ minHeight: 300 }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap lat={selected.lat} lng={selected.lng} />
                <ClickHandler onMapClick={handleMapClick} />
                {/* Show all sensor pins for context */}
                {draft.map((b) => (
                  <Marker
                    key={b.id}
                    position={[b.lat, b.lng]}
                    opacity={b.id === selectedId ? 1 : 0.45}
                  />
                ))}
              </MapContainer>
            )}

            {/* Map hint overlay */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              Click map to move <span className="font-semibold text-primary">{selectedId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[2100] -translate-x-1/2 rounded-full border border-safe/30 bg-safe-soft px-5 py-2.5 text-sm font-semibold text-safe shadow-lg">
          ✓ {toast}
        </div>
      )}
    </div>
  );
};
