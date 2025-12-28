import { CheckCircle2, XCircle, Loader2, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadStatus } from '@/hooks/useUpload';
import { formatFileSize } from '@/lib/api';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
  status: UploadStatus;
  progress: number;
  fileName?: string;
  currentChunk: number;
  totalChunks: number;
  uploadSpeed: number;
  estimatedTime: number;
  error?: string;
  onCancel: () => void;
  onReset: () => void;
}

export function UploadProgress({
  status,
  progress,
  fileName,
  currentChunk,
  totalChunks,
  uploadSpeed,
  estimatedTime,
  error,
  onCancel,
  onReset,
}: UploadProgressProps) {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
      {/* Status Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              status === 'uploading' && 'bg-primary/20',
              status === 'processing' && 'bg-warning/20',
              status === 'completed' && 'bg-success/20',
              status === 'failed' && 'bg-destructive/20',
              status === 'cancelled' && 'bg-muted'
            )}
          >
            {status === 'uploading' && (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            )}
            {status === 'processing' && (
              <Loader2 className="w-6 h-6 text-warning animate-spin" />
            )}
            {status === 'completed' && (
              <CheckCircle2 className="w-6 h-6 text-success" />
            )}
            {(status === 'failed' || status === 'cancelled') && (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {status === 'uploading' && 'Uploading...'}
              {status === 'processing' && 'Processing...'}
              {status === 'completed' && 'Upload Complete!'}
              {status === 'failed' && 'Upload Failed'}
              {status === 'cancelled' && 'Upload Cancelled'}
            </h3>
            {fileName && (
              <p className="text-sm text-muted-foreground mt-0.5">{fileName}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {status === 'uploading' && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          )}
          {(status === 'failed' || status === 'cancelled' || status === 'completed') && (
            <Button variant="ghost" size="icon" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="space-y-3">
          <Progress
            value={progress}
            className={cn(
              'h-3',
              status === 'processing' && 'animate-progress-pulse'
            )}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {status === 'uploading'
                ? `Chunk ${currentChunk} of ${totalChunks}`
                : 'Encoding video...'}
            </span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
        </div>
      )}

      {/* Upload Stats */}
      {status === 'uploading' && uploadSpeed > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Speed</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatFileSize(uploadSpeed)}/s
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Remaining</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              {formatTime(estimatedTime)}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Success Actions */}
      {status === 'completed' && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onReset} className="flex-1">
            Upload Another
          </Button>
          <Button variant="default" asChild className="flex-1">
            <a href="/library">View Library</a>
          </Button>
        </div>
      )}
    </div>
  );
}
