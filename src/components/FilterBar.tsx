import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: "all", label: "Alle signalen", count: 12 },
  { key: "waalwijk", label: "Waalwijk", count: 3 },
  { key: "heusden", label: "Heusden", count: 2 },
  { key: "dongen", label: "Dongen", count: 1 },
  { key: "loon-op-zand", label: "Loon op Zand", count: 4 },
  { key: "gilze-en-rijen", label: "Gilze en Rijen", count: 2 },
  { key: "tilburg", label: "Tilburg", count: 6 },
  { key: "oisterwijk", label: "Oisterwijk", count: 1 },
  { key: "goirle", label: "Goirle", count: 1 },
  { key: "hilvarenbeek", label: "Hilvarenbeek", count: 2 },
];

const topicFilters = [
  { key: "samenleving", label: "Samenleving & Gemeente", count: 5 },
  { key: "veiligheid", label: "Veiligheid & Incidenten", count: 3 },
  { key: "cultuur", label: "Cultuur & Evenementen", count: 2 },
  { key: "ondernemen", label: "Ondernemen & Werk", count: 4 },
  { key: "leefomgeving", label: "Leefomgeving & Mobiliteit", count: 3 },
];

export const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Filter op wijk
        </h3>
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Filter op onderwerp
        </h3>
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
