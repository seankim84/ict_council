export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-bg-secondary/40 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 text-sm text-text-secondary md:px-12">
        <p className="font-medium text-text-primary">KOCHAM ICT 협의회</p>
        <p>KOCHAM ICT Council for members and partners in Vietnam.</p>
        <p>© {new Date().getFullYear()} KOCHAM ICT Council. All rights reserved.</p>
      </div>
    </footer>
  );
}
