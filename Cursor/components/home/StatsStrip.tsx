const stats = [
  ['96%', 'AI match confidence'],
  ['3x', 'faster decision flow'],
  ['20+', 'merchant data points per offer'],
  ['1', 'shopping search experience'],
] as const;

export function StatsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <div className="text-4xl font-bold tracking-tight">{value}</div>
            <div className="mt-2 text-slate-300">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

