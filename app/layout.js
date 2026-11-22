import './globals.css';
import { Bricolage_Grotesque } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const font = Bricolage_Grotesque({ subsets: ['latin'] });

export const metadata = {
  title: 'Naija Gadgets — 2026 Smart Tech Marketplace in Nigeria',
  description:
    'Nigeria’s premier marketplace for 2026-era connected tech: Raspberry Pi 5 AI kits, biometric smart locks, Wi-Fi 7 IoT hubs, autonomous drones, and cyber pentest tools. Delivered nationwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
