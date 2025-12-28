import { Play, Clock, Calendar, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Video, formatDuration, formatRelativeTime } from '@/lib/api';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const isProcessing = video.status === 'processing';

  return (
    <div className="group glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        {!isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg glow-primary">
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs font-medium text-foreground">Processing</span>
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {video.duration && !isProcessing && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Status Badge */}
        {video.status === 'failed' && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Failed
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {video.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(video.uploadedAt)}</span>
          </div>
        </div>

        {/* Resolution Badges */}
        <div className="flex flex-wrap gap-1.5">
          {video.resolutions.map((res) => (
            <Badge
              key={res}
              variant="resolution"
              className={cn(
                res === '1080p' && 'border-primary/50 text-primary',
                res === '720p' && 'border-accent/50 text-accent'
              )}
            >
              {res}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
