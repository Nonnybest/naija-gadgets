import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="jumia-footer">
      <div className="wrap">
        <div className="footer-columns">
          {/* Col 1: About */}
          <div className="footer-col">
            <h4 className="footer-logo">Naija Gadgets</h4>
            <p className="footer-desc">
              Nigeria's #1 marketplace for cutting-edge 2026 connected technology. Specializing exclusively
              in Single-Board Computers, biometric smart locks, Wi-Fi 7 IoT mesh, cyber tools, and autonomous robotics.
            </p>
            <div className="footer-guarantee-pill">
              🛡️ 100% Verified Authentic Hardware
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h5>2026 Categories</h5>
            <ul className="footer-links">
              <li><Link href="/shop">Raspberry Pi 5 & Edge AI</Link></li>
              <li><Link href="/shop">Smart Biometric Locks</Link></li>
              <li><Link href="/shop">Matter & Thread IoT Hubs</Link></li>
              <li><Link href="/shop">Autonomous Camera Drones</Link></li>
              <li><Link href="/shop">Flipper Zero & Sub-GHz SDR</Link></li>
              <li><Link href="/shop">Smart Health Rings & AR</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Account */}
          <div className="footer-col">
            <h5>Customer & Orders</h5>
            <ul className="footer-links">
              <li><Link href="/account">My Account & Orders</Link></li>
              <li><Link href="/cart">Shopping Cart</Link></li>
              <li><Link href="/shop">Browse All Gadgets</Link></li>
              <li><Link href="/account">Order Tracking & Returns</Link></li>
              <li><a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">WhatsApp Customer Care</a></li>
            </ul>
          </div>

          {/* Col 4: Operations & AI Hub */}
          <div className="footer-col">
            <h5>Management & AI Hub</h5>
            <ul className="footer-links">
              <li><Link href="/admin">Stock Management</Link></li>
              <li><Link href="/admin/agents">🤖 AI Staff Desk (Ollama 1B)</Link></li>
              <li><span className="footer-badge-tech">VPS: 84.8.149.230</span></li>
              <li><span className="footer-badge-tech">Database: Supabase 15</span></li>
              <li><span className="footer-badge-tech">Model: llama3.2:1b</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Naija Gadgets Marketplace Ltd. All rights reserved.</p>
          <p className="footer-compliance">
            Transactions secured by <strong>Flutterwave</strong>. Consumer rights compliant under FCCPC & NDPA 2023.
          </p>
        </div>
      </div>
    </footer>
  );
}
