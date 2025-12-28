import { useState, useCallback, useRef } from 'react';
import { uploadChunk, generateFileId } from '@/lib/api';

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error?: string;
  fileId?: string;
  fileName?: string;
  currentChunk: number;
  totalChunks: number;
  uploadSpeed: number;
  estimatedTime: number;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CONCURRENT_UPLOADS = 3;
const MAX_RETRIES = 3;

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    currentChunk: 0,
    totalChunks: 0,
    uploadSpeed: 0,
    estimatedTime: 0,
  });

  const cancelledRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const uploadedBytesRef = useRef<number>(0);

  const reset = useCallback(() => {
    cancelledRef.current = false;
    setState({
      status: 'idle',
      progress: 0,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      estimatedTime: 0,
    });
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    setState(prev => ({ ...prev, status: 'cancelled' }));
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    title: string,
    thumbnail?: File
  ): Promise<boolean> => {
    const fileId = generateFileId();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    cancelledRef.current = false;
    startTimeRef.current = Date.now();
    uploadedBytesRef.current = 0;

    setState({
      status: 'uploading',
      progress: 0,
      fileId,
      fileName: file.name,
      currentChunk: 0,
      totalChunks,
      uploadSpeed: 0,
      estimatedTime: 0,
    });

    const uploadChunkWithRetry = async (chunkIndex: number): Promise<boolean> => {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (cancelledRef.current) return false;

        try {
          await uploadChunk({
            fileId,
            fileName: file.name,
            chunkIndex,
            totalChunks,
            chunk,
            thumbnail: chunkIndex === totalChunks - 1 ? thumbnail : undefined,
            title: chunkIndex === 0 ? title : undefined,
          });
          return true;
        } catch (error) {
          if (attempt === MAX_RETRIES - 1) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
      return false;
    };

    try {
      // Upload chunks with concurrency control
      const chunkIndices = Array.from({ length: totalChunks }, (_, i) => i);
      let completedChunks = 0;

      const uploadWithConcurrency = async () => {
        const executing: Promise<void>[] = [];

        for (const chunkIndex of chunkIndices) {
          if (cancelledRef.current) break;

          const promise = uploadChunkWithRetry(chunkIndex).then(() => {
            completedChunks++;
            uploadedBytesRef.current = completedChunks * CHUNK_SIZE;
            
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
            const uploadSpeed = uploadedBytesRef.current / elapsedTime;
            const remainingBytes = file.size - uploadedBytesRef.current;
            const estimatedTime = remainingBytes / uploadSpeed;

            setState(prev => ({
              ...prev,
              progress: Math.round((completedChunks / totalChunks) * 100),
              currentChunk: completedChunks,
              uploadSpeed,
              estimatedTime: Math.max(0, estimatedTime),
            }));
          });

          executing.push(promise as Promise<void>);

          if (executing.length >= MAX_CONCURRENT_UPLOADS) {
            await Promise.race(executing);
            executing.splice(
              executing.findIndex(p => p === promise),
              1
            );
          }
        }

        await Promise.all(executing);
      };

      await uploadWithConcurrency();

      if (cancelledRef.current) {
        return false;
      }

      setState(prev => ({ ...prev, status: 'processing' }));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({ ...prev, status: 'completed', progress: 100 }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Upload failed',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    uploadFile,
    cancel,
    reset,
  };
}
