import { Search } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-white/10">
        <Search className="h-5 w-5" />
      </div>
      <div>
        <div className="text-lg font-semibold tracking-tight">2GoDeals AI</div>
        <div className="text-xs text-slate-400">AI search for shopping</div>
      </div>
    </div>
  );
}

