import { Link } from 'react-router-dom';
import { Upload, Film, BarChart3, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Chunked uploads with parallel processing for maximum speed',
  },
  {
    icon: Shield,
    title: 'Reliable',
    description: 'Automatic retry logic ensures your uploads never fail',
  },
  {
    icon: Globe,
    title: 'Multi-Resolution',
    description: 'Videos transcoded to 360p, 480p, 720p, and 1080p',
  },
];

export default function Index() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Professional</span>
              <br />
              <span className="text-foreground">Video Processing Pipeline</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload, transcode, and manage your video content with a modern, 
              reliable, and scalable solution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/upload">
                <Button variant="gradient" size="lg" className="gap-2 w-full sm:w-auto">
                  <Upload className="w-5 h-5" />
                  Start Uploading
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Film className="w-5 h-5" />
                  View Library
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 glow-primary">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16">
          <div className="glass-card rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              Get Started
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                to="/upload"
                className="group p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300"
              >
                <Upload className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload new video files
                </p>
              </Link>

              <Link
                to="/library"
                className="group p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300"
              >
                <Film className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Library</h3>
                <p className="text-sm text-muted-foreground">
                  Browse all videos
                </p>
              </Link>

              <Link
                to="/queue"
                className="group p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300"
              >
                <BarChart3 className="w-8 h-8 text-success mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-1">Queue Stats</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor processing
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
