import { createContext, useContext, useEffect, useRef, createElement } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollTo = (target, options = {}) => {
    lenisRef.current?.scrollTo(target, {
      offset: -100,
      duration: 1.5,
      ...options,
    });
  };

  return createElement(
    LenisContext.Provider,
    { value: { lenis: lenisRef.current, scrollTo } },
    children
  );
};

export const useLenis = () => useContext(LenisContext);

export default LenisProvider;