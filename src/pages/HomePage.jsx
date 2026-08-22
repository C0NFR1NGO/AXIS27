import { lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import AboutSection from '../components/AboutSection';
import ZoomReveal from '../components/ZoomReveal';
import usePageMeta from '../hooks/usePageMeta';

const LazyCosmicBackground = lazy(() => import('../components/CosmicBackground'));

export default function HomePage({ ready }) {
  usePageMeta({
    description: "AXIS'27 — Ignis Aeternum. The annual technical festival of VNIT Nagpur. 35+ events, 200+ colleges, 35,000+ participants.",
  });
  return (
    <>
      <div style={{ position: 'relative', height: '100vh', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {ready && (
            <Suspense fallback={null}>
              <LazyCosmicBackground />
            </Suspense>
          )}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HeroSection ready={ready} />
        </div>
      </div>
      <ZoomReveal><StatsBar /></ZoomReveal>
      <ZoomReveal><AboutSection /></ZoomReveal>
    </>
  );
}
