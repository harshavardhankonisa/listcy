import { redirect } from 'next/navigation'

// Redirect old /lists/new URL to the dashboard
export default function NewListRedirect() {
  redirect('/dashboard/lists/new')
}
