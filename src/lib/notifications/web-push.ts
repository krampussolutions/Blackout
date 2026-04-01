import crypto, { KeyObject } from "crypto";

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

function getVapidPrivateKeyRaw() {
  return process.env.VAPID_PRIVATE_KEY || "";
}

export function isWebPushConfigured() {
  return Boolean(getVapidPublicKeyBase64() && getVapidPrivateKeyRaw());
}

export function urlBase64ToUint8Array(base64String: string) {
  const buffer = base64UrlDecodeToBuffer(base64String);
  return new Uint8Array(buffer);
}

function createPrivateKey(): KeyObject {
  const privateKey = getVapidPrivateKeyRaw().trim();

  if (!privateKey) {
    throw new Error("Missing VAPID private key.");
  }

  if (privateKey.includes("BEGIN PRIVATE KEY")) {
    return crypto.createPrivateKey(privateKey);
  }

  const publicKey = base64UrlDecodeToBuffer(getVapidPublicKeyBase64());
  const privateKeyBytes = base64UrlDecodeToBuffer(privateKey);

  if (publicKey.length !== 65 || publicKey[0] !== 0x04 || privateKeyBytes.length !== 32) {
    throw new Error("Invalid VAPID key format.");
  }

  const x = publicKey.subarray(1, 33);
  const y = publicKey.subarray(33, 65);

  return crypto.createPrivateKey({
    key: {
      kty: "EC",
      crv: "P-256",
      x: base64UrlEncode(x),
      y: base64UrlEncode(y),
      d: base64UrlEncode(privateKeyBytes),
    },
    format: "jwk",
  });
}

function createJwt(endpoint: string) {
  const publicKey = getVapidPublicKeyBase64();

  if (!publicKey) {
    throw new Error("Missing VAPID public key.");
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
    key: createPrivateKey(),
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
      "Content-Length": "0",
    },
  });

  return response;
}
