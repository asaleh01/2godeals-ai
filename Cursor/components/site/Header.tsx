'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/compare', label: 'Compare' },
  { href: '/waitlist', label: 'Waitlist' },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-cyan-400/40 rounded-2xl">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/waitlist">
          <Button variant="secondary" size="sm" className="rounded-2xl">
            Join waitlist
          </Button>
        </Link>
      </div>
    </header>
  );
}

