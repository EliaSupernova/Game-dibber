const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#A78BFA",
  "#F97316",
  "#34D399",
  "#F472B6",
  "#60A5FA",
  "#FBBF24",
  "#E879F9",
];

export default function PlayerBanner({ playerNumber, totalPlayers }) {
  const color = colors[(playerNumber - 1) % colors.length];

  return (
    <div className="player-banner" style={{ backgroundColor: color }}>
      <span>
        Player {playerNumber} of {totalPlayers}
      </span>
    </div>
  );
}
