import crypto from "crypto";

type PushSubscriptionRow = {
  endpoint: string;
};

function base64UrlEncode(input: Buffer | string) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecodeToBuffer(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(padded, "base64");
}

function getAudience(endpoint: string) {
  const { origin } = new URL(endpoint);
  return origin;
}

function getVapidPublicKeyBase64() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || "";
}

function getVapidPrivateKeyPem() {
  return process.env.VAPID_PRIVATE_KEY || "";
}

export function isWebPushConfigured() {
  return Boolean(getVapidPublicKeyBase64() && getVapidPrivateKeyPem());
}

export function urlBase64ToUint8Array(base64String: string) {
  const buffer = base64UrlDecodeToBuffer(base64String);
  return new Uint8Array(buffer);
}

function createJwt(endpoint: string) {
  const privateKey = getVapidPrivateKeyPem();
  const publicKey = getVapidPublicKeyBase64();

  if (!privateKey || !publicKey) {
    throw new Error("Missing VAPID keys.");
  }

  const header = {
    typ: "JWT",
    alg: "ES256",
  };

  const subject = process.env.VAPID_SUBJECT || "mailto:support@blackout-network.com";
  const payload = {
    aud: getAudience(endpoint),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    sub: subject,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.sign("sha256", Buffer.from(unsigned), {
    key: privateKey,
    dsaEncoding: "ieee-p1363",
  });

  return {
    jwt: `${unsigned}.${base64UrlEncode(signature)}`,
    publicKey,
  };
}

export async function sendWebPush(subscription: PushSubscriptionRow) {
  const { jwt, publicKey } = createJwt(subscription.endpoint);
  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      TTL: "60",
      Authorization: `vapid t=${jwt}, k=${publicKey}`,
      Urgency: "normal",
    },
  });

  return response;
}
