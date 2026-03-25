"use client";

type AdSlotProps = {
  className?: string;
  title?: string;
  variant?: "wide" | "rail" | "card";
};

export default function AdSlot({
  className = "",
  title = "Sponsored",
  variant = "card",
}: AdSlotProps) {
  const variantClasses =
    variant === "wide"
      ? "min-h-[140px]"
      : variant === "rail"
      ? "min-h-[280px]"
      : "min-h-[120px]";

  return (
    <div
      className={`card overflow-hidden border border-white/10 bg-white/5 ${variantClasses} ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          {title}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          Ad
        </span>
      </div>

      <div className="flex min-h-[90px] items-center justify-center px-4 py-6 text-center text-sm text-white/40">
        AdSense placement area
      </div>
    </div>
  );
}