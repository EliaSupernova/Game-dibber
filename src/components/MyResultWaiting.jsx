import ResultCard from "./ResultCard";
import { results } from "../data/results";

export default function MyResultWaiting({ myResult, roomData }) {
  const players = roomData?.players ? Object.entries(roomData.players) : [];
  const finishedCount = players.filter(([, p]) => p.cuisine).length;
  const totalCount = players.length;

  return (
    <div className="my-result-waiting">
      <h2 className="player-result-title">You got...</h2>
      <ResultCard cuisineKey={myResult} />

      <div className="waiting-progress">
        <p className="waiting-count">
          {finishedCount} of {totalCount} finished
        </p>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(finishedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="player-status-list">
        {players.map(([id, player]) => (
          <div key={id} className="player-status-item">
            <span className="player-status-icon">
              {player.cuisine ? results[player.cuisine]?.emoji || "?" : "..."}
            </span>
            <span className="player-status-name">{player.name}</span>
            <span className="player-status-text">
              {player.cuisine ? results[player.cuisine]?.name : "Still answering..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
