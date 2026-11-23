import Link from 'next/link';
import LiveMotionHero from '@/components/LiveMotionHero';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { INITIAL_PRODUCTS } from '@/lib/products-data';

export const revalidate = 60;

const CATEGORIES = [
  { name: 'Raspberry Pi & Single Board Computers', title: 'Build something brilliant', detail: 'Tiny boards. Big ideas.', icon: '◈', tone: 'mint' },
  { name: 'Smart Locks & Biometric Access', title: 'A smarter kind of secure', detail: 'Access on your terms.', icon: '⌑', tone: 'sand' },
  { name: 'Smart Home & Matter Hubs', title: 'Everything in sync', detail: 'One home. Better connected.', icon: '◎', tone: 'blue' },
  { name: 'Drones, Gimbal & Robotics', title: 'Take the wider view', detail: 'New perspectives await.', icon: '✧', tone: 'lavender' },
  { name: 'Hacking, SDR & Radio Tools', title: 'For the curious minds', detail: 'Tools for hands-on makers.', icon: '⌁', tone: 'peach' },
  { name: 'Wearables, AR & Smart Rings', title: 'Technology, in tune', detail: 'Thoughtful tech that moves with you.', icon: '◌', tone: 'rose' },
  { name: 'Smart Security & Surveillance', title: 'Peace of mind, powered', detail: 'A clearer view, day and night.', icon: '◉', tone: 'sky' },
  { name: 'Sensors, Lab & Workshop Gadgets', title: 'Make the next move', detail: 'Precision for every project.', icon: '⌬', tone: 'lime' },
];

export default async function Home() {
  let featuredProducts = [];

  try {
    const { data } = await supabase
      .from('ng_products')
      .select('*')
      .eq('featured', true)
      .limit(8);
    if (data && data.length > 0) {
      featuredProducts = data;
    } else {
      featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured);
    }
  } catch (err) {
    featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured);
  }

  return (
    <main className="home-page">
      <LiveMotionHero />

      <section className="home-section category-section">
        <div className="wrap">
          <div className="editorial-heading">
            <div>
              <span className="section-kicker">A WORLD OF POSSIBILITY</span>
              <h2>Find your kind of clever.</h2>
              <p>Start with what sparks your curiosity.</p>
            </div>
            <Link href="/shop" className="quiet-link">Explore every category <span>↗</span></Link>
          </div>

          <div className="department-grid">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={`/shop?cat=${encodeURIComponent(category.name)}`}
                className={`department-card department-${category.tone}`}
              >
                <span className="department-icon" aria-hidden="true">{category.icon}</span>
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.detail}</p>
                </div>
                <span className="department-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section featured-section" id="featured">
        <div className="wrap">
          <div className="editorial-heading">
            <div>
              <span className="section-kicker">THE GOOD STUFF</span>
              <h2>Picked for your next big idea.</h2>
              <p>A few favorites from our world of connected tech.</p>
            </div>
            <Link href="/shop" className="quiet-link">See all gadgets <span>↗</span></Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="jumia-grid featured-grid">
              {featuredProducts.slice(0, 4).map((product) => <ProductCard key={product.id} p={product} />)}
            </div>
          ) : (
            <div className="catalog-invite">
              <span>New</span><div><h3>There’s more to discover.</h3><p>Browse the full collection of smart gadgets and maker essentials.</p></div>
              <Link href="/shop" className="cinema-button">Browse the shop <span>↗</span></Link>
            </div>
          )}
        </div>
      </section>

      <section className="delivery-story">
        <div className="wrap delivery-story-inner">
          <div><span className="section-kicker">MADE FOR EVERYDAY INGENUITY</span><h2>Good tech should feel easy.</h2></div>
          <div className="delivery-points">
            <div><span>01</span><p>Carefully selected gadgets</p></div>
            <div><span>02</span><p>Delivery across Nigeria</p></div>
            <div><span>03</span><p>Real help when you need it</p></div>
          </div>
          <Link href="/shop" className="delivery-link">Let’s find your next favorite <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}
