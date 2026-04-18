import 'server-only'

import { SQSClient } from '@aws-sdk/client-sqs'
import { AWS_REGION } from './aws'

export const sqs = new SQSClient({ region: AWS_REGION })

if (!process.env.SQS_IMAGE_PROCESSING_URL)
  throw new Error('SQS_IMAGE_PROCESSING_URL is not set')
if (!process.env.SQS_EMAIL_NOTIFICATIONS_URL)
  throw new Error('SQS_EMAIL_NOTIFICATIONS_URL is not set')

export const SQS_QUEUES = {
  imageProcessing: process.env.SQS_IMAGE_PROCESSING_URL,
  emailNotifications: process.env.SQS_EMAIL_NOTIFICATIONS_URL,
} as const
