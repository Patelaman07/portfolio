import { useEffect, useRef } from 'react';

const REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;

/** Reveals `.stagger` children of the returned ref with a staggered delay on mount. */
export function useStagger(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = [...root.querySelectorAll('.stagger')];
    const timers = els.map((el, i) => {
      if (REDUCE) { el.classList.add('in'); return null; }
      return setTimeout(() => el.classList.add('in'), 40 + i * 75);
    });
    return () => timers.forEach(t => t && clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
