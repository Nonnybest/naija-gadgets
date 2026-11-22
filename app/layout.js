import './globals.css';
import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
const font = Bricolage_Grotesque({ subsets: ['latin'] });
export const metadata = { title: 'Naija Gadgets', description: 'Phone, laptop and smart-device accessories delivered across Nigeria.' };
export default function RootLayout({ children }) {
  return (
    <html lang="en"><body className={font.className}>
      <CartProvider>
        <header className="nav"><Link href="/" className="logo">Naija Gadgets</Link>
          <nav><Link href="/shop">Shop</Link><Link href="/cart">Cart</Link></nav></header>
        {children}
        <footer className="foot">Pay with card or transfer. Delivery across Nigeria. Pickup points available.</footer>
      </CartProvider>
    </body></html>
  );
}
