type AdSlotProps = {
  className?: string;
  label?: string;
};

export default function AdSlot({ className = "", label = "Sponsored" }: AdSlotProps) {
  return (
    <div className={`rounded-2xl border border-border bg-panel p-4 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted">{label}</span>
        <span className="rounded-full border border-border bg-panelSoft px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
          Auto Ads Ready
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-dashed border-border bg-panelSoft/80 px-4 py-10 text-center text-sm text-muted">
        This section is reserved for Google Auto Ads placements.
      </div>
    </div>
  );
}
