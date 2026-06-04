'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, logout } from '@/lib/user'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, Users, FileText, ShoppingCart, Printer, LogOut, Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn()) {
      router.push('/login')
    }
  }, [router])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/billing', label: 'Billing Print', icon: Printer },
    { href: '/dashboard/blog', label: 'Blog & News', icon: FileText },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #a0dac3, #02ca78)' }}
              >
                <img src="/icon.png" alt="Vellore Santhai Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">Vellore Santhai</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.deshkeyboard.com/tamil-typing/"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-green-300 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-50 whitespace-nowrap"
            >
              Tamil Typing Keypad
            </a>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hover:cursor-pointer gap-1 sm:gap-2 h-9 sm:h-10 text-red-600 border-red-300 hover:bg-red-500 px-2 sm:px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300
            lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:translate-x-0 lg:shadow-sm lg:z-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="font-semibold text-gray-800">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tamil typing link — mobile only */}
          <div className="p-3 border-b border-gray-100 lg:hidden">
            <a
              href="https://www.deshkeyboard.com/tamil-typing/"
              target="_blank"
              rel="noreferrer noopener"
              className="block w-full text-center rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 transition"
            >
              Tamil Typing Keypad
            </a>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-11 text-base font-medium transition-all ${
                      active
                        ? 'hover:cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-r-4 border-green-600'
                        : 'hover:cursor-pointer text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}