import { SearchBar } from '../../components/search/SearchBar';
import { SearchFilters } from '../../components/search/SearchFilters';
import { SearchResultsClient } from '../../components/search/SearchResultsClient';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; filter?: string; country?: string };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const sortBy = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined;
  const filter = typeof searchParams?.filter === 'string' ? searchParams.filter : undefined;
  const country = typeof searchParams?.country === 'string' ? searchParams.country : undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SearchBar defaultQuery={q} size="md" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <SearchFilters />
        <div className="-mt-2">
          <SearchResultsClient query={q} sortBy={sortBy} filter={filter} country={country} />
        </div>
      </div>
    </div>
  );
}

