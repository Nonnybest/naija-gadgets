import Link from 'next/link';
import LiveMotionHero from '@/components/LiveMotionHero';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

const CATEGORY_TILES = [
  { name: 'Single-Board Computers & Edge AI', icon: '🧠', tag: 'Raspberry Pi 5 • 26 TOPS' },
  { name: 'Smart Locks & Biometric Security', icon: '🔒', tag: 'Face ID • Bluetooth BLE' },
  { name: 'IoT Hubs & Wireless Mesh', icon: '🌐', tag: 'Matter • Thread • Zigbee 3.0' },
  { name: 'Autonomous Drones & Aerial Robotics', icon: '🛸', tag: '4K LiDAR • 20km O4 Link' },
  { name: 'Hardware Security & Cyber Tools', icon: '⚡', tag: 'Flipper Zero • SDR Sub-GHz' },
  { name: 'Wearable Tech & Smart Rings', icon: '💍', tag: 'Titanium HRV • AR Glasses' },
  { name: 'Smart Surveillance & Solar Security', icon: '☀️', tag: 'Dual 4K PTZ • Cellular 4G' },
  { name: 'Robotics & Sensors', icon: '🤖', tag: 'LiDAR Sensors • ROS2 Kits' },
];

export default async function Home() {
  let featuredProducts = [];
  let flashSaleProducts = [];

  try {
    const { data: featured } = await supabase
      .from('ng_products')
      .select('*')
      .eq('featured', true)
      .limit(8);

    if (featured) featuredProducts = featured;

    // Flash sale products: select top products with good stock
    const { data: flash } = await supabase
      .from('ng_products')
      .select('*')
      .order('price', { ascending: false })
      .limit(6);

    if (flash) flashSaleProducts = flash;
  } catch (err) {
    console.error('Failed to load marketplace products:', err);
  }

  return (
    <>
      {/* 1. Cinematic 2026 Live Motion Hero with Floating Gadgets and Auth Portal */}
      <LiveMotionHero />

      {/* 2. Jumia-Style Flash Sales Section with Countdown Timer */}
      <section id="flash-sales" className="flash-sales-section">
        <div className="wrap">
          <div className="flash-sales-header">
            <div className="flash-title-group">
              <span className="flash-flame">🔥</span>
              <div>
                <h2>FLASH SALES</h2>
                <p className="muted" style={{ margin: 0, fontSize: '0.85rem', color: '#ffb3ba' }}>
                  Limited Time Offers on 2026 Flagship Hardware • Free Delivery in Lagos & Abuja
                </p>
              </div>
            </div>

            <div className="flash-timer-box">
              <span className="timer-label">TIME LEFT:</span>
              <div className="timer-digits">
                <span className="digit">07</span>h : <span className="digit">48</span>m : <span className="digit">22</span>s
              </div>
            </div>

            <Link href="/shop" className="see-all-link">
              SEE ALL FLASH DEALS →
            </Link>
          </div>

          <div className="jumia-grid" style={{ marginTop: 16 }}>
            {(flashSaleProducts.length > 0 ? flashSaleProducts : featuredProducts).slice(0, 6).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Marketplace Categories Strip */}
      <section className="categories-showcase-section">
        <div className="wrap">
          <div className="section-title-row">
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Browse by Category</h2>
              <p className="muted" style={{ margin: '4px 0 0 0' }}>
                All hardware guaranteed with Bluetooth LE, Wi-Fi 7, Matter, Sub-GHz or Edge AI.
              </p>
            </div>
            <Link href="/shop" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              View All 500 Items
            </Link>
          </div>

          <div className="cat-tiles-grid">
            {CATEGORY_TILES.map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                className="cat-tile-card"
              >
                <div className="cat-tile-icon">{cat.icon}</div>
                <div className="cat-tile-info">
                  <h4>{cat.name}</h4>
                  <span className="cat-tile-tag">{cat.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular & Trending Right Now Grid */}
      <section className="wrap" style={{ marginTop: 40 }}>
        <div className="section-title-row">
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>⚡ Trending Smart Tech in Nigeria</h2>
            <p className="muted" style={{ margin: '4px 0 0 0' }}>
              Handpicked 2026 flagships backed by full local warranty and real-time customer support.
            </p>
          </div>
          <Link href="/shop" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Browse Full Catalog ({featuredProducts.length * 60}+)
          </Link>
        </div>

        <div className="jumia-grid" style={{ marginTop: 20 }}>
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* 5. Trust & Marketplace Assurance Banner */}
      <section className="marketplace-trust-banner">
        <div className="wrap">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">🛡️</div>
              <div>
                <h4>100% Genuine 2026 Hardware</h4>
                <p>Zero clones or refurbished phones. Direct factory authentic smart devices.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🚚</div>
              <div>
                <h4>Nationwide Delivery</h4>
                <p>Fast doorstep delivery to Lagos, Abuja, Port Harcourt, and all 36 states.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔒</div>
              <div>
                <h4>Paystack Encrypted Checkout</h4>
                <p>Card, Bank Transfer, USSD. All transactions 256-bit SSL encrypted.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🤖</div>
              <div>
                <h4>AI-Powered Support Desk</h4>
                <p>24/7 autonomous order tracking & technician support powered by local Ollama.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
