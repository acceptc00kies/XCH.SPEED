'use client';

/**
 * MobileNav Component
 *
 * Bottom navigation bar for mobile devices.
 * Fixed to bottom with safe-area padding for iOS.
 * Hidden on desktop (lg and above).
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavTab = 'home' | 'watchlist' | 'search';

interface NavItemProps {
  tab: NavTab;
  label: string;
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
}

function NavItem({ label, href, isActive, icon }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center flex-1 min-h-[56px] py-2 transition-colors ${
        isActive
          ? 'text-accent-blue'
          : 'text-text-muted hover:text-text-secondary'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  // Determine active tab based on pathname
  const getActiveTab = (): NavTab => {
    if (pathname === '/watchlist') return 'watchlist';
    if (pathname === '/search') return 'search';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-secondary/95 backdrop-blur-lg border-t border-border-primary lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <NavItem
          tab="home"
          label="Home"
          href="/"
          isActive={activeTab === 'home'}
          icon={
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={activeTab === 'home' ? 2.5 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          }
        />

        {/* Watchlist */}
        <NavItem
          tab="watchlist"
          label="Watchlist"
          href="/?filter=watchlist"
          isActive={activeTab === 'watchlist'}
          icon={
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill={activeTab === 'watchlist' ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={activeTab === 'watchlist' ? 0 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          }
        />

        {/* Search */}
        <NavItem
          tab="search"
          label="Search"
          href="/?focus=search"
          isActive={activeTab === 'search'}
          icon={
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={activeTab === 'search' ? 2.5 : 1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
      </div>
    </nav>
  );
}
