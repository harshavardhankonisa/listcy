import { CreateListForm } from '@/client/lists/CreateListForm'

export const metadata = { title: 'Create a List' }

export default function NewListPage() {
  return (
    <div>
      <CreateListForm />
    </div>
  )
}
