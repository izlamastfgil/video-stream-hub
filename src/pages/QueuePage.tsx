import { useState, useEffect } from 'react';
import { RefreshCw, ListTodo, Clock, Cpu, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/queue/StatCard';
import { QueueChart } from '@/components/queue/QueueChart';
import { WorkerStatus } from '@/components/queue/WorkerStatus';
import { Button } from '@/components/ui/button';
import { getQueueStats, QueueStats } from '@/lib/api';

export default function QueuePage() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const data = await getQueueStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch queue stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gradient-text">Queue</span>
              <span className="text-foreground"> Statistics</span>
            </h1>
            {lastUpdated && (
              <p className="text-muted-foreground mt-1 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={fetchStats}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Jobs"
                value={stats.totalJobs}
                icon={ListTodo}
                color="primary"
              />
              <StatCard
                title="Pending"
                value={stats.pendingJobs}
                icon={Clock}
                color="warning"
              />
              <StatCard
                title="Active Workers"
                value={stats.activeWorkers}
                icon={Cpu}
                color="accent"
              />
              <StatCard
                title="Completed"
                value={stats.completedJobs || 0}
                icon={CheckCircle}
                color="success"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QueueChart stats={stats} />
              <WorkerStatus activeWorkers={stats.activeWorkers} />
            </div>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse mr-2" />
            Auto-refreshing every 5 seconds
          </p>
        </div>
      </div>
    </Layout>
  );
}
