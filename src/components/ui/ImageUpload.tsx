'use client';

import { useRef } from 'react';

interface ImageUploadProps {
  label: string;
  onSelect: (file: File) => void;
}

export function ImageUpload({ label, onSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <p className="mb-2 text-sm text-text-secondary">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-text-secondary hover:border-accent hover:text-accent"
      >
        이미지 선택
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onSelect(file);
          }
        }}
      />
    </div>
  );
}
