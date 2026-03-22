import { options } from "../data/options";

export default function VoteResults({ roomData, onPlayAgain }) {
  const players = roomData?.players ? Object.values(roomData.players) : [];
  const votes = players.filter((p) => p.vote);

  // Tally votes
  const counts = {};
  for (const p of votes) {
    counts[p.vote] = (counts[p.vote] || 0) + 1;
  }

  const maxCount = Math.max(...Object.values(counts), 0);
  const winners = Object.keys(counts).filter((k) => counts[k] === maxCount);
  const winnerKey = winners[0]; // On tie, first alphabetically wins (host decides)
  const winnerOpt = options.find((o) => o.key === winnerKey);

  const sortedOptions = [...options]
    .filter((o) => counts[o.key])
    .sort((a, b) => (counts[b.key] || 0) - (counts[a.key] || 0));

  return (
    <div className="vote-results">
      {winnerOpt && (
        <div className="winner-banner">
          <div className="winner-emoji">{winnerOpt.emoji}</div>
          <h1 className="winner-name">{winnerOpt.label}</h1>
          <p className="winner-votes">
            {counts[winnerKey]} vote{counts[winnerKey] !== 1 ? "s" : ""}
          </p>
          {winners.length > 1 && (
            <p className="tie-note">Tie broken by host!</p>
          )}
        </div>
      )}

      <div className="vote-tally">
        {sortedOptions.map((opt) => (
          <div
            key={opt.key}
            className={`tally-row ${opt.key === winnerKey ? "tally-winner" : ""}`}
          >
            <span className="tally-emoji">{opt.emoji}</span>
            <span className="tally-label">{opt.label}</span>
            <div className="tally-bar-track">
              <div
                className="tally-bar-fill"
                style={{
                  width: `${((counts[opt.key] || 0) / maxCount) * 100}%`,
                }}
              />
            </div>
            <span className="tally-count">{counts[opt.key] || 0}</span>
          </div>
        ))}
      </div>

      <div className="who-voted">
        <h3>Votes</h3>
        {players.map((p, i) => {
          const opt = options.find((o) => o.key === p.vote);
          return (
            <div key={i} className="voter-row">
              <span className="voter-name">{p.name}</span>
              <span className="voter-pick">
                {opt ? `${opt.emoji} ${opt.label}` : "..."}
              </span>
            </div>
          );
        })}
      </div>

      <button className="start-btn" onClick={onPlayAgain}>
        New Vote
      </button>
    </div>
  );
}
