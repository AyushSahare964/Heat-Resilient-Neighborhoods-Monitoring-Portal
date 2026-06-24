import { useCallback, useEffect, useState } from "react";

export type Sensor = {
  id: string;
  street: string;
  streetMr: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;       // simulated — no real data available
  humidityEst: true;      // always true; flags UI to show "est." label
};

export type SensorBase = Omit<Sensor, "temperature" | "humidity" | "humidityEst">;

/**
 * Two sensor locations (Pune).
 * ThingSpeak channel 3364129:
 *   field1 → Temperature 1 (T1) — MH-PUN-01
 *   field2 → Temperature 2 (T2) — MH-PUN-02
 *   Humidity: no sensor data; a simulated value (~60 ± 5 %) is used.
 */
export const DEFAULT_BASE: SensorBase[] = [
  {
    id: "MH-PUN-01",
    street: "FC Road, Shivajinagar",
    streetMr: "एफ.सी. रोड, शिवाजीनगर",
    lat: 18.5236,
    lng: 73.8413,
  },
  {
    id: "MH-PUN-02",
    street: "JM Road, Deccan",
    streetMr: "जे.एम. रोड, डेक्कन",
    lat: 18.5167,
    lng: 73.84,
  },
];

const STORAGE_KEY = "rw-sensor-config";

function loadConfig(): SensorBase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SensorBase[];
      if (parsed.length !== DEFAULT_BASE.length) return DEFAULT_BASE;
      return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_BASE;
}

function saveConfig(bases: SensorBase[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bases));
}

/** Shared config state — singleton so all consumers stay in sync. */
let _configListeners: Array<(c: SensorBase[]) => void> = [];
let _currentConfig: SensorBase[] = loadConfig();

function notifyListeners() {
  _configListeners.forEach((fn) => fn([..._currentConfig]));
}

export function updateSensorConfig(bases: SensorBase[]) {
  _currentConfig = bases;
  saveConfig(bases);
  notifyListeners();
}

export function resetSensorConfig() {
  _currentConfig = DEFAULT_BASE.map((b) => ({ ...b }));
  saveConfig(_currentConfig);
  notifyListeners();
}

/** Hook: returns the current config and a setter. */
export function useSensorConfig() {
  const [config, setConfig] = useState<SensorBase[]>([..._currentConfig]);

  useEffect(() => {
    const handler = (c: SensorBase[]) => setConfig(c);
    _configListeners.push(handler);
    return () => {
      _configListeners = _configListeners.filter((fn) => fn !== handler);
    };
  }, []);

  const update = useCallback((bases: SensorBase[]) => {
    updateSensorConfig(bases);
  }, []);

  const reset = useCallback(() => {
    resetSensorConfig();
  }, []);

  return { config, update, reset };
}

/* ── ThingSpeak real-time fetch ─────────────────────────────────────────── */

const THINGSPEAK_URL = "/thingspeak/channels/3364129/feeds.json?results=1";

interface ThingSpeakFeed {
  field1: string | null; // T1 — temperature at MH-PUN-01 (°C)
  field2: string | null; // T2 — temperature at MH-PUN-02 (°C)
}

interface ThingSpeakResponse {
  feeds: ThingSpeakFeed[];
}

/** Simulated humidity: ~60% baseline with a small random jitter. */
function simulatedHumidity(): number {
  return +(58 + (Math.random() - 0.5) * 10).toFixed(1);
}

/** Maps field index to sensor: field1 → sensor[0], field2 → sensor[1] */
const TEMP_FIELDS: Array<keyof ThingSpeakFeed> = ["field1", "field2"];

async function fetchThingSpeakFeed(base: SensorBase[]): Promise<Sensor[]> {
  const res = await fetch(THINGSPEAK_URL);
  if (!res.ok) throw new Error(`ThingSpeak error: ${res.status}`);

  const json: ThingSpeakResponse = await res.json();
  const latest = json.feeds?.[0];

  return base.map((b, i) => {
    const field = TEMP_FIELDS[i] ?? "field1";
    const raw = latest?.[field];
    const temperature = raw != null ? parseFloat(raw) : NaN;

    return {
      ...b,
      temperature: isNaN(temperature) ? 0 : +temperature.toFixed(1),
      humidity: simulatedHumidity(),
      humidityEst: true,
    };
  });
}

export type Zone = "high" | "mod" | "safe";
export const zoneOf = (t: number): Zone =>
  t > 35 ? "high" : t >= 28 ? "mod" : "safe";

export function useSensors(intervalMs = 15_000) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { config } = useSensorConfig();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchThingSpeakFeed(_currentConfig);
      setSensors(data);
      setUpdatedAt(new Date());
    } catch (err) {
      console.error("ThingSpeak fetch failed:", err);
      setError("Could not reach ThingSpeak. Retrying…");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, refresh, config]);

  return { sensors, loading, updatedAt, refresh, error };
}