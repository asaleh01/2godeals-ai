import { AlertTriangle, Loader2, SearchX } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

export function LoadingNotice({ title = 'Loading…', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardBody className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-300">{subtitle}</div> : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function EmptyNotice({
  title = 'No results yet',
  subtitle = 'Try a more specific query or remove filters.',
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed border-white/10 bg-white/5">
      <CardBody className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <SearchX className="h-5 w-5 text-slate-200" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-sm text-slate-300">{subtitle}</div>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function ErrorNotice({
  title = 'Something went wrong',
  subtitle,
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardBody className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
          <AlertTriangle className="h-5 w-5 text-rose-200" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-300">{subtitle}</div> : null}
          {onRetry ? (
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

