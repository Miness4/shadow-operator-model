'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Sparkles, PenLine, Users } from 'lucide-react';

const tabs = [
  {
    name: 'Synthesio',
    href: '/synthesio',
    icon: Sparkles,
    description: 'Product Architect',
    colorClass: 'text-synthesio',
    bgClass: 'bg-synthesio/10',
  },
  {
    name: 'Ghostwrite',
    href: '/ghostwrite',
    icon: PenLine,
    description: 'Copywriting OS',
    colorClass: 'text-ghostwrite',
    bgClass: 'bg-ghostwrite/10',
  },
  {
    name: 'Flowy',
    href: '/flowy',
    icon: Users,
    description: 'CRM',
    colorClass: 'text-flowy',
    bgClass: 'bg-flowy/10',
  },
] as const;

export function TabNavigation(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-1">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? cn('bg-bg-tertiary', tab.colorClass)
                    : 'text-muted-foreground hover:bg-bg-tertiary hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
