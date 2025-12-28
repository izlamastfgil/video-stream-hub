import { QueueStats } from '@/lib/api';
import { cn } from '@/lib/utils';

interface QueueChartProps {
  stats: QueueStats;
}

export function QueueChart({ stats }: QueueChartProps) {
  const total = stats.totalJobs || 1;
  const pendingPercent = (stats.pendingJobs / total) * 100;
  const completedPercent = ((stats.completedJobs || 0) / total) * 100;
  const activePercent = ((stats.activeWorkers || 0) / total) * 100;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Queue Distribution</h3>
        <span className="text-sm text-muted-foreground">{stats.totalJobs} total jobs</span>
      </div>

      {/* Progress Bar */}
      <div className="h-4 rounded-full bg-muted overflow-hidden flex">
        <div
          className="h-full bg-success transition-all duration-500"
          style={{ width: `${completedPercent}%` }}
        />
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${activePercent}%` }}
        />
        <div
          className="h-full bg-warning transition-all duration-500"
          style={{ width: `${pendingPercent}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6">
        <LegendItem color="success" label="Completed" value={stats.completedJobs || 0} />
        <LegendItem color="primary" label="Active" value={stats.activeWorkers} />
        <LegendItem color="warning" label="Pending" value={stats.pendingJobs} />
        {(stats.failedJobs || 0) > 0 && (
          <LegendItem color="destructive" label="Failed" value={stats.failedJobs || 0} />
        )}
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: 'success' | 'primary' | 'warning' | 'destructive';
  label: string;
  value: number;
}

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-3 h-3 rounded-full',
          color === 'success' && 'bg-success',
          color === 'primary' && 'bg-primary',
          color === 'warning' && 'bg-warning',
          color === 'destructive' && 'bg-destructive'
        )}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
