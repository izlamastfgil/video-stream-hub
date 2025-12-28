import { useCallback, useState, useRef } from 'react';
import { Upload, Film, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatFileSize } from '@/lib/api';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onUpload: (file: File, title: string, thumbnail?: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0] && files[0].type.startsWith('video/')) {
      setSelectedFile(files[0]);
      setTitle(files[0].name.replace(/\.[^/.]+$/, ''));
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      setTitle(files[0].name.replace(/\.[^/.]+$/, ''));
    }
  }, []);

  const handleThumbnailSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0] && files[0].type.startsWith('image/')) {
      setThumbnail(files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedFile && title.trim()) {
      onUpload(selectedFile, title.trim(), thumbnail || undefined);
    }
  }, [selectedFile, title, thumbnail, onUpload]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setThumbnail(null);
    setThumbnailPreview(null);
    setTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  }, []);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'upload-zone p-12 cursor-pointer text-center transition-all duration-300',
          isDragActive && 'upload-zone-active',
          disabled && 'opacity-50 cursor-not-allowed',
          selectedFile && 'border-success bg-success/5'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-success/20 flex items-center justify-center">
              <Film className="w-8 h-8 text-success" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop your video here' : 'Drag & drop your video'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • Supports MP4, MOV, AVI, MKV
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="space-y-6 animate-fade-in">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Video Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={disabled}
              className="bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Thumbnail (Optional)</Label>
            <div className="flex items-center gap-4">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
                disabled={disabled}
              />
              
              {thumbnailPreview ? (
                <div className="relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-40 h-24 object-cover rounded-lg border border-border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={disabled}
                  className="gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose Thumbnail
                </Button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="gradient"
            size="lg"
            onClick={handleSubmit}
            disabled={disabled || !title.trim()}
            className="w-full"
          >
            <Upload className="w-5 h-5 mr-2" />
            Start Upload
          </Button>
        </div>
      )}
    </div>
  );
}
