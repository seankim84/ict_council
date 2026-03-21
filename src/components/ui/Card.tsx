import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[rgba(59,130,246,0.15)] bg-bg-secondary p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
