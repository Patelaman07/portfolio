import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const x = c.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let W, H, nodes, raf;

    function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

    function init() {
      W = c.width = innerWidth;
      H = c.height = innerHeight;
      const n = Math.min(46, Math.round((W * H) / 32000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      }));
    }

    function frame() {
      x.clearRect(0, 0, W, H);
      const col = css('--node');
      for (const p of nodes) {
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 130) {
            x.strokeStyle = col; x.globalAlpha = (1 - d / 130) * 0.28; x.lineWidth = 1;
            x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
          }
        }
      }
      x.globalAlpha = 0.55;
      for (const p of nodes) { x.fillStyle = col; x.beginPath(); x.arc(p.x, p.y, 1.6, 0, 7); x.fill(); }
      x.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    const onResize = () => { init(); if (reduce) frame(); };
    init();
    frame();
    addEventListener('resize', onResize);
    return () => {
      removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
