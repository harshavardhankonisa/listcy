import 'server-only'

import { SESv2Client } from '@aws-sdk/client-sesv2'
import { AWS_REGION } from './aws'

if (!process.env.SES_FROM_EMAIL) throw new Error('SES_FROM_EMAIL is not set')

export const ses = new SESv2Client({ region: AWS_REGION })

export const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL
