import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: Variant;
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200',
        variant === 'primary'
          ? 'bg-accent text-white hover:bg-accent-hover'
          : 'border border-[rgba(255,255,255,0.15)] text-text-primary hover:border-accent hover:text-accent',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
