'use client';

import { ErrorNotice } from '../../components/states/AsyncNotice';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <ErrorNotice subtitle="The search page failed to render." onRetry={reset} />
    </div>
  );
}

