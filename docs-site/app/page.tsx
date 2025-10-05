import Link from 'next/link'
import { FiArrowRight, FiBook, FiCode, FiZap, FiShield } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Trinity Method SDK
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Investigation-first development methodology for modern software projects.
          Build better software with systematic investigations, AI-powered agents, and comprehensive tooling.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
            <FiArrowRight />
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            View Guides
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<FiBook className="w-8 h-8" />}
          title="Investigation Wizard"
          description="Create investigations in minutes with smart templates and context detection. 90% setup time reduction."
          href="/guides/wizard"
        />
        <FeatureCard
          icon={<FiZap className="w-8 h-8" />}
          title="AI Agents"
          description="Specialized agents for technical analysis, patterns, research, and quality auditing."
          href="/agents"
        />
        <FeatureCard
          icon={<FiCode className="w-8 h-8" />}
          title="Analytics"
          description="Real-time performance analytics with anomaly detection and trend analysis."
          href="/api/analytics"
        />
        <FeatureCard
          icon={<FiShield className="w-8 h-8" />}
          title="Hook Library"
          description="28 pre-built safe hooks for automation with 0 catastrophic failures."
          href="/api/hooks"
        />
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Popular Guides
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <QuickLink
            title="Your First Investigation"
            description="Learn the basics with a hands-on security audit"
            href="/getting-started/first-investigation"
          />
          <QuickLink
            title="Security Audits"
            description="Comprehensive security review workflows"
            href="/guides/security"
          />
          <QuickLink
            title="Performance Reviews"
            description="Optimize application performance systematically"
            href="/guides/performance"
          />
          <QuickLink
            title="API Reference"
            description="Complete API documentation for all features"
            href="/api"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <StatCard number="90%" label="Time Saved" />
        <StatCard number="4" label="Investigation Types" />
        <StatCard number="28" label="Safe Hooks" />
        <StatCard number="95%" label="CI/CD Success" />
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition group"
    >
      <div className="text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </Link>
  )
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
        {number}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {label}
      </div>
    </div>
  )
}
