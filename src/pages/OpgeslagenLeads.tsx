
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Calendar, User, BookmarkX, Eye, Edit } from 'lucide-react';

interface SavedLead {
  id: string;
  title: string;
  description: string;
  savedBy: string;
  savedDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'research' | 'in-progress' | 'completed' | 'archived';
  sourceType: string;
  neighborhood?: string;
  notes: string;
  tags: string[];
}

const mockSavedLeads: SavedLead[] = [
  {
    id: '1',
    title: 'Geluidsoverlast bouwproject Koningsplein',
    description: 'Bewoners klagen over vroege werkzaamheden en trillingen door bouwproject',
    savedBy: 'Sarah de Jong',
    savedDate: '2024-01-15',
    category: 'Woningbouw',
    priority: 'high',
    status: 'research',
    sourceType: 'Forum',
    neighborhood: 'Centrum',
    notes: 'Contact opgenomen met omwonenden. Gemeente heeft nog niet gereageerd.',
    tags: ['bouw', 'overlast', 'centrum']
  },
  {
    id: '2',
    title: 'Nieuwe fietsroute Wandelbos',
    description: 'Opening nieuwe fietsverbinding tussen Wandelbos en centrum',
    savedBy: 'Mark van Tilburg',
    savedDate: '2024-01-14',
    category: 'Verkeer',
    priority: 'medium',
    status: 'completed',
    sourceType: 'Persbericht',
    neighborhood: 'West',
    notes: 'Artikel gepubliceerd op 12 januari. Follow-up over gebruik na opening.',
    tags: ['fiets', 'infrastructuur', 'wandelbos']
  },
  {
    id: '3',
    title: 'Budget jeugdcentrum De Posthal',
    description: 'Gemeenteraad stemt over bezuiniging op jeugdvoorzieningen',
    savedBy: 'Lisa Peters',
    savedDate: '2024-01-13',
    category: 'Jeugd',
    priority: 'high',
    status: 'in-progress',
    sourceType: 'Raadsagenda',
    neighborhood: 'Noord',
    notes: 'Interview ingepland met wethouder en jeugdorganisaties.',
    tags: ['jeugd', 'bezuiniging', 'gemeenteraad']
  },
  {
    id: '4',
    title: 'Parkeerproblematiek winkelcentrum',
    description: 'Klachten over tekort aan parkeerplekken bij winkelcentrum Heuvel',
    savedBy: 'Tom Bakker',
    savedDate: '2024-01-10',
    category: 'Verkeer',
    priority: 'low',
    status: 'archived',
    sourceType: 'Social Media',
    neighborhood: 'Centrum',
    notes: 'Verhaal uitgesteld vanwege andere prioriteiten.',
    tags: ['parkeren', 'winkelcentrum', 'heuvel']
  }
];

const statusColors = {
  'research': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'archived': 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  'high': 'bg-red-100 text-red-800',
  'medium': 'bg-orange-100 text-orange-800',
  'low': 'bg-green-100 text-green-800'
};

export default function OpgeslagenLeads() {
  const [leads, setLeads] = useState<SavedLead[]>(mockSavedLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleRemoveLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const stats = {
    total: leads.length,
    research: leads.filter(l => l.status === 'research').length,
    inProgress: leads.filter(l => l.status === 'in-progress').length,
    completed: leads.filter(l => l.status === 'completed').length
  };

  return (
    <Layout 
      title="Opgeslagen Leads" 
      subtitle="Beheer je opgeslagen nieuwsaanleidingen en onderzoek"
      badgeText={`${stats.total} leads opgeslagen`}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Totaal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Onderzoek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.research}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Bewerking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Afgerond</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters en Zoeken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Zoek in leads, beschrijvingen en tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Alle statussen</option>
                <option value="research">In Onderzoek</option>
                <option value="in-progress">In Bewerking</option>
                <option value="completed">Afgerond</option>
                <option value="archived">Gearchiveerd</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Alle prioriteiten</option>
                <option value="high">Hoog</option>
                <option value="medium">Gemiddeld</option>
                <option value="low">Laag</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Opgeslagen Leads ({filteredLeads.length})</CardTitle>
            <CardDescription>
              Overzicht van alle opgeslagen nieuwsaanleidingen en hun voortgang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioriteit</TableHead>
                  <TableHead>Opgeslagen door</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{lead.title}</div>
                        <div className="text-sm text-gray-600">{lead.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {lead.neighborhood && (
                          <div className="text-xs text-gray-500">
                            📍 {lead.neighborhood} • {lead.sourceType}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>
                        {lead.status === 'research' && 'In Onderzoek'}
                        {lead.status === 'in-progress' && 'In Bewerking'}
                        {lead.status === 'completed' && 'Afgerond'}
                        {lead.status === 'archived' && 'Gearchiveerd'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[lead.priority]}>
                        {lead.priority === 'high' && 'Hoog'}
                        {lead.priority === 'medium' && 'Gemiddeld'}
                        {lead.priority === 'low' && 'Laag'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {lead.savedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{lead.savedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.savedDate).toLocaleDateString('nl-NL')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveLead(lead.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <BookmarkX className="w-4 h-4" />
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
    </Layout>
  );
}
