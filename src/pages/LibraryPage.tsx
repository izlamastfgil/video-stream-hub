import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoGrid } from '@/components/library/VideoGrid';
import { SearchBar, SortOption } from '@/components/library/SearchBar';
import { Button } from '@/components/ui/button';
import { getVideos, Video } from '@/lib/api';

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('date-desc');

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          video.fileName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'date-asc':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [videos, search, sort]);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gradient-text">Video</span>
              <span className="text-foreground"> Library</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>

          <Link to="/upload">
            <Button variant="gradient" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Video
            </Button>
          </Link>
        </div>

        {/* Search & Sort */}
        <div className="mb-8">
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        {/* Video Grid */}
        <VideoGrid videos={filteredAndSortedVideos} isLoading={isLoading} />
      </div>
    </Layout>
  );
}
