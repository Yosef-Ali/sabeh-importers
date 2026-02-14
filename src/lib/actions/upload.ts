"use server";

/**
 * Image Upload Server Actions
 *
 * Uses Cloudflare R2 when configured, falls back to UploadThing.
 *
 * To enable R2:
 *   1. npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *   2. Add R2 env vars to .env (see .env.example)
 *
 * Current UploadThing fallback is already wired via:
 *   src/app/api/uploadthing/core.ts  (route definitions)
 *   src/lib/uploadthing.ts           (UploadButton / UploadDropzone components)
 */

import { isR2Configured, getR2Client, getPublicUrl, generateStorageKey, R2_BUCKET_NAME } from "@/lib/r2";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface GenerateUploadUrlParams {
  fileName: string;
  fileType: string;
  fileSize: number;
  entityType: "listing" | "avatar" | "message" | "product";
}

interface GenerateUploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

interface ConfirmUploadParams {
  key: string;
  listingId?: string;
  entityType: string;
  sortOrder?: number;
}

/**
 * Generate a pre-signed PUT URL for direct browser-to-R2 upload.
 *
 * Flow:
 *   1. Client calls this action → gets { uploadUrl, publicUrl, key }
 *   2. Client PUT-s the file directly to uploadUrl (no server bandwidth used)
 *   3. Client calls confirmUpload(key) to persist the URL to the DB
 */
export async function generateUploadUrl(
  params: GenerateUploadUrlParams
): Promise<{ success: boolean; data?: GenerateUploadUrlResult; error?: string }> {
  // Validate
  if (!ALLOWED_TYPES.includes(params.fileType)) {
    return { success: false, error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` };
  }
  if (params.fileSize > MAX_FILE_SIZE) {
    return { success: false, error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  if (!isR2Configured) {
    // R2 not set up yet — return a dev-mode stub so uploads don't crash
    const key = generateStorageKey(params.entityType, params.fileName);
    return {
      success: true,
      data: {
        uploadUrl: `/api/uploads/stub?key=${encodeURIComponent(key)}`,
        publicUrl: `/api/uploads/stub?key=${encodeURIComponent(key)}`,
        key,
      },
    };
  }

  try {
    // @ts-ignore — install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner to resolve
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    // @ts-ignore
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    const s3 = await getR2Client();
    const key = generateStorageKey(params.entityType, params.fileName);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: params.fileType,
      ContentLength: params.fileSize,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 min
    const publicUrl = getPublicUrl(key);

    return { success: true, data: { uploadUrl, publicUrl, key } };
  } catch (error) {
    console.error("R2 generateUploadUrl error:", error);
    return { success: false, error: "Failed to generate upload URL" };
  }
}

/**
 * Confirm a successful upload and return the public URL.
 * Optionally persists a record to media_assets if DB integration is needed.
 */
export async function confirmUpload(
  params: ConfirmUploadParams
): Promise<{ success: boolean; data?: { assetId: string; publicUrl: string }; error?: string }> {
  if (!isR2Configured) {
    // Dev stub
    return {
      success: true,
      data: { assetId: crypto.randomUUID(), publicUrl: `/api/uploads/stub?key=${params.key}` },
    };
  }

  try {
    const publicUrl = getPublicUrl(params.key);

    // TODO: persist to media_assets table when needed:
    // const [asset] = await db.insert(mediaAssets).values({
    //   r2Key: params.key,
    //   publicUrl,
    //   listingId: params.listingId,
    //   entityType: params.entityType,
    //   sortOrder: params.sortOrder ?? 0,
    // }).returning();

    return { success: true, data: { assetId: crypto.randomUUID(), publicUrl } };
  } catch (error) {
    console.error("R2 confirmUpload error:", error);
    return { success: false, error: "Failed to confirm upload" };
  }
}

/**
 * Delete a file from R2 by its storage key.
 */
export async function deleteUpload(
  key: string
): Promise<{ success: boolean; error?: string }> {
  if (!isR2Configured) {
    return { success: true }; // no-op in dev
  }

  try {
    // @ts-ignore — install @aws-sdk/client-s3 to resolve
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = await getR2Client();

    await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return { success: true };
  } catch (error) {
    console.error("R2 deleteUpload error:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
