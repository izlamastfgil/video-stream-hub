import { Link, useLocation } from 'react-router-dom';
import { Upload, Film, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHealth } from '@/hooks/useHealth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/library', label: 'Library', icon: Film },
  { to: '/queue', label: 'Queue Stats', icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const { health } = useHealth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg glow-primary">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold hidden sm:block">
              <span className="gradient-text">Video</span>
              <span className="text-foreground"> Pipeline</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                <Button
                  variant={location.pathname === to ? 'secondary' : 'ghost'}
                  className={cn(
                    'gap-2 transition-all duration-200',
                    location.pathname === to && 'bg-secondary/80'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Health Status & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-colors duration-300',
                  health.status === 'healthy'
                    ? 'bg-success animate-pulse'
                    : 'bg-destructive'
                )}
              />
              <span className="text-muted-foreground hidden sm:block">
                {health.status === 'healthy' ? 'Connected' : 'Offline'}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === to ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
