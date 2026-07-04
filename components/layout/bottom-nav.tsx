'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, BarChart3, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/surveys', label: 'Pesquisas', icon: FileText },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/profile', label: 'Perfil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/92 backdrop-blur-lg border-t border-border-light safe-bottom">
      <div className="flex items-center justify-around max-w-screen-sm mx-auto px-2.5 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 text-xs font-bold',
                'transition-colors duration-200 flex-1 relative rounded-lg',
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-gray-900'
              )}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-primary rounded-full"></span>
              )}
              <Icon size={23} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
