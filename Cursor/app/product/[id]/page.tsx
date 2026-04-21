import { ProductDetailsClient } from '../../../components/product/ProductDetailsClient';

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailsClient productId={params.id} />;
}

