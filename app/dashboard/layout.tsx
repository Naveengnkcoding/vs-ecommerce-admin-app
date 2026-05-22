'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, logout } from '@/lib/user'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, Users, FileText, ShoppingCart, Printer, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn()) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    // { href: '/dashboard/orders', label: 'Orders & Billing', icon: ShoppingCart },
    { href: '/dashboard/billing', label: 'Billing Print', icon: Printer },
    { href: '/dashboard/blog', label: 'Blog & News', icon: FileText },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #a0dac3, #02ca78)' }}>
              <img src="/icon.png" alt="Vellore Santhai Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vellore Santhai</h1>
              <p className="text-xs text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.deshkeyboard.com/tamil-typing/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-50"
            >
              Tamil Typing Keypad
            </a>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hover:cursor-pointer gap-2 h-10 text-red-600 border-red-300 hover:bg-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200 shadow-sm">
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

          {/* <div className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Use the sidebar to navigate between different sections of the admin panel.
            </p>
          </div> */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
