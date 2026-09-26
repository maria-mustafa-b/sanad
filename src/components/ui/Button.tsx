import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'inverse' | 'outlineInverse';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  loading?: boolean;
}

/** Distinct treatments — text colors are locked per variant for contrast */
const variants: Record<Variant, string> = {
  primary:
    'bg-brand !text-white font-semibold shadow-btn hover:bg-brand-dark hover:shadow-btn-hover hover:-translate-y-px active:translate-y-0 active:shadow-btn disabled:bg-brand/45 disabled:shadow-none disabled:translate-y-0',
  secondary:
    'bg-brand-muted !text-brand-dark font-semibold border border-transparent hover:border-brand/20 hover:bg-brand/10 active:bg-brand/15 disabled:opacity-50',
  outline:
    'bg-white !text-ink font-medium border border-border-strong shadow-none hover:border-brand/40 hover:!text-brand-dark hover:bg-brand-soft/60 active:bg-brand-soft disabled:opacity-50',
  ghost:
    'bg-transparent !text-ink-secondary font-medium border border-transparent shadow-none hover:!text-brand-dark hover:bg-brand-muted/70 active:bg-brand-muted disabled:opacity-50',
  danger:
    'bg-danger !text-white font-semibold shadow-btn hover:brightness-95 hover:-translate-y-px active:translate-y-0 disabled:opacity-50',
  /** White fill on dark surfaces — always dark teal text */
  inverse:
    'bg-white !text-brand-dark font-semibold shadow-elev hover:bg-brand-muted active:bg-brand-muted/80 disabled:opacity-50',
  /** Hollow on dark surfaces — always white text */
  outlineInverse:
    'bg-transparent !text-white font-medium border border-white/40 shadow-none hover:bg-white/10 hover:border-white/60 active:bg-white/15 disabled:opacity-50',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-md',
  md: 'h-11 px-5 text-sm gap-2 min-h-touch rounded-lg',
  lg: 'h-12 px-7 text-[15px] gap-2.5 min-h-touch rounded-xl tracking-[-0.01em]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  loading,
  className = '',
  children,
  disabled,
  ...rest
}) => (
  <button
    className={`inline-flex items-center justify-center transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
    ) : (
      leftIcon && (
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 500" }}>
          {leftIcon}
        </span>
      )
    )}
    {children != null && children !== false && (
      <span className="leading-none">{children}</span>
    )}
    {rightIcon && !loading && (
      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 500" }}>
        {rightIcon}
      </span>
    )}
  </button>
);
