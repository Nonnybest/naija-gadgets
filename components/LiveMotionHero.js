import Link from 'next/link';

export default function LiveMotionHero() {
  return (
    <section className="cinema-hero">
      <div className="cinema-hero-inner">
        <div className="cinema-copy">
          <span className="cinema-eyebrow"><span /> THE FUTURE, IN YOUR HANDS</span>
          <h1>Meet the tech<br />that moves you<span>.</span></h1>
          <p>Thoughtful gadgets for smarter homes, bigger ideas, and the everyday moments in between.</p>
          <div className="cinema-actions">
            <Link href="/shop" className="cinema-button">Explore the collection <span>↗</span></Link>
            <Link href="/shop" className="cinema-text-link">Discover what’s new <span>→</span></Link>
          </div>
          <div className="cinema-proof"><span>✦</span> Curated tech. Nationwide delivery. Local support.</div>
        </div>

        <Link href="/shop" className="cinema-spotlight" aria-label="Shop the featured smart drone">
          <img src="/products/dji-smart-drone.jpg" alt="A camera drone in a dramatic studio setting" />
          <div className="spotlight-shade" />
          <div className="spotlight-topline"><span>THE 2026 EDIT</span><span>01 / 08</span></div>
          <div className="spotlight-copy">
            <span>EDITOR’S PICK</span>
            <h2>See beyond<br />the ordinary.</h2>
            <span className="spotlight-link">Explore aerial tech <b>↗</b></span>
          </div>
          <div className="spotlight-orbit orbit-a" />
          <div className="spotlight-orbit orbit-b" />
          <div className="spotlight-caption"><span>PRECISION IN EVERY FRAME</span><span>DESIGNED TO EXPLORE</span></div>
        </Link>
      </div>
      <div className="cinema-bottomline"><span>NAIJA GADGETS</span><span>Curiosity looks good on you.</span><Link href="/shop">SHOP ALL GADGETS <b>↓</b></Link></div>
    </section>
  );
}
