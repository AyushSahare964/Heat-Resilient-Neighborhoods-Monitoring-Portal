# 🌡️ Resilience Watch — Heat-Resilient Neighborhoods Monitoring Portal

> **Government of Maharashtra · Urban Climate Resilience Mission**  
> Real-time, street-level heat monitoring powered by ESP32, DHT22, and ThingSpeak.

![Live Monitoring](https://img.shields.io/badge/Live-Monitoring-brightgreen?style=for-the-badge&logo=wifi)
![IoT](https://img.shields.io/badge/Hardware-ESP32%20%2B%20DHT22-blue?style=for-the-badge&logo=espressif)
![Platform](https://img.shields.io/badge/Cloud-ThingSpeak-orange?style=for-the-badge)
![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react)

---

## 📋 Overview

**Resilience Watch** is an IoT-powered urban heat monitoring dashboard built for Maharashtra's Smart City initiative. It addresses the Urban Heat Island (UHI) problem in dense neighborhoods by providing:

- **Real-time temperature data** from ESP32 + DHT22 sensors deployed across Pune streets
- **Interactive heat maps** overlaid on OpenStreetMap (via Leaflet)
- **Automatic relay control** — mist fans and non-essential load shedding triggered at heat thresholds
- **Bilingual interface** — full support for English and Marathi (मराठी)
- **Live charts** for temperature trends over time
- **Actionable heat advisories** for citizens and ward officers

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        IoT Hardware Layer                        │
│  ESP32 + DHT22 × 2    ──► ThingSpeak (Channel 3364129)          │
│  MH-PUN-01 (FC Road)        field1 → Temperature 1              │
│  MH-PUN-02 (JM Road)        field2 → Temperature 2              │
└─────────────────────────────┬────────────────────────────────────┘
                              │  REST API (every 30s)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Web Dashboard (React)                      │
│  Vite + React 18 + TypeScript                                    │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ GovHeader      │  │  StatCards   │  │ HeatMap (Leaflet)    │ │
│  │ (EN/MR toggle) │  │ Avg/Peak T°  │  │ Color-coded zones    │ │
│  └────────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ SensorTable    │  │  LiveChart   │  │ RelayCard            │ │
│  │ Live readings  │  │  Recharts    │  │ Auto-trigger status  │ │
│  └────────────────┘  └──────────────┘  └──────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ContextSidebar — Problem / Solution / Sustainability info  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🌡️ Heat Zone Classification

| Zone        | Temperature    | Action Triggered                      |
|-------------|----------------|---------------------------------------|
| 🔴 High     | > 35 °C        | Deploy mist fans · Issue heat alert   |
| 🟡 Moderate | 28 °C – 35 °C  | Increase shade coverage · Hydration posts |
| 🟢 Safe     | < 28 °C        | Routine monitoring                    |

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Heat Map** | Leaflet-based map with color-coded sensor markers for Pune neighborhoods |
| 📊 **Live Charts** | Real-time temperature trend graphs using Recharts |
| ⚡ **Relay Control Panel** | Visualizes smart relay status (cooling loads, mist fans) |
| 📋 **Sensor Data Table** | Tabular view of live readings with zone classification |
| 🌐 **Bilingual UI** | English ↔ Marathi toggle with full UI translation |
| ⚙️ **Sensor Config Dialog** | Click-to-pin sensor positions on the map and save to localStorage |
| 🔔 **Heat Advisory Banner** | Dynamic banner with public advisories based on live data |
| 📱 **Responsive Design** | Fully optimized for mobile, tablet, and desktop |
| 🔄 **Auto-Refresh** | Data refreshes every **15 seconds** automatically |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|-----------|------|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) + Radix UI | Component library |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [TanStack Query v5](https://tanstack.com/query) | Server state management |
| [Recharts](https://recharts.org/) | Data visualization / live charts |
| [React Leaflet](https://react-leaflet.js.org/) | Interactive maps |
| [Lucide React](https://lucide.dev/) | Icons |

### IoT / Backend
| Technology | Role |
|-----------|------|
| **ESP32** | Microcontroller running sensor firmware |
| **DHT22** | Temperature & humidity sensor |
| [ThingSpeak](https://thingspeak.com/) | Cloud IoT data platform (Channel `3364129`) |

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) (or [Bun](https://bun.sh/))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd resilience-watch-main

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **[http://localhost:8080](http://localhost:8080)**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server on port 8080 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## ⚙️ Configuration

### ThingSpeak Channel

The app fetches data from ThingSpeak channel **`3364129`** via a Vite dev-server proxy (to avoid CORS issues):

```
/thingspeak/channels/3364129/feeds.json?results=1
  ↓ proxied to ↓
https://api.thingspeak.com/channels/3364129/feeds.json?results=1
```

- **`field1`** → Temperature at sensor `MH-PUN-01` (FC Road, Shivajinagar)
- **`field2`** → Temperature at sensor `MH-PUN-02` (JM Road, Deccan)
- **Humidity**: No physical sensor — a simulated value of `~60 ± 5%` is used and flagged as an estimate in the UI.

### Sensor Locations

Default sensor positions (configurable via the **Sensor Locations** dialog in the UI):

| Sensor ID | Location | Latitude | Longitude |
|-----------|----------|----------|-----------|
| `MH-PUN-01` | FC Road, Shivajinagar | 18.5236 | 73.8413 |
| `MH-PUN-02` | JM Road, Deccan | 18.5167 | 73.8400 |

Sensor configuration is persisted to **`localStorage`** under the key `rw-sensor-config`.

### Refresh Interval

Data auto-refreshes every **15 seconds** by default. This can be changed in [`src/pages/Index.tsx`](src/pages/Index.tsx):

```ts
const { sensors, loading, updatedAt, refresh, error } = useSensors(15_000);
//                                                                   ↑ ms
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── portal/
│   │   ├── GovHeader.tsx         # Government header with language toggle
│   │   ├── StatCard.tsx          # Summary stat card (Avg Temp, Peak, etc.)
│   │   ├── HeatMap.tsx           # Leaflet map with colored zone markers
│   │   ├── SensorTable.tsx       # Live sensor readings table
│   │   ├── LiveChart.tsx         # Real-time temperature line chart
│   │   ├── RelayCard.tsx         # Smart relay / cooling status panel
│   │   ├── ContextSidebar.tsx    # Problem / Solution / Sustainability info
│   │   └── SensorConfigDialog.tsx # Click-to-pin sensor config on map
│   └── ui/                       # shadcn/ui base components
├── hooks/
│   ├── use-mobile.tsx            # Responsive breakpoint hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   ├── sensors.ts                # ThingSpeak fetch, sensor config, hooks
│   ├── i18n.ts                   # English/Marathi translation dictionary
│   └── utils.ts                  # Tailwind class merge utility
├── pages/
│   ├── Index.tsx                 # Main dashboard page
│   └── NotFound.tsx              # 404 page
├── App.tsx                       # Router setup & providers
├── main.tsx                      # App entry point
└── index.css                     # Global styles & Tailwind config
```

---

## 🌐 Internationalization (i18n)

The portal is fully bilingual. Language is toggled via the header button.

| Language | Code | Coverage |
|----------|------|----------|
| English | `en` | Full UI |
| Marathi | `mr` | Full UI (मराठी) |

Translations live in [`src/lib/i18n.ts`](src/lib/i18n.ts).

---

## 🔌 Production Deployment

For production, set up a reverse proxy (e.g., Nginx) to forward ThingSpeak API calls to avoid browser CORS restrictions:

```nginx
location /thingspeak/ {
    proxy_pass https://api.thingspeak.com/;
    proxy_set_header Host api.thingspeak.com;
}
```

Then build and serve:

```bash
npm run build
# Serve the `dist/` folder with your preferred static file server
```

---

## 👨‍💻 Team

Developed by the following contributors as part of an IoT & Urban Resilience academic project:

| Name | Role |
|------|------|
| **Ayush Sahare** | Full-Stack Development, IoT Integration, ThingSpeak Setup |
| **Samyak Malame** | Hardware (ESP32 + DHT22), Firmware, Circuit Design |
| **Samruddhi Shinde** | UI/UX Design, Data Visualization, Documentation |

---

## 🤝 Contributing

This project is part of the **Maharashtra Urban Climate Resilience Mission**. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for a government-aligned urban resilience initiative. Please refer to the project maintainer for licensing details.

---

<div align="center">
  <sub>© Maharashtra Urban Climate Cell · Heat-Resilient Neighborhoods Mission</sub><br/>
  <sub>Powered by <strong>ESP32 · ThingSpeak · React</strong></sub><br/><br/>
  <sub>Developed with ❤️ by <strong>Ayush Sahare &nbsp;·&nbsp; Samyak Malame &nbsp;·&nbsp; Samruddhi Shinde</strong></sub>
</div>
