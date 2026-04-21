export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="mt-4 h-4 w-96 rounded bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="h-5 w-56 rounded bg-white/10" />
              <div className="mt-3 h-4 w-80 rounded bg-white/10" />
              <div className="mt-6 h-9 w-28 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

