import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { UploadZone } from '@/components/upload/UploadZone';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { useUpload } from '@/hooks/useUpload';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const upload = useUpload();

  const handleUpload = useCallback(
    async (file: File, title: string, thumbnail?: File) => {
      const success = await upload.uploadFile(file, title, thumbnail);
      
      if (success) {
        toast({
          title: 'Upload Complete!',
          description: 'Your video is now being processed.',
        });
      } else if (upload.status === 'failed') {
        toast({
          title: 'Upload Failed',
          description: upload.error || 'Something went wrong',
          variant: 'destructive',
        });
      }
    },
    [upload, toast]
  );

  const handleReset = useCallback(() => {
    upload.reset();
  }, [upload]);

  const isUploading = upload.status !== 'idle';

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Upload</span>
            <span className="text-foreground"> Video</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload your video files and we'll process them into multiple resolutions for optimal streaming.
          </p>
        </div>

        {/* Upload Interface */}
        <div className="space-y-6">
          {!isUploading ? (
            <UploadZone onUpload={handleUpload} />
          ) : (
            <UploadProgress
              status={upload.status}
              progress={upload.progress}
              fileName={upload.fileName}
              currentChunk={upload.currentChunk}
              totalChunks={upload.totalChunks}
              uploadSpeed={upload.uploadSpeed}
              estimatedTime={upload.estimatedTime}
              error={upload.error}
              onCancel={upload.cancel}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Upload Tips */}
        <div className="mt-12 glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Upload Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Files are uploaded in 5MB chunks for reliability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Supported formats: MP4, MOV, AVI, MKV, WebM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Videos are processed into 360p, 480p, 720p, and 1080p</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Processing time depends on video length and quality</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
