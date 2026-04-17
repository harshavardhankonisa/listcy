// TODO: S3-compatible object storage client — NOT YET IMPLEMENTED.
//
// WHY THIS FILE EXISTS: User avatar uploads and list cover images will need
// a blob store. S3 (or an S3-compatible service like Cloudflare R2 / MinIO)
// is the intended target.
//
// HOW TO IMPLEMENT WHEN READY:
//   1. Install an S3 client:
//        npm install @aws-sdk/client-s3   (AWS S3 / R2)
//   2. Add the required env vars to infra/env/.env.* and .env.example:
//        S3_ENDPOINT, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
//   3. Implement and export a client below, e.g.:
//        import { S3Client } from '@aws-sdk/client-s3'
//        export const s3 = new S3Client({ ... })
//   4. Wire up upload/delete helpers in a new src/api/services/storage.service.ts
//
// Delete this file and replace with a real client when step 3 is done.
