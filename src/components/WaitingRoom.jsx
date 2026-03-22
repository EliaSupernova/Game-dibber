import { useState } from "react";

export default function WaitingRoom({
  roomCode,
  roomData,
  playerId,
  onStartQuiz,
  isHost,
}) {
  const [copied, setCopied] = useState(false);
  const players = roomData?.players ? Object.entries(roomData.players) : [];
  const playerCount = roomData?.playerCount || 0;
  const joinedCount = players.length;

  const shareUrl = `${window.location.origin}/${roomCode}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Game-dibber",
          text: `Join our dinner quiz! Room code: ${roomCode}`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a prompt
    }
  }

  return (
    <div className="waiting-room">
      <h2>Room Code</h2>
      <div className="room-code-display">{roomCode}</div>

      <button className="share-btn" onClick={handleShare}>
        {copied ? "Link Copied!" : "Share Link"}
      </button>

      <div className="player-list">
        <h3>
          Players ({joinedCount} / {playerCount})
        </h3>
        {players.map(([id, player]) => (
          <div
            key={id}
            className={`player-list-item ${id === playerId ? "player-me" : ""}`}
          >
            <span className="player-dot">&#9679;</span>
            <span>{player.name}</span>
            {id === playerId && <span className="player-you-tag">you</span>}
          </div>
        ))}
        {Array.from({ length: Math.max(0, playerCount - joinedCount) }).map(
          (_, i) => (
            <div key={`empty-${i}`} className="player-list-item player-empty">
              <span className="player-dot">&#9675;</span>
              <span>Waiting...</span>
            </div>
          )
        )}
      </div>

      {isHost && (
        <button
          className="start-btn"
          onClick={onStartQuiz}
          disabled={joinedCount < 2}
        >
          {joinedCount < 2
            ? "Need at least 2 players"
            : `Start Quiz (${joinedCount} players)`}
        </button>
      )}

      {!isHost && !roomData?.started && (
        <p className="waiting-text">Waiting for host to start the quiz...</p>
      )}
    </div>
  );
}
