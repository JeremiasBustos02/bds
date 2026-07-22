import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminMobileMenu from './AdminMobileMenu'

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-neutral-950">
      <aside className="hidden w-64 shrink-0 md:flex">
        <AdminSidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <AdminMobileMenu />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-neutral-900/30 p-6">
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
