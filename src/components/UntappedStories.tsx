
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const untappedStories = [
  {
    id: '1',
    title: 'Koningsplein herinrichting',
    reason: 'Geen berichtgeving sinds 3 weken',
    signals: 8,
    neighborhood: 'Centrum',
    lastCovered: '21 dagen geleden',
    urgency: 'high'
  },
  {
    id: '2',
    title: 'Parkeerproblematiek Wandelbos',
    reason: 'Groeiende klachten buurtbewoners',
    signals: 5,
    neighborhood: 'West',
    lastCovered: 'Nooit behandeld',
    urgency: 'medium'
  },
  {
    id: '3',
    title: 'Nieuwe fietsroute Noord-Zuid',
    reason: 'Veel positieve reacties',
    signals: 12,
    neighborhood: 'Noord',
    lastCovered: '14 dagen geleden',
    urgency: 'low'
  }
];

export const UntappedStories = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Gemiste Verhalen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {untappedStories.map((story) => (
          <div key={story.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm text-gray-900 leading-tight">
                {story.title}
              </h4>
              <div className="flex items-center gap-1 ml-2">
                <AlertTriangle 
                  className={`w-4 h-4 ${
                    story.urgency === 'high' ? 'text-red-500' :
                    story.urgency === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`} 
                />
                <Badge variant="outline" className="text-xs">
                  {story.signals} signalen
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <MapPin className="w-3 h-3" />
              {story.neighborhood}
            </div>
            
            <p className="text-xs text-gray-700 mb-2">
              {story.reason}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Laatste berichtgeving: {story.lastCovered}
              </span>
              <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                Onderzoek →
              </button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <button className="w-full text-center text-sm text-orange-600 hover:text-orange-800 transition-colors">
            Bekijk alle gemiste verhalen →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
