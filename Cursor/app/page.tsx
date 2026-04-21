import { FeatureGrid } from '../components/home/FeatureGrid';
import { Hero } from '../components/home/Hero';
import { StatsStrip } from '../components/home/StatsStrip';
import { WhySection } from '../components/home/WhySection';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeatureGrid />
      <WhySection />
      <StatsStrip />
    </div>
  );
}
