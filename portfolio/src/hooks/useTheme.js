import { useCallback, useEffect, useState } from 'react';

const REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;

export function useTheme(){
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Circular wipe from the click point, via the View Transitions API where supported.
  const toggle = useCallback((e) => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const apply = () => { root.setAttribute('data-theme', next); setTheme(next); };

    if (REDUCE || !document.startViewTransition) { apply(); return; }

    const x = e?.clientX ?? innerWidth;
    const y = e?.clientY ?? 0;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }, []);

  return { theme, toggle };
}
