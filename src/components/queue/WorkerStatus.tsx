import { Server, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkerStatusProps {
  activeWorkers: number;
  totalWorkers?: number;
}

export function WorkerStatus({ activeWorkers, totalWorkers = 3 }: WorkerStatusProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Worker Status</h3>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-success animate-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: totalWorkers }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'p-4 rounded-xl border transition-all duration-300',
              i < activeWorkers
                ? 'border-success/50 bg-success/10'
                : 'border-border bg-muted/50'
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <Server
                className={cn(
                  'w-8 h-8',
                  i < activeWorkers ? 'text-success' : 'text-muted-foreground'
                )}
              />
              <span className="text-sm font-medium text-foreground">Worker {i + 1}</span>
              <span
                className={cn(
                  'text-xs',
                  i < activeWorkers ? 'text-success' : 'text-muted-foreground'
                )}
              >
                {i < activeWorkers ? 'Active' : 'Idle'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
