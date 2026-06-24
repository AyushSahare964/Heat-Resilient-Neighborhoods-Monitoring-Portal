import { useEffect, useRef, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Sensor } from "@/lib/sensors";
import { Lang } from "@/lib/i18n";
import { Activity, Thermometer, Droplets, Info } from "lucide-react";

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C_TEMP = "#c0392b"; // heat-high red
const C_HUM  = "#6b7fad"; // muted blue-grey (signals estimated data)
const C_MOD  = "#f07720"; // saffron

const MAX_POINTS = 20;

/* ── Types ───────────────────────────────────────────────────────────────── */
interface HistoryPoint {
  time: string;
  temperature: number;
  humidity: number; // estimated
}

/* ── Pulsing dot on the latest data point ───────────────────────────────── */
const PulseDot = (props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
}) => {
  const { cx = 0, cy = 0, index = 0, dataLength = 0 } = props;
  if (index !== dataLength - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={C_TEMP} />
      <circle cx={cx} cy={cy} r={5} fill={C_TEMP} opacity={0.3}>
        <animate attributeName="r" from="5" to="17" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.3" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </g>
  );
};

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-elevated">
      <p className="mb-1.5 font-semibold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}:{" "}
          {p.name.includes("Humidity")
            ? `${p.value}% (est.)`
            : `${p.value}°C`}
        </p>
      ))}
    </div>
  );
};

/* ── Per-sensor chart panel ──────────────────────────────────────────────── */
interface PanelProps {
  index: number;        // 0 or 1
  sensor: Sensor;
  history: HistoryPoint[];
  field: string;        // "field1" or "field2"
  lang: Lang;
}

function SensorPanel({ index, sensor, history, field, lang }: PanelProps) {
  const noData = history.length === 0;
  const latest = history.at(-1);
  const gradId = `humGrad${index}`;

  return (
    <div className="p-4 sm:p-5">
      {/* Panel header row */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          {/* Location badge */}
          <div className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              Location {index + 1}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {field} → Temperature
            </span>
          </div>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {sensor.id} &mdash;{" "}
            <span className="font-normal text-muted-foreground text-xs">
              {lang === "mr" ? sensor.streetMr : sensor.street}
            </span>
          </p>
        </div>

        {/* Live stat pills */}
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-heat-high/25 bg-heat-high-soft px-2 py-0.5 text-[11px] font-semibold text-heat-high">
            <Thermometer className="h-3 w-3" />
            {latest ? `${latest.temperature}°C` : "—"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Droplets className="h-3 w-3" />
            {latest ? `${latest.humidity}%` : "—"}
            <span className="text-[9px] opacity-70">est.</span>
          </span>
        </div>
      </div>

      {/* Chart or waiting state */}
      {noData ? (
        <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          <span className="animate-pulse">Waiting for first reading…</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={history}
            margin={{ top: 8, right: 18, left: -14, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C_HUM} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C_HUM} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(216 25% 88%)"
              vertical={false}
            />

            {/* Heat thresholds */}
            <ReferenceLine
              yAxisId="temp"
              y={35}
              stroke={C_TEMP}
              strokeDasharray="5 3"
              strokeOpacity={0.4}
              label={{ value: "35°C", position: "insideTopRight", fill: C_TEMP, fontSize: 9 }}
            />
            <ReferenceLine
              yAxisId="temp"
              y={28}
              stroke={C_MOD}
              strokeDasharray="5 3"
              strokeOpacity={0.4}
              label={{ value: "28°C", position: "insideTopRight", fill: C_MOD, fontSize: 9 }}
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(220 15% 48%)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />

            {/* Left axis — real temperature */}
            <YAxis
              yAxisId="temp"
              domain={["auto", "auto"]}
              tick={{ fontSize: 9, fill: C_TEMP }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
              width={28}
            />

            {/* Right axis — estimated humidity */}
            <YAxis
              yAxisId="hum"
              orientation="right"
              domain={[40, 80]}
              tick={{ fontSize: 9, fill: C_HUM }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={28}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
            />

            {/* Humidity — estimated, subdued area */}
            <Area
              yAxisId="hum"
              type="monotone"
              dataKey="humidity"
              name="Humidity (est.)"
              stroke={C_HUM}
              strokeWidth={1.5}
              strokeDasharray="4 2"
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 3, fill: C_HUM }}
              isAnimationActive={false}
            />

            {/* Temperature — real data, bold solid line */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              name={`Temp · ${field}`}
              stroke={C_TEMP}
              strokeWidth={2.5}
              dot={(props) => (
                <PulseDot
                  key={`dot-${index}-${props.index}`}
                  {...props}
                  dataLength={history.length}
                />
              )}
              activeDot={{ r: 5, fill: C_TEMP }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {/* Footer: reading count + humidity note */}
      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 opacity-70">
          <Info className="h-3 w-3" />
          Humidity is estimated (~60% baseline); no sensor data available.
        </span>
        <span>{history.length} / {MAX_POINTS} pts</span>
      </div>
    </div>
  );
}

/* ── Field mapping ───────────────────────────────────────────────────────── */
const SENSOR_FIELD = ["field1", "field2"]; // index → ThingSpeak field

/* ── Main export ─────────────────────────────────────────────────────────── */
interface Props {
  sensors: Sensor[];
  lang: Lang;
}

export function LiveChart({ sensors, lang }: Props) {
  // Independent history per sensor id
  const [histories, setHistories] = useState<Map<string, HistoryPoint[]>>(
    () => new Map()
  );
  const prevRef = useRef<Map<string, { temperature: number }>>(new Map());

  useEffect(() => {
    if (!sensors.length) return;

    const time = new Date().toLocaleTimeString("en-IN", { hour12: false });

    setHistories((prev) => {
      const next = new Map(prev);
      let changed = false;

      sensors.forEach((s) => {
        const last = prevRef.current.get(s.id);
        // Only append when temperature actually changed (new ThingSpeak poll)
        if (last?.temperature === s.temperature) return;

        prevRef.current.set(s.id, { temperature: s.temperature });

        const existing = prev.get(s.id) ?? [];
        next.set(s.id, [
          ...existing,
          { time, temperature: s.temperature, humidity: s.humidity },
        ].slice(-MAX_POINTS));
        changed = true;
      });

      return changed ? next : prev;
    });
  }, [sensors]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-3">
        <div>
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground sm:text-base">
            <Activity className="h-4 w-4 text-primary" />
            {lang === "mr" ? "रिअल-टाइम ग्राफ" : "Real-Time Temperature Graph"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {lang === "mr"
              ? "field1 = T1 · field2 = T2 — ThingSpeak Ch. 3364129"
              : "field1 = T1 (Location 1) · field2 = T2 (Location 2) — ThingSpeak Ch. 3364129"}
          </p>
        </div>

        {/* LIVE badge */}
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-heat-high/30 bg-heat-high-soft px-2.5 py-0.5 text-[11px] font-bold text-heat-high">
          <span
            className="h-2 w-2 rounded-full bg-heat-high"
            style={{ animation: "heat-ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
          />
          LIVE
        </span>
      </div>

      {/* Two sensor panels separated by a divider */}
      <div className="divide-y divide-border">
        {sensors.map((sensor, i) => (
          <SensorPanel
            key={sensor.id}
            index={i}
            sensor={sensor}
            history={histories.get(sensor.id) ?? []}
            field={SENSOR_FIELD[i] ?? "field1"}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}
