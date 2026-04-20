import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2GoDeals AI',
  description: 'Search by text, image, or barcode. Compare real prices worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
