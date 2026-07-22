import { NavLink, Link } from 'react-router-dom'

function DashboardIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function ProductosIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}

function PedidosIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/productos', label: 'Productos', icon: ProductosIcon },
  { to: '/admin/pedidos', label: 'Pedidos', icon: PedidosIcon },
] as const

export default function AdminSidebar() {
  return (
    <div className="flex h-full w-full flex-col bg-neutral-900/80 backdrop-blur-xl border-r border-white/[0.06]">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <span className="text-sm font-bold text-white">B</span>
        </div>
        <span className="text-sm font-semibold text-white">BDS Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              }`
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-neutral-200"
        >
          <ArrowLeftIcon />
          Volver al sitio
        </Link>
      </div>
    </div>
  )
}
