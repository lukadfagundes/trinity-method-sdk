'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { useState } from 'react'

interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', href: '/getting-started/installation' },
      { title: 'Quick Start', href: '/getting-started/quick-start' },
      { title: 'Configuration', href: '/getting-started/configuration' },
      { title: 'Your First Investigation', href: '/getting-started/first-investigation' },
    ],
  },
  {
    title: 'Investigation Guides',
    items: [
      { title: 'Security Audits', href: '/guides/security' },
      { title: 'Performance Reviews', href: '/guides/performance' },
      { title: 'Architecture Analysis', href: '/guides/architecture' },
      { title: 'Code Quality', href: '/guides/quality' },
    ],
  },
  {
    title: 'Agent Reference',
    items: [
      { title: 'TAN (Technical Analysis)', href: '/agents/tan' },
      { title: 'ZEN (Pattern Recognition)', href: '/agents/zen' },
      { title: 'INO (Research)', href: '/agents/ino' },
      { title: 'JUNO (Quality Audit)', href: '/agents/juno' },
    ],
  },
  {
    title: 'API Documentation',
    items: [
      { title: 'Core APIs', href: '/api/core' },
      { title: 'Investigation Wizard', href: '/api/wizard' },
      { title: 'Planning System', href: '/api/planning' },
      { title: 'Analytics', href: '/api/analytics' },
      { title: 'Hook Library', href: '/api/hooks' },
    ],
  },
  {
    title: 'Trinity Method',
    items: [
      { title: 'Philosophy', href: '/trinity-method/philosophy' },
      { title: 'Workflow', href: '/trinity-method/workflow' },
      { title: 'Best Practices', href: '/trinity-method/best-practices' },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Troubleshooting', href: '/support/troubleshooting' },
      { title: 'FAQ', href: '/support/faq' },
      { title: 'Community', href: '/support/community' },
    ],
  },
]

export function Sidebar() {
  return (
    <nav className="space-y-2">
      {navigation.map((section) => (
        <NavSection key={section.title} section={section} />
      ))}
    </nav>
  )
}

function NavSection({ section }: { section: NavItem }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
      >
        {section.title}
        {isOpen ? (
          <FiChevronDown className="w-4 h-4" />
        ) : (
          <FiChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && section.items && (
        <div className="mt-1 space-y-1 ml-2">
          {section.items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href || '#'}
      className={`
        block px-3 py-2 text-sm rounded-lg transition
        ${
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      {item.title}
    </Link>
  )
}
