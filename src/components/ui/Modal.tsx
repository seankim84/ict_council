'use client';

import type { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  title: string;
  open: boolean;
  onClose: () => void;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-text-secondary hover:text-accent" type="button">
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
