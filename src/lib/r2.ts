/**
 * Cloudflare R2 Client Configuration
 *
 * Cloudflare R2 is S3-compatible, so we use the AWS SDK.
 * Install: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *
 * Required environment variables:
 *   CLOUDFLARE_R2_ACCOUNT_ID     - Your Cloudflare Account ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID  - R2 API Token Access Key
 *   CLOUDFLARE_R2_SECRET_KEY     - R2 API Token Secret Key
 *   CLOUDFLARE_R2_BUCKET_NAME    - Bucket name (e.g. "sabeh-media")
 *   CLOUDFLARE_R2_PUBLIC_URL     - Public bucket URL (e.g. "https://media.sabeh.com")
 */

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_KEY;

export const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? "sabeh-media";
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "";

/** True when all three R2 credentials are present in the environment. */
export const isR2Configured =
  !!R2_ACCOUNT_ID && !!R2_ACCESS_KEY_ID && !!R2_SECRET_KEY;

/**
 * Returns an S3Client pointed at Cloudflare R2.
 * Uses a dynamic import so the build succeeds even when @aws-sdk/client-s3 is absent.
 * Only call this after confirming `isR2Configured === true`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getR2Client(): Promise<any> {
  if (!isR2Configured) {
    throw new Error(
      "Cloudflare R2 is not configured. Add CLOUDFLARE_R2_ACCOUNT_ID, " +
        "CLOUDFLARE_R2_ACCESS_KEY_ID, and CLOUDFLARE_R2_SECRET_KEY to your .env file."
    );
  }

  // Dynamic import — no static dependency on the AWS SDK package
  // @ts-ignore — install @aws-sdk/client-s3 to resolve
  const { S3Client } = await import("@aws-sdk/client-s3");

  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_KEY!,
    },
  });
}

/** Build the public CDN URL for a stored R2 key. */
export function getPublicUrl(key: string): string {
  if (!R2_PUBLIC_URL) {
    throw new Error("CLOUDFLARE_R2_PUBLIC_URL is not set in environment.");
  }
  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

/**
 * Generate a unique storage key.
 * Pattern: {entityType}/{uuid}/{sanitised-filename}
 */
export function generateStorageKey(entityType: string, fileName: string): string {
  const uuid = crypto.randomUUID();
  const sanitised = fileName.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  return `${entityType}/${uuid}/${sanitised}`;
}
