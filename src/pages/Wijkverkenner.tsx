import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Dummy cities and news data
const CITIES = [
  { name: "Utrecht", coords: [52.0907, 5.1214] as [number, number] },
  { name: "Tilburg", coords: [51.5555, 5.0913] as [number, number] },
  { name: "Rotterdam", coords: [51.9225, 4.4792] as [number, number] },
  { name: "Amsterdam", coords: [52.3676, 4.9041] as [number, number] },
  { name: "Eindhoven", coords: [51.4416, 5.4697] as [number, number] },
];

const DUMMY_NEWS = [
  {
    id: 1,
    title: "Verkeersopstopping op de A2",
    date: "2024-06-16",
    description: "Lange files door ongeluk bij afslag.",
    coords: [52.091, 5.12] as [number, number],
    city: "Utrecht",
  },
  {
    id: 2,
    title: "Nieuwbouwproject gestart",
    date: "2024-06-15",
    description: "Start bouw 200 woningen in Leidsche Rijn.",
    coords: [52.08, 5.1] as [number, number],
    city: "Utrecht",
  },
  {
    id: 3,
    title: "Jeugdvoetbaltoernooi groot succes",
    date: "2024-06-14",
    description: "Meer dan 500 kinderen deden mee.",
    coords: [51.555, 5.09] as [number, number],
    city: "Tilburg",
  },
  {
    id: 4,
    title: "Brand in appartementencomplex",
    date: "2024-06-13",
    description: "Bewoners snel geëvacueerd, geen gewonden.",
    coords: [51.922, 4.48] as [number, number],
    city: "Rotterdam",
  },
  {
    id: 5,
    title: "Demonstratie op de Dam",
    date: "2024-06-12",
    description: "Vreedzaam protest voor klimaat.",
    coords: [52.372, 4.893] as [number, number],
    city: "Amsterdam",
  },
  {
    id: 6,
    title: "Innovatief fietspad geopend",
    date: "2024-06-11",
    description: "Eerste zonnefietspad van Nederland.",
    coords: [51.44, 5.47] as [number, number],
    city: "Eindhoven",
  },
];

// Default icon fix for Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CITY = CITIES[0];
const LS_KEY = "wijkverkenner:lastLocation";

function getNewsForCity(city: string) {
  return DUMMY_NEWS.filter((n) => n.city === city);
}

function getCityByName(name: string) {
  return CITIES.find((c) => c.name === name) || DEFAULT_CITY;
}

function getClosestCity(lat: number, lng: number) {
  let minDist = Infinity;
  let closest = DEFAULT_CITY;
  for (const city of CITIES) {
    const d = Math.hypot(city.coords[0] - lat, city.coords[1] - lng);
    if (d < minDist) {
      minDist = d;
      closest = city;
    }
  }
  return closest;
}

function usePersistedLocation() {
  const [location, setLocation] = useState<{
    city: string;
    coords: LatLngExpression;
  }>(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return { city: DEFAULT_CITY.name, coords: DEFAULT_CITY.coords };
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(location));
  }, [location]);

  return [location, setLocation] as const;
}

function MapAutoCenter({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (!first.current) {
      map.setView(coords, map.getZoom(), { animate: true });
    }
    first.current = false;
  }, [coords, map]);
  return null;
}

export default function Wijkverkenner() {
  const [location, setLocation] = usePersistedLocation();
  const [cityInput, setCityInput] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);

  const city = getCityByName(location.city);
  const news = getNewsForCity(city.name);

  // Try geolocation on mount if no manual city chosen
  useEffect(() => {
    if (location.city && location.city !== DEFAULT_CITY.name) return;
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGeo(false);
        setGeoError(null);
        const { latitude, longitude } = pos.coords;
        const closest = getClosestCity(latitude, longitude);
        setLocation({ city: closest.name, coords: [latitude, longitude] });
      },
      (err) => {
        setLoadingGeo(false);
        setGeoError("Locatie niet beschikbaar.");
        setLocation({ city: DEFAULT_CITY.name, coords: DEFAULT_CITY.coords });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
    // eslint-disable-next-line
  }, []);

  function handleCitySelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = getCityByName(e.target.value);
    setLocation({ city: selected.name, coords: selected.coords });
    setCityInput("");
  }

  function handleUseMyLocation() {
    setLoadingGeo(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGeo(false);
        setGeoError(null);
        const { latitude, longitude } = pos.coords;
        const closest = getClosestCity(latitude, longitude);
        setLocation({ city: closest.name, coords: [latitude, longitude] });
      },
      (err) => {
        setLoadingGeo(false);
        setGeoError("Locatie niet beschikbaar.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center py-8">
          <div className="w-full max-w-3xl mb-4 flex flex-col md:flex-row md:items-end gap-4 px-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kies een stad
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={city.name}
                onChange={handleCitySelect}
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleUseMyLocation}
              disabled={loadingGeo}
            >
              {loadingGeo ? "Locatie ophalen..." : "Gebruik mijn locatie"}
            </button>
          </div>
          {geoError && <div className="text-red-600 mb-2">{geoError}</div>}
          <div className="w-full max-w-3xl h-[60vh] rounded shadow overflow-hidden">
            <MapContainer
              center={location.coords as LatLngExpression}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapAutoCenter coords={location.coords as LatLngExpression} />
              {news.map((item) => (
                <Marker
                  key={item.id}
                  position={item.coords as LatLngExpression}
                >
                  <Popup>
                    <div className="font-semibold text-base mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {item.date}
                    </div>
                    <div className="text-sm">{item.description}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
