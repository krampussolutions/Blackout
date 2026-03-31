export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "group_join"
  | "message"
  | "invite_accepted"
  | "system";

export type NotificationMetadata = Record<string, string | null>;

export type NotificationRecord = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  post_id: string | null;
  comment_id: string | null;
  group_id: string | null;
  message_id: string | null;
  metadata: NotificationMetadata | null;
  read_at: string | null;
  created_at: string;
};

export type NotificationPreferences = {
  user_id: string;
  email_enabled: boolean;
  email_like: boolean;
  email_comment: boolean;
  email_follow: boolean;
  email_group_join: boolean;
  email_message: boolean;
  email_invite_accepted: boolean;
  email_system: boolean;
  push_enabled: boolean;
  push_like: boolean;
  push_comment: boolean;
  push_follow: boolean;
  push_group_join: boolean;
  push_message: boolean;
  push_invite_accepted: boolean;
  push_system: boolean;
};
