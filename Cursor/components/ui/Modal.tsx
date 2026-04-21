import type { ReactNode } from 'react';

export function Modal({
  open,
  title,
  eyebrow,
  children,
  onClose,
  footer,
  maxWidthClassName = 'max-w-2xl',
}: {
  open: boolean;
  title: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  maxWidthClassName?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className={`w-full ${maxWidthClassName} rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/50`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                {eyebrow}
              </div>
            ) : null}
            <h3 className="mt-4 text-2xl font-bold">{title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 hover:bg-white/5">
            Close
          </button>
        </div>

        <div className="mt-6">{children}</div>

        {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

