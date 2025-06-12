
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Globe, Plus, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  type: 'website' | 'forum' | 'social' | 'official' | 'rss';
  url: string;
  status: 'active' | 'inactive' | 'error';
  lastScanned: string;
  signalsFound: number;
  priority: 'high' | 'medium' | 'low';
}

const mockSources: Source[] = [
  {
    id: '1',
    name: 'Tilburg.nl Forum',
    type: 'forum',
    url: 'https://forum.tilburg.nl',
    status: 'active',
    lastScanned: '10 min geleden',
    signalsFound: 12,
    priority: 'high'
  },
  {
    id: '2',
    name: 'Gemeente Tilburg - Persberichten',
    type: 'official',
    url: 'https://tilburg.nl/nieuws',
    status: 'active',
    lastScanned: '15 min geleden',
    signalsFound: 3,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Raadsagenda RSS',
    type: 'rss',
    url: 'https://tilburg.nl/raad/rss',
    status: 'active',
    lastScanned: '5 min geleden',
    signalsFound: 8,
    priority: 'high'
  },
  {
    id: '4',
    name: 'Buurtapp Tilburg-Noord',
    type: 'social',
    url: 'https://buurtapp.nl/tilburg-noord',
    status: 'inactive',
    lastScanned: '2 uur geleden',
    signalsFound: 0,
    priority: 'medium'
  },
  {
    id: '5',
    name: 'Wijkvereniging Centrum Website',
    type: 'website',
    url: 'https://wijkcentrum-tilburg.nl',
    status: 'error',
    lastScanned: '1 dag geleden',
    signalsFound: 1,
    priority: 'low'
  }
];

const BronnenBeheer = () => {
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);

  const getStatusIcon = (status: Source['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getStatusBadge = (status: Source['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status === 'active' ? 'Actief' : status === 'inactive' ? 'Inactief' : 'Fout'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Source['priority']) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={variants[priority]}>
        {priority === 'high' ? 'Hoog' : priority === 'medium' ? 'Gemiddeld' : 'Laag'}
      </Badge>
    );
  };

  const getTypeLabel = (type: Source['type']) => {
    const labels = {
      website: 'Website',
      forum: 'Forum',
      social: 'Sociaal',
      official: 'Officieel',
      rss: 'RSS Feed'
    };
    return labels[type];
  };

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
                  <h1 className="text-2xl font-semibold text-gray-900">Bronnen Beheer</h1>
                  <p className="text-sm text-gray-600">Beheer en configureer nieuwsbronnen voor RadarRedactie</p>
                </div>
              </div>
              <Dialog open={newSourceDialogOpen} onOpenChange={setNewSourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nieuwe Bron
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nieuwe Bron Toevoegen</DialogTitle>
                    <DialogDescription>
                      Voeg een nieuwe nieuwsbron toe aan het systeem.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Naam</Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">URL</Label>
                      <Input id="url" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Toevoegen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Totaal Bronnen</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sources.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actieve Bronnen</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {sources.filter(s => s.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Signalen Vandaag</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sources.reduce((sum, source) => sum + source.signalsFound, 0)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fouten</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {sources.filter(s => s.status === 'error').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sources Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Nieuwsbronnen</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Naam</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Prioriteit</TableHead>
                        <TableHead>Laatste Scan</TableHead>
                        <TableHead>Signalen</TableHead>
                        <TableHead>Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sources.map((source) => (
                        <TableRow key={source.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(source.status)}
                              {getStatusBadge(source.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{source.name}</div>
                              <div className="text-sm text-gray-500">{source.url}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeLabel(source.type)}</TableCell>
                          <TableCell>{getPriorityBadge(source.priority)}</TableCell>
                          <TableCell>{source.lastScanned}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{source.signalsFound}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked={source.status === 'active'} />
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BronnenBeheer;
