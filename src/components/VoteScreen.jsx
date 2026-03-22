import { options } from "../data/options";

export default function VoteScreen({ playerName, onVote }) {
  return (
    <div className="vote-screen">
      <h2 className="vote-title">TAKEOUT VOTE</h2>
      <p className="vote-subtitle">Pick one, {playerName}!</p>
      <div className="vote-options">
        {options.map((opt) => (
          <button
            key={opt.key}
            className="vote-btn"
            onClick={() => onVote(opt.key)}
          >
            <span className="vote-letter">{opt.letter}</span>
            <span className="vote-emoji">{opt.emoji}</span>
            <span className="vote-label">
              {opt.label}
              {opt.subtitle && (
                <span className="vote-sub">{opt.subtitle}</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
