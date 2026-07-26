const variants = {
  default:   'lux-badge-default',
  gold:      'lux-badge-gold',
  new:       'lux-badge-new',
  used:      'lux-badge-used',
  certified: 'lux-badge-default',
  danger:    'lux-badge-danger',
  featured:  'lux-badge-fill-gold',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`lux-badge ${variants[variant] || variants.default} ${className}`}>
    {children}
  </span>
);

export default Badge;