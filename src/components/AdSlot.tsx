export default function AdSlot({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-dashed border-border bg-panel p-5 ${className}`.trim()}>
      <div className="h-3 w-16 rounded-full bg-panelSoft" />
      <div className="mt-4 h-6 w-40 rounded-full bg-panelSoft" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded-full bg-panelSoft" />
        <div className="h-3 w-5/6 rounded-full bg-panelSoft" />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-panelSoft px-4 py-8 text-center text-xs uppercase tracking-[0.18em] text-muted">
        Ad block
      </div>
    </div>
  );
}
