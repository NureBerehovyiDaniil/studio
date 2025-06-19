import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface SiteHeaderProps {
  title: string;
  Icon?: LucideIcon;
  showHomeLink?: boolean;
}

export function SiteHeader({ title, Icon, showHomeLink = false }: SiteHeaderProps) {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-7 w-7 text-primary" />}
          <h1 className="text-2xl font-headline font-semibold text-foreground">
            {title}
          </h1>
        </div>
        {showHomeLink && (
          <Button variant="outline" asChild>
            <Link href="/" aria-label="Back to Home">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
