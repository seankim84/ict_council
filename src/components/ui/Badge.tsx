import type { PropsWithChildren } from 'react';

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex rounded-full border border-[var(--color-border)] bg-accent-subtle px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
      {children}
    </span>
  );
}
