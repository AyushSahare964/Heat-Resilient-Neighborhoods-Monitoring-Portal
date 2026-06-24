export type Lang = "en" | "mr";

export type Dict = {
  portalTitle: string; portalSub: string; govOfMaha: string; digitalIndia: string;
  liveMonitoring: string; streetMap: string; streetMapSub: string; relayStatus: string;
  active: string; idle: string; sensorReadings: string; sensorReadingsSub: string;
  sensor: string; temperature: string; humidity: string; zone: string; action: string;
  avgTemp: string; peakTemp: string; avgHumidity: string; activeSensors: string;
  problem: string; problemBody: string; solution: string; solutionBody: string;
  sustain: string; sustainBody: string; high: string; moderate: string; safe: string;
  refresh: string; lastUpdated: string; advisory: string; advisoryHigh: string; advisoryOk: string;
  actionHigh: string; actionMod: string; actionSafe: string; threshold: string; footer: string;
  // Sensor config dialog
  sensorSettings: string; sensorSettingsSub: string; sensorSelect: string;
  streetNameEn: string; streetNameMr: string; clickMapToPin: string;
  saveConfig: string; resetDefault: string; configSaved: string;
  latitude: string; longitude: string;
};

export const translations: Record<Lang, Dict> = {
  en: {
    portalTitle: "Heat-Resilient Neighborhoods Monitoring Portal",
    portalSub: "Government of Maharashtra · Urban Climate Resilience Mission",
    govOfMaha: "Government of Maharashtra",
    digitalIndia: "Digital India Initiative",
    liveMonitoring: "Live Monitoring",
    streetMap: "Neighborhood Heat Map",
    streetMapSub: "Real-time street-level temperature zones",
    relayStatus: "Electric Load Status (Relay Control)",
    active: "Active — Cooling Engaged",
    idle: "Idle — Within Safe Limits",
    sensorReadings: "Live Sensor Readings",
    sensorReadingsSub: "DHT22 micro-climate sensors via ThingSpeak",
    sensor: "Sensor / Street",
    temperature: "Temp (°C)",
    humidity: "Humidity (%)",
    zone: "Zone",
    action: "Actionable Insight",
    avgTemp: "Avg. Temperature",
    peakTemp: "Peak Temperature",
    avgHumidity: "Avg. Humidity",
    activeSensors: "Active Sensors",
    problem: "Problem Context",
    problemBody:
      "Dense urban neighborhoods of Maharashtra suffer from Urban Heat Islands (UHI) — micro-zones where temperatures rise 4–6°C above surroundings. The lack of real-time, street-level monitoring delays public-health response and stresses the local electric grid.",
    solution: "Our Solution",
    solutionBody:
      "ESP32 + DHT22 sensors deployed across streets stream readings to ThingSpeak every 30 seconds. Smart relays auto-trigger mist fans and reduce non-essential load when heat thresholds are crossed.",
    sustain: "Sustainability Goal",
    sustainBody:
      "Community-driven maintenance with ward-level ownership, aligned with Maharashtra's Smart City development and net-zero urban targets.",
    high: "High Heat",
    moderate: "Moderate",
    safe: "Safe",
    refresh: "Refresh",
    lastUpdated: "Last updated",
    advisory: "Heat Advisory",
    advisoryHigh: "High-heat zone detected. Mist fans deployed. Avoid outdoor exposure 12–4 PM.",
    advisoryOk: "All neighborhoods within safe thermal limits. Continue routine monitoring.",
    actionHigh: "Deploy Mist Fans · Issue Heat Alert",
    actionMod: "Increase Shade Coverage · Hydration Posts",
    actionSafe: "Routine Monitoring",
    threshold: "Threshold > 35°C",
    footer: "Maharashtra Urban Climate Cell · Heat-Resilient Neighborhoods Mission",
    sensorSettings: "Sensor Locations",
    sensorSettingsSub: "Click on the map to pin the sensor position, then save.",
    sensorSelect: "Select Sensor",
    streetNameEn: "Street Name (English)",
    streetNameMr: "Street Name (Marathi)",
    clickMapToPin: "Click anywhere on the map to relocate this sensor.",
    saveConfig: "Save Configuration",
    resetDefault: "Reset to Defaults",
    configSaved: "Sensor configuration saved!",
    latitude: "Latitude",
    longitude: "Longitude",
  },
  mr: {
    portalTitle: "उष्णता-सहिष्णु परिसर निरीक्षण पोर्टल",
    portalSub: "महाराष्ट्र शासन · नागरी हवामान सक्षमता अभियान",
    govOfMaha: "महाराष्ट्र शासन",
    digitalIndia: "डिजिटल इंडिया उपक्रम",
    liveMonitoring: "थेट निरीक्षण",
    streetMap: "परिसर उष्णता नकाशा",
    streetMapSub: "रस्ता-स्तरीय तापमान विभाग रिअल-टाइम",
    relayStatus: "विद्युत भार स्थिती (रिले नियंत्रण)",
    active: "सक्रिय — शीतकरण सुरू",
    idle: "निष्क्रिय — सुरक्षित मर्यादेत",
    sensorReadings: "थेट सेन्सर वाचन",
    sensorReadingsSub: "DHT22 सूक्ष्म-हवामान सेन्सर ThingSpeak द्वारे",
    sensor: "सेन्सर / रस्ता",
    temperature: "तापमान (°से)",
    humidity: "आर्द्रता (%)",
    zone: "विभाग",
    action: "कृतीयोग्य सूचना",
    avgTemp: "सरासरी तापमान",
    peakTemp: "उच्चांक तापमान",
    avgHumidity: "सरासरी आर्द्रता",
    activeSensors: "सक्रिय सेन्सर",
    problem: "समस्या संदर्भ",
    problemBody:
      "महाराष्ट्रातील दाट शहरी भागात नागरी उष्ण बेटे (UHI) तयार होतात — जिथे तापमान आसपासच्या भागापेक्षा ४–६°से जास्त असते. रिअल-टाइम निरीक्षणाचा अभाव सार्वजनिक आरोग्य प्रतिसादाला विलंब करतो.",
    solution: "आमचे समाधान",
    solutionBody:
      "ESP32 + DHT22 सेन्सर रस्त्यांवर बसवून दर ३० सेकंदाला ThingSpeak वर डेटा पाठवतात. स्मार्ट रिले मिस्ट फॅन आपोआप सुरू करतात.",
    sustain: "शाश्वतता उद्दिष्ट",
    sustainBody:
      "समुदाय-चालित देखभाल व प्रभाग-स्तरीय मालकी, महाराष्ट्र स्मार्ट सिटी विकासाशी संलग्न.",
    high: "उच्च उष्णता",
    moderate: "मध्यम",
    safe: "सुरक्षित",
    refresh: "रिफ्रेश",
    lastUpdated: "शेवटचे अद्यतन",
    advisory: "उष्णता सूचना",
    advisoryHigh: "उच्च-उष्णता विभाग आढळला. मिस्ट फॅन सुरू. १२–४ दरम्यान बाहेर जाणे टाळा.",
    advisoryOk: "सर्व परिसर सुरक्षित मर्यादेत. नियमित निरीक्षण सुरू ठेवा.",
    actionHigh: "मिस्ट फॅन तैनात · उष्णता इशारा जारी",
    actionMod: "सावली वाढवा · पाणी केंद्र",
    actionSafe: "नियमित निरीक्षण",
    threshold: "मर्यादा > ३५°से",
    footer: "महाराष्ट्र नागरी हवामान कक्ष · उष्णता-सहिष्णु परिसर अभियान",
    sensorSettings: "सेन्सर स्थाने",
    sensorSettingsSub: "नकाशावर क्लिक करा, नंतर जतन करा.",
    sensorSelect: "सेन्सर निवडा",
    streetNameEn: "रस्त्याचे नाव (इंग्रजी)",
    streetNameMr: "रस्त्याचे नाव (मराठी)",
    clickMapToPin: "सेन्सर हलवण्यासाठी नकाशावर क्लिक करा.",
    saveConfig: "कॉन्फिगरेशन जतन करा",
    resetDefault: "डिफॉल्टवर रीसेट करा",
    configSaved: "सेन्सर कॉन्फिगरेशन जतन!",
    latitude: "अक्षांश",
    longitude: "रेखांश",
  },
};