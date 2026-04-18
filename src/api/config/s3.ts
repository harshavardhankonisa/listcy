import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'
import { AWS_REGION, IS_LOCAL_AWS } from './aws'

if (!process.env.S3_BUCKET) throw new Error('S3_BUCKET is not set')

if (!AWS_REGION) throw new Error('AWS_REGION is not set')

if (typeof IS_LOCAL_AWS === 'undefined')
  throw new Error('IS_LOCAL_AWS is not set')

export const s3 = new S3Client({
  region: AWS_REGION,
  forcePathStyle: !!IS_LOCAL_AWS,
})

export const S3_BUCKET = process.env.S3_BUCKET
