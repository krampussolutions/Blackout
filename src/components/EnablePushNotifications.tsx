"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { urlBase64ToUint8Array } from "@/lib/notifications/base64";

type EnablePushNotificationsProps = {
  vapidPublicKey?: string;
};

export default function EnablePushNotifications({ vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "" }: EnablePushNotificationsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<"unsupported" | "blocked" | "idle" | "enabled">("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (typeof window === "undefined") return;
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        setStatus("blocked");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          if (!cancelled) setStatus("idle");
          return;
        }

        const response = await fetch("/api/push/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        if (!response.ok) {
          if (!cancelled) setStatus("idle");
          return;
        }

        const data = (await response.json()) as { enabled?: boolean };
        if (!cancelled) {
          setStatus(data.enabled ? "enabled" : "idle");
        }
      } catch {
        if (!cancelled) setStatus("idle");
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function enablePush() {
    if (!vapidPublicKey) {
      alert("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY.");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      window.location.href = "/login?redirect_to=/settings/notifications";
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus(permission === "denied" ? "blocked" : "idle");
      setLoading(false);
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    if (!response.ok) {
      setStatus("idle");
      setLoading(false);
      return;
    }

    setStatus("enabled");
    setLoading(false);
  }

  async function disablePush() {
    setLoading(true);
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const response = await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      if (response.ok) {
        await subscription.unsubscribe();
      }
    }

    setStatus("idle");
    setLoading(false);
  }

  if (status === "unsupported") {
    return <p className="text-sm text-muted">This browser does not support web push notifications.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {status === "enabled" ? (
          <button type="button" className="button-secondary" onClick={disablePush} disabled={loading}>
            {loading ? "Saving..." : "Disable browser push"}
          </button>
        ) : (
          <button type="button" className="button-primary" onClick={enablePush} disabled={loading}>
            {loading ? "Saving..." : "Enable browser push"}
          </button>
        )}
        <span className="text-sm text-muted">
          {status === "enabled"
            ? "Browser push is enabled."
            : status === "blocked"
              ? "Browser permission is blocked. Allow notifications in browser settings, then try again."
              : "Push alerts are currently off on this device."}
        </span>
      </div>
    </div>
  );
}
