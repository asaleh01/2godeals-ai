export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="h-6 w-72 rounded bg-white/10" />
        <div className="mt-4 h-4 w-[520px] rounded bg-white/10" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="mt-3 h-4 w-40 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

