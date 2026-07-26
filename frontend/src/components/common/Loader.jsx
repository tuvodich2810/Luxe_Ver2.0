import { motion } from 'framer-motion';

const Loader = () => (
  <motion.div
    initial={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] bg-lux-black flex flex-col items-center justify-center gap-8"
  >
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 relative">
        <div className="absolute inset-0 border border-lux-gold rotate-45" />
        <div className="absolute inset-[5px] bg-lux-gold" />
      </div>
      <span style={{
        fontFamily: 'Helvetica Neue', fontSize: 18, fontWeight: 300,
        letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--white)',
      }}>
        Luxe<span style={{ color: 'var(--gold)' }}>Motors</span>
      </span>
    </div>
    <div className="w-40 h-px bg-white/8 relative overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 bg-lux-gold"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  </motion.div>
);

export default Loader;