import { Fragment, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sensor, zoneOf } from "@/lib/sensors";
import { Lang, translations } from "@/lib/i18n";

const zoneColor: Record<string, string> = {
  high: "hsl(0, 78%, 48%)",
  mod: "hsl(26, 95%, 52%)",
  safe: "hsl(142, 65%, 35%)",
};

const makeIcon = (color: string): DivIcon =>
  L.divIcon({
    className: "",
    html: `<div class="heat-pulse" style="color:${color};width:18px;height:18px;background:${color};border:2px solid white;box-shadow:0 0 0 1px ${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

function FitBounds({ sensors }: { sensors: Sensor[] }) {
  const map = useMap();
  useEffect(() => {
    if (!sensors.length) return;
    const bounds = L.latLngBounds(sensors.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [sensors, map]);
  return null;
}

interface Props {
  sensors: Sensor[];
  lang: Lang;
}

export const HeatMap = ({ sensors, lang }: Props) => {
  const t = translations[lang];
  const center: [number, number] = sensors[0] ? [sensors[0].lat, sensors[0].lng] : [18.52, 73.84];

  return (
    /* Taller on desktop, compact on mobile */
    <div className="h-[260px] w-full overflow-hidden rounded-lg border border-border sm:h-[360px] md:h-[460px]">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}   /* disable scroll zoom for better mobile UX */
        touchZoom={true}
        dragging={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds sensors={sensors} />
        {sensors.map((s) => {
          const z = zoneOf(s.temperature);
          const color = zoneColor[z];
          return (
            <Fragment key={s.id}>
              <Circle
                center={[s.lat, s.lng]}
                radius={180}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.18, weight: 1.5 }}
              />
              <Marker position={[s.lat, s.lng]} icon={makeIcon(color)}>
                <Popup>
                  <div className="space-y-1 font-sans min-w-[150px]">
                    <p className="font-bold text-foreground">{lang === "mr" ? s.streetMr : s.street}</p>
                    <p className="text-xs text-muted-foreground">{s.id}</p>
                    <div className="flex gap-3 pt-1 text-sm">
                      <span style={{ color }}>🌡 {s.temperature}°C</span>
                      <span>💧 {s.humidity}%</span>
                    </div>
                    <p className="pt-1 text-xs font-semibold" style={{ color }}>
                      {z === "high" ? t.high : z === "mod" ? t.moderate : t.safe}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};