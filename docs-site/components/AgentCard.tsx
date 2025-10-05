/**
 * AgentCard Component
 *
 * Displays information about a Trinity AI agent
 */

import Link from 'next/link';

interface AgentCardProps {
  name: string;
  fullName: string;
  role: string;
  description: string;
  href: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'border-blue-500 hover:border-blue-400 bg-blue-500/10',
  green: 'border-green-500 hover:border-green-400 bg-green-500/10',
  purple: 'border-purple-500 hover:border-purple-400 bg-purple-500/10',
  orange: 'border-orange-500 hover:border-orange-400 bg-orange-500/10',
};

export function AgentCard({
  name,
  fullName,
  role,
  description,
  href,
  color,
}: AgentCardProps) {
  const colorClass = colorClasses[color];

  return (
    <Link
      href={href}
      className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${colorClass}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold">{name}</h3>
        <span className="text-sm opacity-60">{role}</span>
      </div>
      <p className="text-sm font-semibold mb-2 opacity-80">{fullName}</p>
      <p className="text-sm opacity-70">{description}</p>
    </Link>
  );
}
