import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FilterBar } from "@/components/FilterBar";
import { SignalCard } from "@/components/SignalCard";
import { AgendaWidget } from "@/components/AgendaWidget";
import { UntappedStories } from "@/components/UntappedStories";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface Signal {
  id: string;
  title: string;
  source: string;
  neighborhood: string;
  topic: string;
  time: string;
  content: string;
  priority: "high" | "medium" | "low";
  status: "new" | "follow-up" | "covered" | "ignored";
}

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const extractDomain = (url: string): string => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace("www.", "");
    } catch {
      return "Onbekend";
    }
  };

  const fetchSignals = async () => {
    const { data, error } = await supabase.from("signals").select("*");
    if (!error && data) {
      const mapped = data.map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source_name ?? "Onbekend",
        neighborhood: item.neighborhood ?? "Onbekend",
        topic: item.topic ?? "Algemeen",
        time: "1 uur geleden",
        content: item.content,
        priority: item.priority ?? "medium",
        status: item.status ?? "new",
      }));
      setSignals(mapped);
    }
  };

  useEffect(() => {
    fetchSignals();
    // eslint-disable-next-line
  }, []);

  const handleSignalAction = (
    signalId: string,
    action: "follow-up" | "covered" | "ignored"
  ) => {
    setSignals((prev) =>
      prev.map((signal) =>
        signal.id === signalId ? { ...signal, status: action } : signal
      )
    );
  };

  const filteredSignals =
    activeFilter === "all"
      ? signals.filter(
          (signal) =>
            searchQuery === "" ||
            signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            signal.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            signal.neighborhood
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            signal.topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : signals.filter(
          (signal) =>
            (signal.neighborhood.toLowerCase() === activeFilter.toLowerCase() ||
              signal.topic.toLowerCase() === activeFilter.toLowerCase()) &&
            (searchQuery === "" ||
              signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              signal.content
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              signal.neighborhood
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              signal.topic.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    RadarRedactie
                  </h1>
                  <p className="text-sm text-gray-600">
                    Omroep Tilburg - Nieuwssignalen Dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {signals.filter((s) => s.status === "new").length} nieuwe
                  signalen
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Zoek in signalen, wijken, onderwerpen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full max-w-md"
                />
              </div>

              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Signal Feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Dagelijkse Signalen Feed
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {filteredSignals.map((signal) => (
                      <SignalCard
                        key={signal.id}
                        signal={signal}
                        onAction={handleSignalAction}
                        refresh={fetchSignals}
                      />
                    ))}
                  </div>
                </div>

                {/* Widgets */}
                <div className="space-y-6">
                  <AgendaWidget />
                  <UntappedStories />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
