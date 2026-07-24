export default function GallerySection() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <h2 className="section-title">Gallery</h2>
      <p className="section-subtitle">Photos from AXIS'27 will be displayed soon.</p>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '4rem 2rem',
        border: '1px solid var(--border-gold)',
        borderRadius: '2px',
        background: 'rgba(8,6,4,0.6)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          marginBottom: '1rem',
        }}>
          // NO PHOTOS YET //
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}>
          Gallery coming soon. Check back after the fest!
        </div>
      </div>
    </section>
  );
}