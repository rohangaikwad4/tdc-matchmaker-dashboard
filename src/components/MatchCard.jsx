import { generateScoreLabel } from '@/lib/ai';
import Avatar from './Avatar';

export default function MatchCard({ match, onSendMatch, onViewProfile }) {
  const scoreInfo = generateScoreLabel(match.score);
  const p = match.profile;

  return (
    <div className="tdc-card p-4 transition-all duration-200 hover:shadow-md hover:border-tdc-gold-400">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onViewProfile?.(match)}
          className="shrink-0 focus:outline-none focus:ring-2 focus:ring-tdc-gold-400 rounded-full"
          title={`View ${p.firstName}'s full profile`}
        >
          <Avatar firstName={p.firstName} lastName={p.lastName} size="sm" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => onViewProfile?.(match)}
              className="font-medium text-gray-900 text-sm truncate hover:text-tdc-gold-600 text-left transition-colors"
            >
              {p.firstName} {p.lastName}, {p.age}
            </button>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border whitespace-nowrap shrink-0 ${scoreInfo.color}`}
            >
              {scoreInfo.icon} {scoreInfo.label}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            {p.city} · {p.designation}
          </p>

          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {match.reasons.slice(0, 2).join(' · ')}
          </p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onViewProfile?.(match)}
              className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              View Profile
            </button>
            <button
              onClick={() => onSendMatch(match)}
              className="text-xs px-3 py-1.5 tdc-btn tdc-btn-sm"
            >
              Send Match →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
