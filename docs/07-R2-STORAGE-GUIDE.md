# SABEH IMPORTERS — Cloudflare R2 Storage Guide
## Direct Upload with Pre-signed URLs (replaces UploadThing)

---

## WHY CLOUDFLARE R2?

| Feature | UploadThing (old) | Cloudflare R2 (new) |
|---------|-------------------|---------------------|
| Free storage | 2GB | **10GB** |
| Egress fees | Yes (bandwidth costs) | **$0 forever** |
| Upload limit | 4MB (serverless) | **Unlimited** (direct to R2) |
| Pre-signed URLs | No (proxied) | **Yes** (browser → R2 direct) |
| S3-compatible | No | **Yes** (@aws-sdk/client-s3) |
| Vendor lock-in | Yes | **No** (S3 API = portable) |
| Monthly cost (10GB) | ~$10/mo | **$0** (free tier) |

---

## ARCHITECTURE: PRE-SIGNED URL FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE UPLOAD FLOW                             │
│                                                                 │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────┐    │
│  │  Browser  │     │  Next.js API  │     │  Cloudflare R2   │    │
│  │  (React)  │     │  (Server)     │     │  (Object Store)  │    │
│  └─────┬─────┘     └──────┬───────┘     └────────┬─────────┘    │
│        │                  │                       │              │
│   1. User selects         │                       │              │
│      image file(s)        │                       │              │
│        │                  │                       │              │
│   2. ──POST /api/upload/presign──►                │              │
│        │  { fileName,     │                       │              │
│        │    fileType,     │                       │              │
│        │    fileSize }    │                       │              │
│        │                  │                       │              │
│        │           3. Validate file               │              │
│        │              Generate unique key          │              │
│        │              Create pre-signed URL ──────►│              │
│        │                  │                       │              │
│        │◄── { uploadUrl, publicUrl, key } ────────│              │
│        │                  │                       │              │
│   4. ──PUT uploadUrl (binary file)───────────────►│              │
│        │    (DIRECT to R2, bypasses server!)       │              │
│        │                  │                       │              │
│        │◄───────── 200 OK ────────────────────────│              │
│        │                  │                       │              │
│   5. ──POST /api/upload/confirm──►                │              │
│        │  { key,          │                       │              │
│        │    listingId,    │                       │              │
│        │    entityType }  │                       │              │
│        │                  │                       │              │
│        │           6. Insert into                  │              │
│        │              media_assets table           │              │
│        │                  │                       │              │
│        │◄── { assetId, publicUrl } ───────────────│              │
│        │                  │                       │              │
│   7. Show preview         │                       │              │
│      in UI                │                       │              │
│        │                  │                       │              │
└─────────────────────────────────────────────────────────────────┘
```

**Key benefit:** Step 4 goes DIRECTLY from browser to R2. The Next.js server never touches the file binary. This means:
- No 4.5MB serverless function limit
- No server memory/CPU used for file transfer
- No timeouts on large files
- Faster uploads (one less hop)

---

## CLOUDFLARE R2 SETUP (One-time)

### Step 1: Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Create free account (no credit card needed for R2 free tier)

### Step 2: Create R2 Bucket
1. Dashboard → R2 Object Storage → Create Bucket
2. Bucket name: `sabeh-uploads`
3. Location: Choose closest to your users (auto is fine)

### Step 3: Enable Public Access
1. Click your bucket → Settings → Public Access
2. Enable "Allow Public Access"
3. You'll get a public URL like: `https://pub-xxxxx.r2.dev`
4. (Optional) Set up custom domain: `assets.sabeh.com`

### Step 4: Create API Token
1. R2 → Manage R2 API Tokens → Create API Token
2. Permissions: Object Read & Write
3. Specify bucket: `sabeh-uploads`
4. Copy the credentials:
   - Account ID (from dashboard URL)
   - Access Key ID
   - Secret Access Key

### Step 5: Configure .env
```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=sabeh-uploads
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### Step 6: Configure CORS (Required for browser uploads)
1. R2 → your bucket → Settings → CORS Policy
2. Add this CORS rule:
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## IMPLEMENTATION REFERENCE

### File: `src/lib/r2.ts` — R2 Client Setup

```typescript
// PSEUDO-CODE — Agent should implement this

import { S3Client } from "@aws-sdk/client-s3";

// Singleton pattern (same as db.ts)
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Generate public URL from R2 key
function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

// Generate unique key for upload
function generateKey(entityType: string, fileName: string): string {
  // Pattern: {entityType}/{uuid}/{sanitized-filename}
  // Example: listings/a1b2c3d4/product-photo.webp
  const uuid = crypto.randomUUID();
  const sanitized = fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  return `${entityType}/${uuid}/${sanitized}`;
}

export { s3Client, BUCKET, PUBLIC_URL, getPublicUrl, generateKey };
```

### File: `src/actions/upload.ts` — Server Actions

```typescript
// PSEUDO-CODE — Agent should implement this

import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET, getPublicUrl, generateKey } from "@/lib/r2";
import { db } from "@/lib/db";
import { mediaAssets } from "@/db/schema";

// VALIDATION CONSTANTS
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_LISTING = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const PRESIGN_EXPIRY = 900; // 15 minutes

// Action 1: Generate pre-signed upload URL
async function getPresignedUploadUrl(data: {
  fileName: string;
  fileType: string;
  fileSize: number;
  entityType: "listing" | "avatar" | "message" | "product";
}) {
  // 1. Validate file type
  // 2. Validate file size
  // 3. Check auth (must be logged in)
  // 4. Generate unique R2 key
  // 5. Create PutObjectCommand
  // 6. Generate pre-signed URL (15 min expiry)
  // 7. Return { uploadUrl, publicUrl, key }
}

// Action 2: Confirm upload completed
async function confirmUpload(data: {
  key: string;
  listingId?: string;
  entityType: string;
  sortOrder?: number;
}) {
  // 1. Verify file exists in R2 (HeadObjectCommand)
  // 2. Insert into media_assets table
  // 3. Return { assetId, publicUrl }
}

// Action 3: Delete upload
async function deleteUpload(assetId: string) {
  // 1. Get asset from DB
  // 2. Check ownership (user_id or ADMIN)
  // 3. Delete from R2 (DeleteObjectCommand)
  // 4. Soft delete in DB (set deleted_at)
}
```

### File: `src/components/ui/image-upload.tsx` — Client Component

```typescript
// PSEUDO-CODE — Agent should implement this
// "use client"

// Component props:
// - entityType: "listing" | "avatar" | "message" | "product"
// - maxFiles: number (default 10)
// - maxSizeMB: number (default 10)
// - value: string[] (current image URLs)
// - onChange: (urls: string[]) => void

// Internal state:
// - uploading: Map<string, { progress: number, file: File }>
// - previews: { url: string, assetId: string, sortOrder: number }[]

// Upload flow per file:
// 1. Validate locally (type + size)
// 2. Show preview immediately (URL.createObjectURL)
// 3. Call getPresignedUploadUrl() server action
// 4. PUT file to uploadUrl with XMLHttpRequest (for progress tracking)
// 5. On complete: call confirmUpload() server action
// 6. Replace preview with real publicUrl
// 7. Call onChange with updated URL array

// Features to implement:
// - Drag & drop zone (react-dropzone or native)
// - Click to browse files
// - Multi-file selection
// - Per-file progress bar
// - Drag-to-reorder (update sortOrder)
// - Delete button per image
// - Error handling (retry on failure)
// - Max files limit enforcement
```

---

## R2 KEY STRUCTURE (File Organization)

```
sabeh-uploads/                    ← Bucket root
├── listings/                     ← Marketplace listing images
│   ├── {uuid}/                   ← Unique per upload
│   │   └── product-photo.webp
│   └── {uuid}/
│       └── car-front.jpg
├── avatars/                      ← User profile photos
│   └── {uuid}/
│       └── profile.jpg
├── messages/                     ← Chat attachments
│   └── {uuid}/
│       └── receipt.png
└── products/                     ← B2B product catalog images
    └── {uuid}/
        └── catalog-item.webp
```

**Why UUIDs per upload:**
- Prevents filename collisions
- Easy to delete an entire upload (delete folder)
- Clean URL structure
- No guessable paths

---

## DATABASE: media_assets TABLE

```sql
-- This table tracks every file uploaded to R2
-- See 02-DATABASE-SCHEMA.md for full column details

CREATE TABLE media_assets (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT REFERENCES users(id),
  listing_id  TEXT REFERENCES listings(id),
  r2_key      TEXT UNIQUE NOT NULL,        -- 'listings/uuid/photo.webp'
  public_url  TEXT NOT NULL,               -- 'https://pub-xxx.r2.dev/listings/uuid/photo.webp'
  original_name TEXT,                      -- 'IMG_2847.jpg'
  mime_type   TEXT,                         -- 'image/webp'
  size_bytes  INTEGER,                     -- 2457600
  width       INTEGER,                     -- 1920
  height      INTEGER,                     -- 1080
  bucket      TEXT DEFAULT 'sabeh-uploads',
  entity_type TEXT,                         -- 'listing', 'avatar', 'message', 'product'
  sort_order  INTEGER DEFAULT 0,           -- For gallery ordering
  is_thumbnail BOOLEAN DEFAULT false,      -- Main image flag
  created_at  TIMESTAMP DEFAULT NOW(),
  deleted_at  TIMESTAMP                    -- Soft delete
);
```

**Relationship to listings:**
```
listings.images[]        → DEPRECATED (was array of URLs)
listings.thumbnail       → DEPRECATED (was single URL)

NEW: Query media_assets WHERE listing_id = X ORDER BY sort_order
     First image with is_thumbnail = true is the listing thumbnail
```

---

## CLEANUP: ORPHANED FILES

Files that were uploaded but never linked to a listing (user started upload then abandoned):

```typescript
// CRON or manual cleanup — delete orphans older than 24 hours
// Run: SELECT * FROM media_assets WHERE listing_id IS NULL AND created_at < NOW() - INTERVAL '24 hours'
// For each: DeleteObjectCommand from R2, then DELETE from DB
```

---

## FREE TIER LIMITS

| Resource | Free Allowance | After Free Tier |
|----------|---------------|-----------------|
| Storage | **10 GB/month** | $0.015/GB/month |
| Class A ops (writes) | **1,000,000/month** | $4.50 per million |
| Class B ops (reads) | **10,000,000/month** | $0.36 per million |
| Egress (bandwidth) | **Unlimited forever** | $0 always |

**For a marketplace with ~1,000 listings × 5 images avg:**
- Storage: ~5,000 images × 500KB avg = **~2.5GB** (well within 10GB free)
- Writes: ~5,000 uploads/month = **0.5% of free tier**
- Reads: ~100,000 image views/month = **1% of free tier**
- Egress: **$0 always**

**You won't pay anything until you have 20,000+ images.**

---

## MIGRATION FROM UPLOADTHING

### Files to Remove:
```
❌ src/app/api/uploadthing/core.ts
❌ src/app/api/uploadthing/route.ts
❌ src/lib/uploadthing.ts
```

### Packages to Remove:
```bash
npm uninstall uploadthing @uploadthing/react
```

### Packages to Install:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### .env Changes:
```diff
- UPLOADTHING_TOKEN=eyJhcGlLZ...

+ R2_ACCOUNT_ID=your_cloudflare_account_id
+ R2_ACCESS_KEY_ID=your_r2_access_key_id
+ R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
+ R2_BUCKET_NAME=sabeh-uploads
+ R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### Files to Create:
```
✅ src/lib/r2.ts                          ← R2 client
✅ src/actions/upload.ts                  ← Server actions
✅ src/app/api/upload/presign/route.ts    ← Pre-sign endpoint
✅ src/app/api/upload/confirm/route.ts    ← Confirm endpoint
✅ src/app/api/upload/[id]/route.ts       ← Delete endpoint
```

### Files to Refactor:
```
🔄 src/components/ui/image-upload.tsx     ← Replace UploadThing dropzone with R2 direct upload
🔄 src/db/schema.ts                      ← Add media_assets table
🔄 src/actions/marketplace.ts            ← Link media_assets to listings
```
