import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function FilterChip({
  active,
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <button
      className={`rounded-full px-3 py-2 text-sm transition ${
        active ? 'bg-white text-slate-950' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

