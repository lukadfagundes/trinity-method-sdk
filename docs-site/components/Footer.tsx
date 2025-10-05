import Link from 'next/link'
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/getting-started">Getting Started</FooterLink>
              <FooterLink href="/guides">Guides</FooterLink>
              <FooterLink href="/api">API Reference</FooterLink>
              <FooterLink href="/trinity-method">Trinity Method</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/guides/security">Security</FooterLink>
              <FooterLink href="/guides/performance">Performance</FooterLink>
              <FooterLink href="/guides/architecture">Architecture</FooterLink>
              <FooterLink href="/guides/quality">Quality</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/support/faq">FAQ</FooterLink>
              <FooterLink href="/support/troubleshooting">Troubleshooting</FooterLink>
              <FooterLink href="/support/community">Community</FooterLink>
              <FooterLink href="https://github.com/trinity-method/trinity-method-sdk/issues">
                Report Issue
              </FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="https://github.com/trinity-method">GitHub</FooterLink>
              <FooterLink href="/license">License</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Trinity Method. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/trinity-method"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/trinitymethod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
              aria-label="Twitter"
            >
              <FiTwitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:support@trinity-method.dev"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http')

  return (
    <li>
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
      >
        {children}
      </Link>
    </li>
  )
}
