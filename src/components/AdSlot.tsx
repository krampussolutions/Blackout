"use client";

import { useEffect, useMemo, useRef } from "react";

type AdSlotProps = {
  className?: string;
  title?: string;
  variant?: "wide" | "rail" | "card" | "sidebar" | "in-article";
  slot?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5957528671321920";

const VARIANT_SLOT_ENV: Record<NonNullable<AdSlotProps["variant"]>, string | undefined> = {
  wide: process.env.NEXT_PUBLIC_ADSENSE_WIDE_SLOT,
  rail: process.env.NEXT_PUBLIC_ADSENSE_RAIL_SLOT,
  card: process.env.NEXT_PUBLIC_ADSENSE_CARD_SLOT,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT,
  "in-article": process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT,
};

export default function AdSlot({
  className = "",
  title = "Sponsored",
  variant = "card",
  slot,
}: AdSlotProps) {
  const initializedRef = useRef(false);
  const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true";
  const liveAdsEnabled = process.env.NODE_ENV === "production";
  const resolvedSlot = slot || VARIANT_SLOT_ENV[variant];

  const variantClasses =
    variant === "wide"
      ? "min-h-[140px]"
      : variant === "rail"
      ? "min-h-[280px]"
      : variant === "sidebar"
      ? "min-h-[320px]"
      : variant === "in-article"
      ? "min-h-[220px]"
      : "min-h-[120px]";

  const adAttributes = useMemo(() => {
    if (variant === "in-article") {
      return {
        format: "fluid",
        layout: "in-article",
      };
    }

    return {
      format: "auto",
      layout: undefined,
    };
  }, [variant]);

  useEffect(() => {
    if (!liveAdsEnabled || !resolvedSlot || initializedRef.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch {
      // Ignore ad push errors caused by blocked scripts or duplicate init.
    }
  }, [liveAdsEnabled, resolvedSlot]);

  if (!liveAdsEnabled || !resolvedSlot) {
    if (!showPlaceholders) {
      return null;
    }

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
          {resolvedSlot
            ? "Ad placeholder visible in development."
            : "Add an AdSense slot ID to show this placement live."}
        </div>
      </div>
    );
  }

  return (
    <div className={`card overflow-hidden ${variantClasses} ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{title}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted/70">Ad</span>
      </div>
      <div className="px-3 py-4">
        <ins
          className="adsbygoogle block w-full overflow-hidden"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={resolvedSlot}
          data-ad-format={adAttributes.format}
          data-ad-layout={adAttributes.layout}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
