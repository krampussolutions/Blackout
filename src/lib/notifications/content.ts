import type { NotificationPreferences, NotificationRecord, NotificationType } from "@/lib/notifications/types";

function actorLabel(actor?: { username: string | null; display_name: string | null } | null) {
  return actor?.display_name || actor?.username || "Someone";
}

export function getNotificationText(
  notification: Pick<NotificationRecord, "type" | "metadata">,
  actor?: { username: string | null; display_name: string | null } | null,
) {
  const actorName = actorLabel(actor);
  switch (notification.type) {
    case "like":
      if (notification.metadata?.target === "comment") {
        return `${actorName} liked your comment${notification.metadata?.comment_excerpt ? `: ${notification.metadata.comment_excerpt}` : "."}`;
      }
      return `${actorName} liked your post${notification.metadata?.post_title ? `: ${notification.metadata.post_title}` : "."}`;
    case "comment":
      return `${actorName} commented on your post${notification.metadata?.post_title ? `: ${notification.metadata.post_title}` : "."}`;
    case "follow":
      return `${actorName} followed you.`;
    case "group_join":
      return `${actorName} joined your group${notification.metadata?.group_name ? `: ${notification.metadata.group_name}` : "."}`;
    case "message":
      return `${actorName} sent you a message.`;
    case "invite_accepted":
      return `${actorName} joined Blackout Network from your invite.`;
    default:
      return notification.metadata?.text || "You have a new notification.";
  }
}

export function getNotificationHref(
  notification: Pick<NotificationRecord, "type" | "post_id" | "group_id" | "metadata">,
  actor?: { username: string | null; display_name: string | null } | null,
) {
  if (notification.post_id) return `/posts/${notification.post_id}`;
  if (notification.group_id && notification.metadata?.group_slug) return `/groups/${notification.metadata.group_slug}`;
  if ((notification.type === "follow" || notification.type === "invite_accepted") && actor?.username) {
    return `/profile/${actor.username}`;
  }
  if (notification.type === "message" && actor?.username) {
    return `/messages/${actor.username}`;
  }
  if (notification.type === "invite_accepted") return "/invite";
  return "/settings/notifications";
}

export function isChannelEnabled(
  prefs: NotificationPreferences,
  channel: "email" | "push",
  type: NotificationType,
) {
  const enabledKey = `${channel}_enabled` as const;
  const typeKey = `${channel}_${type}` as keyof NotificationPreferences;
  return Boolean(prefs[enabledKey] && prefs[typeKey]);
}
