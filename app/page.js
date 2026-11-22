import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function Home() {
  let products = [];
  try {
    const { data } = await supabase.from('ng_products').select('*').eq('featured', true).limit(8);
    if (data) products = data;
  } catch (err) {
    console.error('Failed to load featured products:', err);
  }

  return (
    <>
      <Hero />
      <section className="wrap">
        <h2>Popular right now</h2>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
