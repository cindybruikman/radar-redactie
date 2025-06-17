import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Tilburg coordinates
const TILBURG_COORDS = [51.5555, 5.0913] as [number, number];

// Categorieën definitie
type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  iconColor: string;
  borderColor: string;
};

const CATEGORIES: Record<string, Category> = {
  SAMENLEVING: {
    id: "SAMENLEVING",
    name: "Samenleving & Gemeente",
    description:
      "Lokaal beleid, gemeenteraadsbesluiten, burgerinitiatieven, openbare voorzieningen, buurtprojecten",
    color: "bg-blue-100",
    iconColor: "bg-blue-500",
    borderColor: "#3b82f6",
  },
  VEILIGHEID: {
    id: "VEILIGHEID",
    name: "Veiligheid & Incidenten",
    description:
      "Politieberichten, ongelukken, branden, misdaad, openbare orde",
    color: "bg-red-100",
    iconColor: "bg-red-500",
    borderColor: "#ef4444",
  },
  CULTUUR: {
    id: "CULTUUR",
    name: "Cultuur & Evenementen",
    description:
      "Festivals, tentoonstellingen, theater, muziek, lokale talenten, verenigingen",
    color: "bg-yellow-100",
    iconColor: "bg-yellow-500",
    borderColor: "#eab308",
  },
  ONDERNEMEN: {
    id: "ONDERNEMEN",
    name: "Ondernemen & Werk",
    description:
      "Lokale ondernemers, winkels, horeca, vacatures, economische ontwikkelingen",
    color: "bg-orange-100",
    iconColor: "bg-orange-500",
    borderColor: "#f59e42",
  },
  LEEFOMGEVING: {
    id: "LEEFOMGEVING",
    name: "Leefomgeving & Mobiliteit",
    description: "Verkeer, infrastructuur, natuur, duurzaamheid, wonen, weer",
    color: "bg-green-100",
    iconColor: "bg-green-500",
    borderColor: "#22c55e",
  },
};

// Aangepaste events met categorieën
const TILBURG_EVENTS = [
  {
    id: 1,
    title: "Jeugdvoetbaltoernooi groot succes",
    date: "2024-06-14",
    description:
      "Meer dan 500 kinderen deden mee aan het jaarlijkse toernooi in het Spoorpark.",
    coords: [51.5644, 5.0813] as [number, number],
    location: "Spoorpark",
    category: "CULTUUR",
  },
  {
    id: 2,
    title: "Nieuwe fietsbrug geopend",
    date: "2024-06-13",
    description: "Moderne fietsbrug verbindt Noord en Oud-Noord.",
    coords: [51.575, 5.0877] as [number, number],
    location: "Noord",
    category: "LEEFOMGEVING",
  },
  {
    id: 3,
    title: "Kunstroute in de binnenstad",
    date: "2024-06-12",
    description: "Tentoonstelling van lokale kunstenaars in het centrum.",
    coords: [51.556, 5.0913] as [number, number],
    location: "Centrum",
    category: "CULTUUR",
  },
  {
    id: 4,
    title: "Marktplein vernieuwd",
    date: "2024-06-11",
    description: "Grote renovatie van het marktplein afgerond.",
    coords: [51.5529, 5.0874] as [number, number],
    location: "Marktplein",
    category: "SAMENLEVING",
  },
  {
    id: 5,
    title: "Nieuwe speeltuin geopend",
    date: "2024-06-10",
    description: "Moderne speeltuin in het Wilhelminapark.",
    coords: [51.5658, 5.0986] as [number, number],
    location: "Wilhelminapark",
    category: "SAMENLEVING",
  },
  {
    id: 6,
    title: "Buurtfeest in de Reeshof",
    date: "2024-06-09",
    description: "Groot buurtfeest met live muziek en activiteiten.",
    coords: [51.5808, 5.0125] as [number, number],
    location: "Reeshof",
    category: "CULTUUR",
  },
  {
    id: 7,
    title: "Bibliotheek vernieuwd",
    date: "2024-06-08",
    description: "Moderne bibliotheek met nieuwe studieruimtes.",
    coords: [51.5605, 5.0836] as [number, number],
    location: "LocHal",
    category: "SAMENLEVING",
  },
  {
    id: 8,
    title: "Sportevenement in het Sportpark",
    date: "2024-06-07",
    description: "Jaarlijks sportevenement voor alle leeftijden.",
    coords: [51.5424, 5.1104] as [number, number],
    location: "Willem II Stadion",
    category: "CULTUUR",
  },
];

// Marker icons voor verschillende categorieën
const categoryIcons = Object.fromEntries(
  Object.entries(CATEGORIES).map(([id, category]) => [
    id,
    L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin ${category.iconColor}"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    }),
  ])
);

// Voeg CSS toe voor markers
const markerStyles = `
  .marker-pin {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    position: relative;
    transform: rotate(-45deg);
    margin: -15px 0 0 -15px;
  }
  .marker-pin::after {
    content: '';
    width: 24px;
    height: 24px;
    margin: 3px 0 0 3px;
    background: #fff;
    position: absolute;
    border-radius: 50%;
  }
`;

// Voeg styles toe aan document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = markerStyles;
  document.head.appendChild(style);
}

// Default icon fix for Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function useInitialLocation() {
  const [location, setLocation] = useState<{ coords: LatLngExpression }>(
    () => ({ coords: TILBURG_COORDS })
  );
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
  const [location, setLocation] = useInitialLocation();
  const [postcodeInput, setPostcodeInput] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [lastSearchedLabel, setLastSearchedLabel] = useState<string | null>(
    null
  );

  // Probeer geolocatie op mount, maar update alleen als succesvol
  useEffect(() => {
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGeo(false);
        setGeoError(null);
        const { latitude, longitude } = pos.coords;
        setLocation({ coords: [latitude, longitude] });
      },
      (err) => {
        setLoadingGeo(false);
        setGeoError("Locatie niet beschikbaar.");
        // NIET opnieuw setLocation naar Tilburg, want dat is al de default
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
    // eslint-disable-next-line
  }, []);

  function handleUseMyLocation() {
    setLoadingGeo(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingGeo(false);
        setGeoError(null);
        const { latitude, longitude } = pos.coords;
        setLocation({ coords: [latitude, longitude] });
        setLastSearchedLabel(null);
        setHasSelectedLocation(true);
      },
      (err) => {
        setLoadingGeo(false);
        setGeoError("Locatie niet beschikbaar.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // Handler voor zoeken via Nominatim
  async function handleLocationInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && postcodeInput.trim()) {
      setLoadingGeo(true);
      setGeoError(null);
      try {
        const q = encodeURIComponent(postcodeInput.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=nl&limit=1`;
        const res = await fetch(url, { headers: { "Accept-Language": "nl" } });
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setLocation({ coords: [lat, lon] });
          setLastSearchedLabel(postcodeInput.trim());
          setHasSelectedLocation(true);
        } else {
          setGeoError(
            "Locatie niet gevonden. Probeer een andere postcode of plaatsnaam."
          );
        }
      } catch {
        setGeoError("Er is iets misgegaan bij het zoeken naar de locatie.");
      } finally {
        setLoadingGeo(false);
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col p-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Wijkverkenner
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Ontdek wat er gebeurt in verschillende buurten. Op deze kaart
                  vind je actuele gebeurtenissen en activiteiten in
                  verschillende wijken in Nederland.
                </p>

                {!hasSelectedLocation ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">
                      Kies je locatie
                    </h2>
                    <p className="text-blue-700 mb-6">
                      Om te beginnen, kies een locatie door je postcode/plaats
                      in te vullen of gebruik je huidige locatie.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={postcodeInput}
                          onChange={(e) => setPostcodeInput(e.target.value)}
                          onKeyDown={handleLocationInputKeyDown}
                          placeholder="Bijv. 5038 AA of Tilburg Centrum"
                          disabled={loadingGeo}
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleUseMyLocation}
                        disabled={loadingGeo}
                      >
                        {loadingGeo ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Locatie ophalen...
                          </span>
                        ) : (
                          "Gebruik mijn locatie"
                        )}
                      </button>
                    </div>
                    {geoError && (
                      <div className="mt-4 text-red-600">{geoError}</div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voer een postcode of locatie in
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={postcodeInput}
                        onChange={(e) => setPostcodeInput(e.target.value)}
                        onKeyDown={handleLocationInputKeyDown}
                        placeholder="Bijv. 5038 AA of Tilburg Centrum"
                        disabled={loadingGeo}
                      />
                    </div>
                    <div className="md:self-end">
                      <button
                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleUseMyLocation}
                        disabled={loadingGeo}
                      >
                        {loadingGeo ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Locatie ophalen...
                          </span>
                        ) : (
                          "Gebruik mijn locatie"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasSelectedLocation && (
              <>
                {/* Legenda */}
                <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Legenda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.values(CATEGORIES).map((category) => (
                      <div
                        key={category.id}
                        className={`${category.color} rounded-lg p-3 flex items-start gap-3`}
                      >
                        <div
                          className={`w-4 h-4 mt-1 rounded-full flex-shrink-0 ${category.iconColor}`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locatie indicator */}
                <div className="mb-2 text-gray-700 text-sm">
                  {lastSearchedLabel
                    ? `Je bekijkt nu: ${lastSearchedLabel}`
                    : location.coords[0] === TILBURG_COORDS[0] &&
                      location.coords[1] === TILBURG_COORDS[1]
                    ? "Je bekijkt nu: Tilburg"
                    : `Je bekijkt nu: Je huidige locatie (${(
                        location.coords as number[]
                      )[0].toFixed(4)}, ${(
                        location.coords as number[]
                      )[1].toFixed(4)})`}
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <MapContainer
                    center={location.coords as LatLngExpression}
                    zoom={12}
                    style={{ height: "500px", width: "100%", maxWidth: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapAutoCenter
                      coords={location.coords as LatLngExpression}
                    />
                    {TILBURG_EVENTS.map((item) => (
                      <Marker
                        key={item.id}
                        position={item.coords as LatLngExpression}
                        icon={categoryIcons[item.category]}
                      >
                        <Popup>
                          <div className="font-semibold text-base mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            {item.date} - {item.location}
                          </div>
                          <div className="text-sm">{item.description}</div>
                          <div
                            className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                              CATEGORIES[item.category].color
                            }`}
                          >
                            {CATEGORIES[item.category].name}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Horizontale slider met nieuwsberichten */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Actuele gebeurtenissen
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {TILBURG_EVENTS.map((item) => (
                      <div
                        key={item.id}
                        className={`min-w-[280px] max-w-[320px] bg-white rounded-lg shadow p-4 flex-shrink-0 border-l-4 hover:shadow-md transition`}
                        style={{
                          borderLeftColor:
                            CATEGORIES[item.category].borderColor,
                        }}
                      >
                        <div
                          className="font-semibold text-lg mb-1 truncate"
                          title={item.title}
                        >
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {item.date} - {item.location}
                        </div>
                        <div className="text-sm text-gray-700 line-clamp-3">
                          {item.description}
                        </div>
                        <div
                          className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                            CATEGORIES[item.category].color
                          }`}
                        >
                          {CATEGORIES[item.category].name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
