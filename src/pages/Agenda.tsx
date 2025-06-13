import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, FileText, ArrowRight, Bookmark } from 'lucide-react';
import { Layout } from '@/components/Layout';

const upcomingMeetings = [
  {
    id: '1',
    title: 'Raadsvergadering',
    date: '2024-06-13',
    time: '14:00',
    location: 'Raadzaal, Stadskantoor',
    type: 'Raadsvergadering',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Commissievergadering Ruimte',
    date: '2024-06-15',
    time: '10:00',
    location: 'Commissiekamer 1',
    type: 'Commissie',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Commissievergadering Samenleving',
    date: '2024-06-17',
    time: '14:30',
    location: 'Commissiekamer 2',
    type: 'Commissie',
    status: 'upcoming'
  }
];

const agendaItems = [
  {
    id: '1',
    meetingId: '1',
    title: 'Stemming budget jeugdcentrum De Posthal',
    description: 'Besluit over voorgestelde bezuiniging van € 150.000 op jeugdvoorzieningen in stadsdeel Noord',
    category: 'Jeugdbeleid',
    priority: 'high',
    documents: 3,
    estimatedDuration: '30 min',
    speakers: ['Wethouder Sociale Zaken', 'Fractievoorzitter CDA'],
    newsRelevance: 'high',
    angle: 'Impact op 200+ jongeren, mogelijke protesten verwacht'
  },
  {
    id: '2',
    meetingId: '1',
    title: 'Verkeersveiligheid Schoolstraat',
    description: 'Voorstel voor plaatsing zebrapaden en verkeersdrempels nabij basisschool De Regenboog',
    category: 'Verkeer',
    priority: 'medium',
    documents: 2,
    estimatedDuration: '15 min',
    speakers: ['Wethouder Mobiliteit'],
    newsRelevance: 'medium',
    angle: 'Ouderprotesten na bijna-ongeval vorige maand'
  },
  {
    id: '3',
    meetingId: '1',
    title: 'Herinrichting Koningsplein - Voortgangsrapportage',
    description: 'Update over de werkzaamheden en tijdlijn voor de herinrichting van het stadscentrum',
    category: 'Stedenbouw',
    priority: 'medium',
    documents: 5,
    estimatedDuration: '20 min',
    speakers: ['Wethouder Ruimtelijke Ordening', 'Projectleider'],
    newsRelevance: 'medium',
    angle: 'Vertraging door archeologische vondsten'
  },
  {
    id: '4',
    meetingId: '2',
    title: 'Nieuwbouwplan Spoorzone Zuid',
    description: 'Behandeling van bezwaren tegen het bestemmingsplan voor 300 nieuwe woningen',
    category: 'Woningbouw',
    priority: 'high',
    documents: 8,
    estimatedDuration: '45 min',
    speakers: ['Wethouder Wonen', 'Omwonenden'],
    newsRelevance: 'high',
    angle: 'Bewoners vrezen overlast en parkeerdruk'
  }
];

const Agenda = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(upcomingMeetings[0].id);
  const [filter, setFilter] = useState('all');

  const filteredItems = agendaItems.filter(item => {
    if (filter === 'all') return item.meetingId === selectedMeeting;
    if (filter === 'high-priority') return item.priority === 'high' && item.meetingId === selectedMeeting;
    if (filter === 'news-relevant') return item.newsRelevance === 'high' && item.meetingId === selectedMeeting;
    return item.category.toLowerCase() === filter && item.meetingId === selectedMeeting;
  });

  return (
    <Layout title="Agenda Scanner" subtitle="Overzicht van gemeenteraad vergaderingen en belangrijke agendapunten">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Meeting Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Aankomende Vergaderingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedMeeting === meeting.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMeeting(meeting.id)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{meeting.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(meeting.date).toLocaleDateString('nl-NL', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {meeting.location}
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {meeting.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
                Alle items
              </Button>
              <Button variant={filter === 'high-priority' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('high-priority')}>
                Hoge prioriteit
              </Button>
              <Button variant={filter === 'news-relevant' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('news-relevant')}>
                Nieuwswaardig
              </Button>
              <Button variant={filter === 'jeugdbeleid' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('jeugdbeleid')}>
                Jeugdbeleid
              </Button>
              <Button variant={filter === 'verkeer' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('verkeer')}>
                Verkeer
              </Button>
              <Button variant={filter === 'woningbouw' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('woningbouw')}>
                Woningbouw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agenda Items */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Item {index + 1}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={
                          item.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {item.priority === 'high' ? 'Hoge prioriteit' : 'Medium prioriteit'}
                      </Badge>
                      <Badge variant="outline">
                        {item.category}
                      </Badge>
                      {item.newsRelevance === 'high' && (
                        <Badge className="bg-green-100 text-green-800">
                          Nieuwswaardig
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {item.description}
                    </p>
                    
                    {item.angle && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Nieuwshoek:</strong> {item.angle}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {item.estimatedDuration}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {item.documents} documenten
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {item.speakers.length} sprekers
                      </div>
                    </div>

                    {item.speakers.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Sprekers:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.speakers.map((speaker, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Opslaan
                    </Button>
                    <Button size="sm">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Geen agenda-items gevonden voor de geselecteerde filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Agenda;
