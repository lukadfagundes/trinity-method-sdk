'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX, FiGithub, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from 'next-themes'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Trinity Method
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/getting-started"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Getting Started
            </Link>
            <Link
              href="/guides"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Guides
            </Link>
            <Link
              href="/agents"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Agents
            </Link>
            <Link
              href="/api"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              API
            </Link>
            <Link
              href="/trinity-method"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Trinity Method
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/trinity-method/trinity-method-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-2">
            <MobileNavLink href="/getting-started" onClick={() => setMobileMenuOpen(false)}>
              Getting Started
            </MobileNavLink>
            <MobileNavLink href="/guides" onClick={() => setMobileMenuOpen(false)}>
              Guides
            </MobileNavLink>
            <MobileNavLink href="/agents" onClick={() => setMobileMenuOpen(false)}>
              Agents
            </MobileNavLink>
            <MobileNavLink href="/api" onClick={() => setMobileMenuOpen(false)}>
              API
            </MobileNavLink>
            <MobileNavLink href="/trinity-method" onClick={() => setMobileMenuOpen(false)}>
              Trinity Method
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {children}
    </Link>
  )
}
