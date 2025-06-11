
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: 'all', label: 'Alle signalen', count: 12 },
  { key: 'centrum', label: 'Centrum', count: 3 },
  { key: 'noord', label: 'Noord', count: 2 },
  { key: 'west', label: 'West', count: 4 },
  { key: 'oost', label: 'Oost', count: 1 },
  { key: 'zuid', label: 'Zuid', count: 2 },
];

const topicFilters = [
  { key: 'woningbouw', label: 'Woningbouw', count: 5 },
  { key: 'verkeer', label: 'Verkeer', count: 3 },
  { key: 'jeugd', label: 'Jeugd', count: 2 },
  { key: 'veiligheid', label: 'Veiligheid', count: 2 },
];

export const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter op wijk</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className="text-xs"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter op onderwerp</h3>
        <div className="flex flex-wrap gap-2">
          {topicFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className="text-xs"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
