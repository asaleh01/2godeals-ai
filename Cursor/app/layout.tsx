import './globals.css';
import type { Metadata } from 'next';
import { AppProviders } from './providers';
import { Header } from '../components/site/Header';
import { Footer } from '../components/site/Footer';

export const metadata: Metadata = {
  title: '2GoDeals AI',
  description: 'Search by text, image, or barcode. Compare real prices worldwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
