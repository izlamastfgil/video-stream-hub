import { Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function SearchBar({ search, onSearchChange, sort, onSortChange }: SearchBarProps) {
  const sortOrder = sort.includes('desc') ? 'desc' : 'asc';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const base = sort.split('-')[0];
            const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
            onSortChange(`${base}-${newOrder}` as SortOption);
          }}
          className="bg-secondary/50 border-border/50"
        >
          {sortOrder === 'desc' ? (
            <SortDesc className="w-4 h-4" />
          ) : (
            <SortAsc className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
