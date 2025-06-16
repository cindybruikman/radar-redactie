import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Fix Leaflet default marker icons
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock data for neighborhoods
const neighborhoods: Record<
  string,
  { coordinates: LatLngTuple; news: Array<{ type: string; count: number }> }
> = {
  Centrum: {
    coordinates: [51.5606, 5.0919] as LatLngTuple,
    news: [
      { type: "verkeer", count: 15 },
      { type: "woningbouw", count: 8 },
      { type: "jeugd", count: 12 },
      { type: "veiligheid", count: 10 },
    ],
  },
  Noord: {
    coordinates: [51.58, 5.1] as LatLngTuple,
    news: [
      { type: "verkeer", count: 10 },
      { type: "woningbouw", count: 12 },
      { type: "jeugd", count: 8 },
      { type: "veiligheid", count: 6 },
    ],
  },
  West: {
    coordinates: [51.56, 5.07] as LatLngTuple,
    news: [
      { type: "verkeer", count: 8 },
      { type: "woningbouw", count: 15 },
      { type: "jeugd", count: 9 },
      { type: "veiligheid", count: 7 },
    ],
  },
  Oost: {
    coordinates: [51.56, 5.11] as LatLngTuple,
    news: [
      { type: "verkeer", count: 12 },
      { type: "woningbouw", count: 6 },
      { type: "jeugd", count: 14 },
      { type: "veiligheid", count: 9 },
    ],
  },
  Zuid: {
    coordinates: [51.54, 5.0919] as LatLngTuple,
    news: [
      { type: "verkeer", count: 9 },
      { type: "woningbouw", count: 10 },
      { type: "jeugd", count: 11 },
      { type: "veiligheid", count: 8 },
    ],
  },
};

const themeColors = {
  verkeer: "red",
  woningbouw: "blue",
  jeugd: "green",
  veiligheid: "orange",
};

// Component to handle map updates when selected neighborhood changes
function MapUpdater({
  selectedNeighborhood,
}: {
  selectedNeighborhood: string;
}) {
  const map = useMap();

  useEffect(() => {
    const neighborhood =
      neighborhoods[selectedNeighborhood as keyof typeof neighborhoods];
    if (neighborhood) {
      map.setView(neighborhood.coordinates, 14);
    }
  }, [selectedNeighborhood, map]);

  return null;
}

export default function Wijkverkenner() {
  const [activeLayers, setActiveLayers] = useState({
    verkeer: true,
    woningbouw: true,
    jeugd: true,
    veiligheid: true,
  });

  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Centrum");
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    fetch("/tilburg-neighborhoods.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  const getNeighborhoodStyle = (feature: any) => {
    const neighborhood =
      neighborhoods[feature.properties.name as keyof typeof neighborhoods];
    if (!neighborhood) return { fillColor: "#ccc", fillOpacity: 0.3 };

    // Calculate total news count for the neighborhood
    const totalNews = neighborhood.news.reduce(
      (sum, item) => sum + item.count,
      0
    );

    // Calculate color based on active layers and news counts
    let color = "#ccc";
    let opacity = 0.3;

    if (totalNews > 0) {
      const activeNews = neighborhood.news.filter(
        (item) => activeLayers[item.type as keyof typeof activeLayers]
      );

      if (activeNews.length > 0) {
        // Use the color of the most frequent news type among active layers
        const dominantType = activeNews.reduce((prev, current) =>
          current.count > prev.count ? current : prev
        );
        color = themeColors[dominantType.type as keyof typeof themeColors];
        opacity = 0.6;
      }
    }

    return {
      fillColor: color,
      fillOpacity: opacity,
      weight: 2,
      color: "#666",
      opacity: 0.8,
    };
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1">
          <div className="flex h-[calc(100vh-4rem)] mt-16">
            {/* Sidebar */}
            <div className="w-80 border-r p-4 bg-background overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Wijkverkenner</h2>

              {/* Layer Controls */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Lagen</h3>
                {Object.entries(themeColors).map(([layer, color]) => (
                  <div key={layer} className="flex items-center space-x-2">
                    <Switch
                      id={layer}
                      checked={activeLayers[layer as keyof typeof activeLayers]}
                      onCheckedChange={(checked) =>
                        setActiveLayers((prev) => ({
                          ...prev,
                          [layer]: checked,
                        }))
                      }
                    />
                    <Label htmlFor={layer} className="capitalize">
                      {layer}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Neighborhood Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold">Wijken</h3>
                <Tabs defaultValue="Centrum" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    {Object.keys(neighborhoods).map((neighborhood) => (
                      <TabsTrigger
                        key={neighborhood}
                        value={neighborhood}
                        onClick={() => setSelectedNeighborhood(neighborhood)}
                      >
                        {neighborhood}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(neighborhoods).map(([name, data]) => (
                    <TabsContent key={name} value={name}>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Nieuwsactiviteit</h4>
                        {data.news.map((item) => (
                          <div
                            key={item.type}
                            className="flex justify-between mb-2"
                          >
                            <span className="capitalize">{item.type}</span>
                            <span>{item.count} berichten</span>
                          </div>
                        ))}
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <MapContainer
                center={[51.5606, 5.0919]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geoJson && (
                  <GeoJSON data={geoJson} style={getNeighborhoodStyle} />
                )}
                <MapUpdater selectedNeighborhood={selectedNeighborhood} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
