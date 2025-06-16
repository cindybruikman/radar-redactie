
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const agendaItems = [
  {
    id: '1',
    title: 'Stemming budget jeugdcentrum De Posthal',
    time: 'Vandaag 14:00',
    category: 'Jeugdbeleid',
    summary: 'Raad stemt over € 150.000 bezuiniging op jeugdvoorzieningen',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Verkeersveiligheid Schoolstraat',
    time: 'Vandaag 15:30',
    category: 'Verkeer',
    summary: 'Besluit over plaatsing zebrapaden en verkeersdrempels',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Herinrichting Koningsplein - Update',
    time: 'Donderdag 10:00',
    category: 'Stedenbouw',
    summary: 'Voortgangsrapportage bouwproject centrum',
    priority: 'medium'
  }
];

export const AgendaWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
          Agenda Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agendaItems.map((item) => (
          <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm text-gray-900 leading-tight">
                {item.title}
              </h4>
              <Badge 
                variant="secondary" 
                className={
                  item.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {item.priority}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="w-3 h-3" />
              {item.time}
              <span className="text-gray-400">•</span>
              <span className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                {item.category}
              </span>
            </div>
            
            <p className="text-xs text-gray-700 mb-2">
              {item.summary}
            </p>
            
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
              Bekijk agenda-item
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Bekijk volledige agenda →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
