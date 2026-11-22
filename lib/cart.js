'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  const add = (p) => {
    if (!p || !p.id || p.stock < 1) return;
    setItems((c) => {
      const exists = c.find((i) => i.id === p.id);
      if (exists) {
        return c.map((i) =>
          i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i
        );
      }
      return [...c, { id: p.id, name: p.name, price: p.price, stock: p.stock, qty: 1 }];
    });
  };

  const setQty = (id, qty) =>
    setItems((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: Math.min(Math.max(0, Number(qty) || 0), i.stock) } : i))
        .filter((i) => i.qty > 0)
    );

  const clear = () => setItems([]);
  const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);

  return <Ctx.Provider value={{ items, add, setQty, clear, subtotal }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx) || { items: [], add: () => {}, setQty: () => {}, clear: () => {}, subtotal: 0 };
