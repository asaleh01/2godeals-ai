import { CompareClient } from '../../components/compare/CompareClient';

export default function ComparePage({ searchParams }: { searchParams: { productId?: string } }) {
  const productId = typeof searchParams?.productId === 'string' ? searchParams.productId : undefined;
  return <CompareClient productId={productId} />;
}

