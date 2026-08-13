import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('logo'); // 'logo' | 'tagline' | 'done'

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Ease in slow, fast in middle, slow at end
        const increment = prev < 30 ? 1.8 : prev < 70 ? 2.5 : prev < 90 ? 1.2 : 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    // Phase transitions
    const t1 = setTimeout(() => setPhase('tagline'), 800);
    const t2 = setTimeout(() => setPhase('done'), 2200);
    const t3 = setTimeout(() => onComplete?.(), 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#070709',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Background subtle pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', marginBottom: 28 }}
          >
            {/* Diamond mark */}
            <div style={{
              width: 48,
              height: 48,
              position: 'relative',
              margin: '0 auto 20px',
            }}>
              <motion.div
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 45, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1.5px solid #D4AF37',
                  transform: 'rotate(45deg)',
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 10,
                  background: 'linear-gradient(135deg, #D4AF37, #F0C968)',
                }}
              />
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: "'Jost', 'Inter', sans-serif",
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              LUXE<span style={{ color: '#D4AF37' }}>MOTORS</span>
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <AnimatePresence>
            {phase === 'tagline' && (
              <motion.p
                key="tagline"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.7)',
                  fontWeight: 500,
                  textAlign: 'center',
                  marginBottom: 40,
                }}
              >
                Siêu Xe Đỉnh Cao — Trải Nghiệm Độc Quyền
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: '0%' }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: phase === 'tagline' ? 0 : 40,
              width: 200,
              height: 1,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #D4AF37, #F0C968)',
                borderRadius: 1,
                transition: 'width 0.1s linear',
              }}
            />
          </motion.div>

          {/* Progress number */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 10,
              fontFamily: "'Jost', sans-serif",
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'rgba(212,175,55,0.5)',
              fontWeight: 600,
            }}
          >
            {Math.round(progress)}%
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
