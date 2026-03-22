import { results } from "../data/results";
import ResultCard from "./ResultCard";

export default function GroupResults({ groupData, onPlayAgain }) {
  const { counts, winner, playerSummary } = groupData;

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="group-results">
      <h1 className="group-title">The Family Has Spoken!</h1>

      <div className="winner-section">
        <h2>Tonight you're eating...</h2>
        <ResultCard cuisineKey={winner} />
      </div>

      {playerSummary && playerSummary.length > 0 && (
        <div className="who-got-what">
          <h3>Who got what</h3>
          <div className="player-picks">
            {playerSummary.map((p, i) => (
              <div key={i} className="player-pick">
                <span className="player-pick-emoji">
                  {results[p.cuisine]?.emoji}
                </span>
                <span className="player-pick-name">{p.name}</span>
                <span className="player-pick-cuisine">
                  {results[p.cuisine]?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="scoreboard">
        <h3>Scoreboard</h3>
        {sorted.map(([cuisine, count]) => (
          <div
            key={cuisine}
            className={`score-row ${cuisine === winner ? "score-winner" : ""}`}
          >
            <span className="score-emoji">{results[cuisine].emoji}</span>
            <span className="score-name">{results[cuisine].name}</span>
            <div className="score-bar-track">
              <div
                className="score-bar-fill"
                style={{
                  width: `${(count / Math.max(...Object.values(counts))) * 100}%`,
                }}
              />
            </div>
            <span className="score-count">
              {count} vote{count !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>

      <button className="start-btn" onClick={onPlayAgain}>
        Play Again!
      </button>
    </div>
  );
}
