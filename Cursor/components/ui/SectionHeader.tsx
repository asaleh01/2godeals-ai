import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export function SectionHeader({
  eyebrow,
  title,
  text,
  icon,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  icon?: 'sparkles' | 'none';
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
        {icon !== 'none' ? <Sparkles className="h-4 w-4" /> : null}
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">{text}</p> : null}
    </div>
  );
}

