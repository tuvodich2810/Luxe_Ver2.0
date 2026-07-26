import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant  = 'primary',
  size     = 'md',
  full     = false,
  loading  = false,
  disabled = false,
  icon,
  iconRight,
  className = '',
  type = 'button',
  onClick,
  ...rest
}, ref) => {
  const varMap = {
    primary:       'btn-primary',
    gold:          'btn-gold',
    outline:       'btn-outline',
    'outline-gold':'btn-outline-gold',
    ghost:         'btn-ghost',
    danger:        'btn-danger',
    icon:          'btn-icon',
  };
  const sizeMap = { sm:'btn-sm', md:'btn-md', lg:'btn-lg' };

  const classes = [
    'btn',
    varMap[variant]  || 'btn-primary',
    variant !== 'icon' ? (sizeMap[size] || 'btn-md') : '',
    full ? 'btn-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref} type={type} onClick={onClick}
      disabled={disabled || loading}
      className={classes} {...rest}
    >
      {loading && <span className="btn-spinner" />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;