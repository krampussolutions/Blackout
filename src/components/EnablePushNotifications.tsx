"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { urlBase64ToUint8Array } from "@/lib/notifications/base64";

type EnablePushNotificationsProps = {
  vapidPublicKey?: string;
};

type PushStatus = "unsupported" | "blocked" | "idle" | "enabled";

export default function EnablePushNotifications({ vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "" }: EnablePushNotificationsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<PushStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (typeof window === "undefined") return;
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        setErrorMessage("");
        return;
      }

      if (Notification.permission === "denied") {
        setStatus("blocked");
        setErrorMessage("Your browser has notifications blocked for this site.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          if (!cancelled) {
            setStatus("idle");
            setErrorMessage("");
          }
          return;
        }

        const response = await fetch("/api/push/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        const data = (await response.json().catch(() => ({}))) as {
          enabled?: boolean;
          assignedElsewhere?: boolean;
          error?: string;
        };

        if (!response.ok) {
          if (!cancelled) {
            setStatus("idle");
            setErrorMessage(data.error || "Could not check browser push status.");
          }
          return;
        }

        if (!cancelled) {
          setStatus(data.enabled ? "enabled" : "idle");
          setErrorMessage(
            data.assignedElsewhere
              ? "This browser subscription belongs to a different account. Enabling push here will move it to this account."
              : ""
          );
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("idle");
          setErrorMessage(error instanceof Error ? error.message : "Could not check browser push status.");
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function enablePush() {
    if (!vapidPublicKey) {
      setErrorMessage("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY in your environment variables.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login?redirect_to=/settings/notifications";
        return;
      }

      if (typeof window === "undefined" || !("Notification" in window)) {
        setStatus("unsupported");
        setErrorMessage("This browser does not support notifications.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "idle");
        setErrorMessage(
          permission === "denied"
            ? "Browser permission is blocked. Allow notifications in your browser settings and try again."
            : "Notification permission was dismissed."
        );
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

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("idle");
        setErrorMessage(data.error || "Could not save this browser push subscription.");
        return;
      }

      setStatus("enabled");
      setErrorMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not enable browser push notifications.";
      setStatus("idle");
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  async function disablePush() {
    setLoading(true);
    setErrorMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const response = await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        const data = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          setErrorMessage(data.error || "Could not disable browser push for this device.");
          return;
        }

        await subscription.unsubscribe();
      }

      setStatus("idle");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not disable browser push notifications.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
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
      {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
    </div>
  );
}
