
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { FilterBar } from '@/components/FilterBar';
import { SignalCard } from '@/components/SignalCard';
import { AgendaWidget } from '@/components/AgendaWidget';
import { UntappedStories } from '@/components/UntappedStories';

export interface Signal {
  id: string;
  title: string;
  source: string;
  neighborhood: string;
  topic: string;
  time: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'follow-up' | 'covered' | 'ignored';
}

const mockSignals: Signal[] = [
  {
    id: '1',
    title: 'Bewoners klagen over geluidsoverlast bouwproject Koningsplein',
    source: 'Tilburg.nl Forum',
    neighborhood: 'Centrum',
    topic: 'Woningbouw',
    time: '2 uur geleden',
    content: 'Meerdere bewoners rapporteren geluidsoverlast vanaf 6:00 in de ochtend...',
    priority: 'high',
    status: 'new'
  },
  {
    id: '2',
    title: 'Gemeenteraad stemt over budget jeugdcentrum De Posthal',
    source: 'Raadsagenda',
    neighborhood: 'Noord',
    topic: 'Jeugd',
    time: '4 uur geleden',
    content: 'Besluitvorming over € 150.000 bezuiniging op jeugdvoorzieningen...',
    priority: 'medium',
    status: 'new'
  },
  {
    id: '3',
    title: 'Nieuwe fietsroute door Wandelbos officieel geopend',
    source: 'Persbericht Gemeente',
    neighborhood: 'West',
    topic: 'Verkeer',
    time: '6 uur geleden',
    content: 'Wethouder opent nieuwe 2,5 km fietsroute met verbinding naar centrum...',
    priority: 'low',
    status: 'covered'
  }
];

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [signals, setSignals] = useState<Signal[]>(mockSignals);

  const handleSignalAction = (signalId: string, action: 'follow-up' | 'covered' | 'ignored') => {
    setSignals(prev => 
      prev.map(signal => 
        signal.id === signalId 
          ? { ...signal, status: action } 
          : signal
      )
    );
  };

  const filteredSignals = activeFilter === 'all' 
    ? signals 
    : signals.filter(signal => 
        signal.neighborhood.toLowerCase() === activeFilter.toLowerCase() ||
        signal.topic.toLowerCase() === activeFilter.toLowerCase()
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
                  <h1 className="text-2xl font-semibold text-gray-900">RadarRedactie</h1>
                  <p className="text-sm text-gray-600">Omroep Tilburg - Nieuwssignalen Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {signals.filter(s => s.status === 'new').length} nieuwe signalen
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Filter Bar */}
              <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Signal Feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Dagelijkse Signalen Feed</h2>
                    <Button variant="outline" size="sm">
                      Ververs
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredSignals.map((signal) => (
                      <SignalCard 
                        key={signal.id} 
                        signal={signal} 
                        onAction={handleSignalAction}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column - Widgets */}
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
