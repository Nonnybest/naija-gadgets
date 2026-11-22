'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const stages = [
  { t: 'Charge faster.', s: 'Fast chargers, tough cables and power banks that outlast the blackout.', c: '#FFC21A', r: 14 },
  { t: 'Watch closer.', s: 'Smart cams and smartwatch gear for home, shop and wrist.', c: '#1F9D55', r: 50 },
  { t: 'Build your own Jarvis.', s: 'Smart home hubs that run your lights, plugs and sensors.', c: '#4DA3FF', r: 28 },
];

function Stage({ st, i, p, still }) {
  const a = i / 3, b = (i + 1) / 3;
  const opacity = useTransform(p, [a, a + 0.06, b - 0.06, b], [i === 0 ? 1 : 0, 1, 1, i === 2 ? 1 : 0], { clamp: true });
  const pointerEvents = useTransform(opacity, (v) => (v > 0.2 ? 'auto' : 'none'));
  const y = useTransform(p, [a, b], [30, -30], { clamp: true });
  const rotate = useTransform(p, [a, b], [-20, 20], { clamp: true });
  const rotY = useTransform(p, [a, b], [-35, 35], { clamp: true });

  return (
    <motion.div className="stage" style={still ? {} : { opacity, pointerEvents }}>
      <div className="stage-text">
        <h1>{st.t}</h1>
        <p>{st.s}</p>
        <Link className="btn" href="/shop">Shop now</Link>
      </div>
      <motion.div
        className="device"
        style={still ? { background: st.c, borderRadius: st.r } : { background: st.c, borderRadius: st.r, y, rotate, rotateY: rotY }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (mounted && still) {
    return (
      <section className="hero-still">
        {stages.map((s, i) => (
          <Stage key={i} st={s} i={i} p={scrollYProgress} still />
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className="hero">
      <div className="hero-sticky">
        {stages.map((s, i) => (
          <Stage key={i} st={s} i={i} p={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
