import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

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

// Tilburg events met uitgebreidere beschrijvingen
const TILBURG_EVENTS = [
  {
    id: 1,
    title: "Jeugdvoetbaltoernooi groot succes",
    date: "2024-06-14",
    shortDescription:
      "Meer dan 500 kinderen deden mee aan het jaarlijkse toernooi in het Spoorpark.",
    description:
      "Het jaarlijkse jeugdvoetbaltoernooi in het Spoorpark heeft alle verwachtingen overtroffen. Meer dan 500 kinderen in de leeftijd van 8 tot 14 jaar namen deel aan het evenement, dat werd georganiseerd door lokale voetbalverenigingen in samenwerking met de gemeente Tilburg. Het toernooi, dat plaatsvond onder ideale weersomstandigheden, trok ruim 1500 bezoekers.\n\nNaast de wedstrijden waren er verschillende activiteiten georganiseerd, waaronder voetbalclinics door profspelers van Willem II en workshops over gezonde voeding voor jonge sporters. 'We zijn ontzettend trots op wat we hier hebben neergezet,' aldus toernooiorganisator Mark van Bergen. 'Het gaat niet alleen om het voetbal, maar vooral om het samenbrengen van kinderen uit verschillende wijken en het promoten van een gezonde levensstijl.'\n\nDe finale in de categorie onder 12 werd gewonnen door het team van FC Tilburg West, dat in een spannende wedstrijd met 3-2 won van Zwijsen United. Wethouder van Sport, Marie Hendrikx, reikte de prijzen uit en benadrukte het belang van dergelijke evenementen voor de sociale cohesie in de stad.",
    coords: [51.5644, 5.0813] as [number, number],
    location: "Spoorpark",
    category: "CULTUUR",
  },
  {
    id: 2,
    title: "Nieuwe fietsbrug geopend",
    date: "2024-06-13",
    shortDescription: "Moderne fietsbrug verbindt Noord en Oud-Noord.",
    description:
      "De langverwachte fietsbrug die Noord en Oud-Noord met elkaar verbindt is vandaag officieel geopend. Het innovatieve ontwerp, dat is gemaakt door het gerenommeerde architectenbureau Studio Bike, is niet alleen een functionele verbinding maar ook een architectonisch hoogstandje dat de skyline van Tilburg verrijkt.\n\nDe 120 meter lange brug is voorzien van slimme LED-verlichting die reageert op beweging, wat zorgt voor optimale veiligheid in de avonduren en tegelijkertijd energiezuinig is. De constructie is gemaakt van duurzame materialen en er zijn groene elementen geïntegreerd in het ontwerp, waaronder verticale tuinen aan beide zijden van de brug.\n\nWethouder van Infrastructuur, Peter de Vries, spreekt van een mijlpaal: 'Deze brug is meer dan een verbinding, het is een statement over hoe we de toekomst van mobiliteit in Tilburg zien. Door te investeren in fietsinfrastructuur maken we de stad niet alleen bereikbaarder, maar ook duurzamer.'\n\nDe brug, die een investering van 4,2 miljoen euro vergde, werd mede mogelijk gemaakt door subsidies van de provincie Noord-Brabant en de Europese Unie. Naar verwachting zullen dagelijks zo'n 5000 fietsers gebruik maken van deze nieuwe verbinding.",
    coords: [51.575, 5.0877] as [number, number],
    location: "Noord",
    category: "LEEFOMGEVING",
  },
  {
    id: 3,
    title: "Kunstroute in de binnenstad",
    date: "2024-06-12",
    shortDescription: "Tentoonstelling van lokale kunstenaars in het centrum.",
    description:
      "De binnenstad van Tilburg is deze maand het toneel van een bijzondere kunstroute waarbij meer dan 30 lokale kunstenaars hun werk tentoonstellen in etalages, steegjes en op pleinen. Het project, getiteld 'Kunst in de Stad', is een initiatief van Kunstcollectief Tilburg in samenwerking met de gemeente en lokale ondernemers.\n\nBezoekers kunnen via een speciale app een interactieve route volgen langs verschillende kunstwerken, variërend van street art en sculpturen tot digitale installaties. Bij elk kunstwerk is informatie beschikbaar over de kunstenaar en het creatieve proces. Bijzonder aan deze editie is de focus op duurzaamheid; veel kunstwerken zijn gemaakt van gerecyclede materialen.\n\nKunsthistoricus en curator Maria Jansen licht toe: 'We zien dat kunst steeds meer de publieke ruimte opzoekt. Door deze route maken we kunst toegankelijk voor iedereen en geven we tegelijkertijd een podium aan lokaal talent. Enkele deelnemende kunstenaars hebben zelfs al interesse gewekt bij nationale galeries.'\n\nDe route is dagelijks te bezoeken en loopt nog tot eind juli. In de weekenden zijn er extra activiteiten zoals workshops en ontmoetingen met de kunstenaars. Ook verschillende horecagelegenheden langs de route doen mee met speciale kunstzinnige menu's en exposities.",
    coords: [51.556, 5.0913] as [number, number],
    location: "Centrum",
    category: "CULTUUR",
  },
  {
    id: 4,
    title: "Marktplein vernieuwd",
    date: "2024-06-11",
    shortDescription: "Grote renovatie van het marktplein afgerond.",
    description:
      "Na een intensieve renovatieperiode van acht maanden is het historische marktplein van Tilburg weer open voor publiek. De renovatie, die 3,5 miljoen euro kostte, heeft het plein getransformeerd tot een moderne, multifunctionele ruimte met respect voor het historische karakter.\n\nDe belangrijkste veranderingen omvatten nieuwe bestrating met natuursteen, een slim watermanagementsysteem voor betere afwatering, en flexibele voorzieningen voor evenementen. Ook is er meer groen toegevoegd met de plaatsing van volwassen bomen en zijn er nieuwe zitgelegenheden gecreëerd met materialen die refereren aan Tilburgs textielverleden.\n\nStadshistoricus Dr. Jan van der Meer is enthousiast: 'Het marktplein is al eeuwenlang het kloppend hart van Tilburg. Deze renovatie bewijst dat je historie en moderniteit uitstekend kunt combineren. De nieuwe elementen vertellen het verhaal van de stad, terwijl ze tegelijkertijd vooruitkijken naar de toekomst.'\n\nDe weekmarkt, die tijdens de renovatie tijdelijk was verplaatst, keert terug in een vernieuwde opstelling die meer ruimte biedt aan lokale ondernemers. Ook zijn er voorzieningen aangebracht voor evenementen zoals het zomerfestival en de kerstmarkt. De ondergrondse infrastructuur is volledig vernieuwd en voorbereid op toekomstige ontwikkelingen.",
    coords: [51.5529, 5.0874] as [number, number],
    location: "Marktplein",
    category: "SAMENLEVING",
  },
  {
    id: 5,
    title: "Nieuwe speeltuin geopend",
    date: "2024-06-10",
    shortDescription:
      "Moderne speeltuin in het Wilhelminapark toegankelijk voor alle kinderen.",
    description:
      "Het Wilhelminapark heeft er een bijzondere attractie bij: een inclusieve speeltuin die toegankelijk is voor alle kinderen, ongeacht hun fysieke mogelijkheden. Het project, dat tot stand kwam door nauwe samenwerking tussen de gemeente, buurtbewoners en expertisecentrum Special Kids, is uniek in zijn soort voor de regio.\n\nDe speeltuin beschikt over speciale toestellen die zowel door kinderen met als zonder beperking gebruikt kunnen worden, waaronder een rolstoeltoegankelijke schommel, een zintuigentuin en interactieve speelelementen. Het ontwerp is gebaseerd op uitgebreid onderzoek naar inclusief spelen en input van lokale gezinnen.\n\nProjectleider Sarah Vermeulen vertelt: 'We hebben bewust gekozen voor een ontwerp dat kinderen samenbrengt. Er zijn geen aparte zones voor verschillende doelgroepen; alle speeltoestellen zijn zo ontworpen dat ze door iedereen gebruikt kunnen worden. Dit bevordert natuurlijke interactie tussen alle kinderen.'\n\nNaast de speeltoestellen is er ook gedacht aan voorzieningen voor ouders en begeleiders, met comfortabele zitplaatsen en een overdekt gedeelte. De gemeente heeft aangekondigd dat dit project als voorbeeld zal dienen voor toekomstige speeltuinrenovaties in andere wijken.",
    coords: [51.5658, 5.0986] as [number, number],
    location: "Wilhelminapark",
    category: "SAMENLEVING",
  },
  {
    id: 6,
    title: "Buurtfeest in de Reeshof",
    date: "2024-06-09",
    shortDescription: "Groot buurtfeest met live muziek en activiteiten.",
    description:
      "Het jaarlijkse buurtfeest in de Reeshof heeft dit weekend alle records gebroken met meer dan 3000 bezoekers. Het evenement, dat dit jaar voor de tiende keer werd georganiseerd, stond in het teken van culturele diversiteit en duurzaamheid.\n\nOp vijf verschillende podia waren optredens te zien van lokale muzikanten, dansgroepen en theatergezelschappen. Een van de hoogtepunten was het 'Wereldkeuken Festival' waar bewoners uit verschillende culturen hun traditionele gerechten presenteerden. Nieuw dit jaar was de 'Groene Markt' waar lokale initiatieven op het gebied van duurzaamheid zich presenteerden.\n\nBuurtcoördinator Ahmed El Mansouri is trots: 'Dit feest laat zien hoe divers en betrokken onze wijk is. Het is geweldig om te zien hoe mensen van verschillende achtergronden samenkomen en elkaar beter leren kennen door muziek, dans en natuurlijk het eten.'\n\nHet kinderprogramma was dit jaar uitgebreider dan ooit met workshops circuskunsten, een skateclinic en verschillende sportactiviteiten. Ook was er speciale aandacht voor ouderen met een nostalgische hoek waar oude ambachten werden gedemonstreerd en verhalen over de geschiedenis van de wijk werden gedeeld.",
    coords: [51.5808, 5.0125] as [number, number],
    location: "Reeshof",
    category: "CULTUUR",
  },
  {
    id: 7,
    title: "Bibliotheek vernieuwd",
    date: "2024-06-08",
    shortDescription: "Moderne bibliotheek met nieuwe studieruimtes.",
    description:
      "De LocHal heeft een grote transformatie ondergaan met de opening van een hypermoderne bibliotheekruimte die veel meer biedt dan alleen boeken. De vernieuwde ruimte is ontworpen als een 'kennis- en innovatiehub' waar traditioneel bibliotheekwerk wordt gecombineerd met moderne technologie en flexibele werkplekken.\n\nDe nieuwe faciliteiten omvatten een podcast-studio, een makerspace met 3D-printers en lasersnijders, en verschillende studieruimtes die zijn uitgerust met de nieuwste audiovisuele technologie. Er is speciale aandacht besteed aan duurzaamheid, met energiezuinige verlichting en meubilair van gerecyclede materialen.\n\nHoofdbibliothecaris Emma van Dongen licht toe: 'Een moderne bibliotheek moet meer zijn dan een verzameling boeken. We hebben deze ruimte zo ingericht dat ze uitnodigt tot leren, creëren en ontmoeten. De combinatie van historische industriële architectuur met moderne faciliteiten creëert een unieke sfeer.'\n\nBijzonder is ook het nieuwe educatieve programma dat samen met lokale scholen en onderwijsinstellingen is ontwikkeld. Er worden workshops gegeven over digitale vaardigheden, mediawijsheid en creatief schrijven. Ook is er een speciale jongerenafdeling ingericht waar scholieren en studenten kunnen studeren en samenwerken.",
    coords: [51.5605, 5.0836] as [number, number],
    location: "LocHal",
    category: "SAMENLEVING",
  },
  {
    id: 8,
    title: "Sportevenement in het Sportpark",
    date: "2024-06-07",
    shortDescription: "Jaarlijks sportevenement voor alle leeftijden.",
    description:
      "Het Willem II Stadion was afgelopen weekend het toneel van een groots opgezet sportevenement dat verschillende sporten en generaties samenbracht. Het evenement, georganiseerd door de Tilburgse Sportraad in samenwerking met lokale sportverenigingen, trok meer dan 2000 deelnemers in alle leeftijdscategorieën.\n\nHet programma omvatte traditionele sporten zoals voetbal en atletiek, maar ook nieuwe urban sports zoals freerunning en skateboarden. Een speciale attractie was de 'e-sports arena' waar gaming en beweging werden gecombineerd. Professionals uit verschillende sportdisciplines waren aanwezig om clinics te geven en jong talent te scouten.\n\nSportcoördinator Tim de Groot vertelt: 'We wilden laten zien dat sport voor iedereen is, ongeacht leeftijd of niveau. Het was geweldig om te zien hoe kinderen die normaal alleen gamen, enthousiast raakten over physical e-sports en hoe ouderen nieuwe sporten ontdekten die ze nog nooit hadden geprobeerd.'\n\nNaast de sportactiviteiten was er veel aandacht voor gezondheid en voeding, met workshops over sportvoeding, blessurepreventie en mentale weerbaarheid. Het evenement werd afgesloten met een spectaculaire demonstratie van urban sports onder LED-verlichting.",
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

// Custom slider styles
const sliderStyles = `
  .news-age-slider {
    width: 100%;
    height: 4px;
    background: #e5e7eb; /* Tailwind gray-200 */
    border-radius: 2px;
    outline: none;
    margin-top: 0.5rem;
  }
  .news-age-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #111827; /* Tailwind gray-900 (zwart) */
    cursor: pointer;
    margin-top: -7px; /* Center thumb on track, fine-tuned */
    transition: background 0.2s;
    border: none;
    box-shadow: none;
  }
  .news-age-slider:focus::-webkit-slider-thumb {
    outline: none;
  }
  .news-age-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #111827;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    box-shadow: none;
  }
  .news-age-slider:focus::-moz-range-thumb {
    outline: none;
  }
  .news-age-slider::-ms-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #111827;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    box-shadow: none;
  }
  .news-age-slider:focus::-ms-thumb {
    outline: none;
  }
  .news-age-slider::-ms-fill-lower {
    background: #e5e7eb;
  }
  .news-age-slider::-ms-fill-upper {
    background: #e5e7eb;
  }
  .news-age-slider::-webkit-slider-runnable-track {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
  }
  .news-age-slider::-moz-range-track {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
  }
  .news-age-slider:focus {
    outline: none;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = sliderStyles;
  document.head.appendChild(style);
}

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

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const modalRoot = document.body;
  return createPortal(children, modalRoot);
};

export default function Wijkverkenner() {
  const [location, setLocation] = useInitialLocation();
  const [postcodeInput, setPostcodeInput] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [lastSearchedLabel, setLastSearchedLabel] = useState<string | null>(
    null
  );
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof TILBURG_EVENTS)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newsAgeMin, setNewsAgeMin] = useState(1);
  const [newsAgeMax, setNewsAgeMax] = useState(60);

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

  // Effect voor body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <SidebarProvider>
      <div
        className={`min-h-screen flex w-full bg-gray-50 overflow-x-hidden ${
          isModalOpen ? "overflow-hidden" : ""
        }`}
      >
        <AppSidebar />
        <main className="flex-1 flex flex-row h-[calc(100vh-0.5rem)] gap-6">
          {/* Zijmenu links */}
          <aside className="w-[340px] min-w-[260px] max-w-sm flex-shrink-0 flex flex-col gap-6 overflow-y-auto pt-2 pb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Wijkverkenner
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                  Ontdek wat er gebeurt in verschillende buurten. Op deze kaart
                  vind je actuele gebeurtenissen en activiteiten in
                  verschillende wijken in Nederland.
                </p>
                <form
                  className="flex items-center justify-center w-full mb-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (postcodeInput.trim()) {
                      setLoadingGeo(true);
                      setGeoError(null);
                      try {
                        const q = encodeURIComponent(postcodeInput.trim());
                        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=nl&limit=1`;
                        const res = await fetch(url, {
                          headers: { "Accept-Language": "nl" },
                        });
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
                        setGeoError(
                          "Er is iets misgegaan bij het zoeken naar de locatie."
                        );
                      } finally {
                        setLoadingGeo(false);
                      }
                    }
                  }}
                >
                  <div className="w-full max-w-full flex gap-x-1">
                    <input
                      id="postcodeInput"
                      type="text"
                      className="flex-1 border border-gray-300 border-r-0 rounded-l-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 h-[44px]"
                      value={postcodeInput}
                      onChange={(e) => setPostcodeInput(e.target.value)}
                      onKeyDown={handleLocationInputKeyDown}
                      placeholder="Bijv. 5038 AA of Tilburg Centrum"
                      disabled={loadingGeo}
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    />
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-900 text-white w-12 h-[44px] rounded-r-md flex items-center justify-center disabled:opacity-60 border border-gray-300 border-l-0"
                      disabled={loadingGeo || !postcodeInput.trim()}
                      aria-label="Zoek locatie"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
                <div className="text-center text-gray-500 text-xs mb-2">of</div>
                <Button
                  onClick={handleUseMyLocation}
                  disabled={loadingGeo}
                  className="w-full"
                >
                  {loadingGeo ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                </Button>
                {geoError && (
                  <div className="mt-4 text-red-600">{geoError}</div>
                )}
              </div>
            </div>
            {/* Legenda */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Legenda</h3>
              <p className="text-sm text-gray-600 mb-4">
                Kies tussen de verschillende categorieën van gebeurtenissen.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(CATEGORIES).map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(isActive ? null : category.id)
                      }
                      className={
                        `${category.color} rounded-lg p-3 flex items-start gap-3 w-full text-left transition border border-transparent hover:border-slate-300` +
                        (isActive ? "border border-slate-800" : "")
                      }
                    >
                      <div
                        className={`w-4 h-4 mt-1 rounded-full flex-shrink-0 ${category.iconColor}`}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {category.name}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Filter: nieuwsleeftijd */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nieuws van maximaal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newsAgeMin}
                    onChange={(e) => setNewsAgeMin(Number(e.target.value))}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                    aria-label="Minimaal aantal dagen oud"
                  />
                  <span className="text-xs text-gray-500">tot</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newsAgeMax}
                    onChange={(e) => setNewsAgeMax(Number(e.target.value))}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                    aria-label="Maximaal aantal dagen oud"
                  />
                  <span className="text-xs text-gray-500">dagen oud</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={newsAgeMax}
                  onChange={(e) => setNewsAgeMax(Number(e.target.value))}
                  className="news-age-slider"
                  aria-label="Filter nieuwsleeftijd in dagen"
                />
              </div>
              {selectedCategory && (
                <button
                  className="mt-3 text-xs underline text-slate-700 hover:text-slate-900"
                  onClick={() => setSelectedCategory(null)}
                >
                  Toon alle categorieën
                </button>
              )}
            </div>
          </aside>
          {/* Rechterkolom: kaart en cards */}
          <section className="flex-1 flex flex-col gap-6 overflow-y-auto pt-2 pb-6 pr-4">
            <div>
              {/* Kaart */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <MapContainer
                  center={location.coords as LatLngExpression}
                  zoom={12}
                  style={{ height: "520px", width: "100%", maxWidth: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapAutoCenter coords={location.coords as LatLngExpression} />
                  {TILBURG_EVENTS.filter(
                    (ev) =>
                      !selectedCategory || ev.category === selectedCategory
                  ).map((item) => (
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
                        <div className="text-sm mb-2">
                          {item.shortDescription}
                        </div>
                        <div
                          className={`text-xs mb-2 px-2 py-1 rounded-full inline-block ${
                            CATEGORIES[item.category].color
                          }`}
                        >
                          {CATEGORIES[item.category].name}
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedEvent(item);
                            setIsModalOpen(true);
                          }}
                          size="sm"
                          className="w-full mt-2"
                        >
                          Bekijk nieuws
                        </Button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              {/* Cards */}
              <div className="mt-2">
                <h2 className="text-xl font-semibold mb-4 mt-8">
                  Actuele gebeurtenissen
                </h2>
                <div className="flex flex-wrap gap-4">
                  {TILBURG_EVENTS.filter(
                    (ev) =>
                      !selectedCategory || ev.category === selectedCategory
                  ).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedEvent(item);
                        setIsModalOpen(true);
                      }}
                      className="min-w-[280px] max-w-[320px] bg-white rounded-lg shadow p-4 flex-shrink-0 border border-gray-200 transition duration-150 cursor-pointer hover:bg-gray-50"
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedEvent(item);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      <div className="font-semibold text-base mb-1 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {item.date} - {item.location}
                      </div>
                      <div className="text-sm mb-2">
                        {item.shortDescription}
                      </div>
                      <div
                        className={`text-xs mb-2 px-2 py-1 rounded-full inline-block ${
                          CATEGORIES[item.category].color
                        }`}
                      >
                        {CATEGORIES[item.category].name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Modal voor event details */}
          {isModalOpen && selectedEvent && (
            <ModalPortal>
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Sluiten"
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-2">
                    {selectedEvent.title}
                  </h2>
                  <div className="text-xs text-gray-500 mb-1">
                    {selectedEvent.date} - {selectedEvent.location}
                  </div>
                  <div className="mb-4 whitespace-pre-line">
                    {selectedEvent.description}
                  </div>
                  <div
                    className={`text-xs mb-2 px-2 py-1 rounded-full inline-block ${
                      CATEGORIES[selectedEvent.category].color
                    }`}
                  >
                    {CATEGORIES[selectedEvent.category].name}
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}