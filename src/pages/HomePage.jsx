import { lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import AboutSection from '../components/AboutSection';
import ZoomReveal from '../components/ZoomReveal';

const LazyCosmicBackground = lazy(() => import('../components/CosmicBackground'));

export default function HomePage() {
  return (
    <>
      <div style={{ position: 'relative', height: '100vh', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Suspense fallback={null}>
            <LazyCosmicBackground />
          </Suspense>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HeroSection />
        </div>
      </div>
      <ZoomReveal><StatsBar /></ZoomReveal>
      <ZoomReveal><AboutSection /></ZoomReveal>
    </>
  );
}
