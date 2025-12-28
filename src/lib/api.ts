const API_BASE = 'http://localhost:8080';

export interface Video {
  id: string;
  title: string;
  fileName: string;
  thumbnail?: string;
  duration?: number;
  resolutions: string[];
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface QueueStats {
  totalJobs: number;
  pendingJobs: number;
  activeWorkers: number;
  completedJobs?: number;
  failedJobs?: number;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

export interface UploadChunkParams {
  fileId: string;
  fileName: string;
  chunkIndex: number;
  totalChunks: number;
  chunk: Blob;
  thumbnail?: File;
  title?: string;
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    return { status: 'unhealthy', timestamp: new Date().toISOString() };
  } catch {
    return { status: 'unhealthy', timestamp: new Date().toISOString() };
  }
}

export async function uploadChunk(params: UploadChunkParams): Promise<{ success: boolean; message?: string }> {
  const formData = new FormData();
  formData.append('fileId', params.fileId);
  formData.append('fileName', params.fileName);
  formData.append('chunkIndex', params.chunkIndex.toString());
  formData.append('totalChunks', params.totalChunks.toString());
  formData.append('chunk', params.chunk);
  
  if (params.thumbnail && params.chunkIndex === params.totalChunks - 1) {
    formData.append('thumbnail', params.thumbnail);
  }
  
  if (params.title && params.chunkIndex === 0) {
    formData.append('title', params.title);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return { success: true };
}

export async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch(`${API_BASE}/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return await response.json();
  } catch {
    // Return mock data for demo purposes when API is unavailable
    return getMockVideos();
  }
}

export async function getQueueStats(): Promise<QueueStats> {
  try {
    const response = await fetch(`${API_BASE}/queue/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch queue stats');
    }
    return await response.json();
  } catch {
    // Return mock data for demo purposes
    return getMockQueueStats();
  }
}

// Mock data for development/demo
function getMockVideos(): Video[] {
  return [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      fileName: 'react-hooks-intro.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop',
      duration: 754,
      resolutions: ['360p', '480p', '720p', '1080p'],
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      title: 'Building a Video Pipeline',
      fileName: 'video-pipeline.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=320&h=180&fit=crop',
      duration: 1230,
      resolutions: ['360p', '480p', '720p'],
      uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
    {
      id: '3',
      title: 'Advanced TypeScript Patterns',
      fileName: 'typescript-advanced.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=320&h=180&fit=crop',
      duration: 2100,
      resolutions: ['360p', '480p'],
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'processing',
    },
    {
      id: '4',
      title: 'Cloud Architecture Deep Dive',
      fileName: 'cloud-architecture.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=320&h=180&fit=crop',
      duration: 3600,
      resolutions: ['360p', '480p', '720p', '1080p'],
      uploadedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
    },
  ];
}

function getMockQueueStats(): QueueStats {
  return {
    totalJobs: 12,
    pendingJobs: 4,
    activeWorkers: 3,
    completedJobs: 8,
    failedJobs: 0,
  };
}

export function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
}
