import ResultCard from "./ResultCard";

export default function PlayerResult({
  playerNumber,
  cuisineKey,
  onNext,
  isLast,
}) {
  return (
    <div className="player-result">
      <h2 className="player-result-title">Player {playerNumber} got...</h2>
      <ResultCard cuisineKey={cuisineKey} />
      <button className="next-btn" onClick={onNext}>
        {isLast ? "See Group Results!" : "Next Player"}
      </button>
    </div>
  );
}
