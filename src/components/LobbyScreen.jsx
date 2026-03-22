import { useState } from "react";

export default function LobbyScreen({ initialRoomCode, onCreateRoom, onJoinRoom }) {
  const [tab, setTab] = useState(initialRoomCode ? "join" : "create");
  const [name, setName] = useState("");
  const [playerCount, setPlayerCount] = useState(6);
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return setError("Enter your name!");
    setLoading(true);
    setError("");
    try {
      await onCreateRoom(name.trim(), playerCount);
    } catch {
      setError("Failed to create room. Check your connection.");
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim()) return setError("Enter your name!");
    if (!roomCode.trim() || roomCode.trim().length !== 4)
      return setError("Enter a 4-letter room code!");
    setLoading(true);
    setError("");
    try {
      await onJoinRoom(name.trim(), roomCode.trim().toUpperCase());
    } catch {
      setError("Room not found or connection failed.");
      setLoading(false);
    }
  }

  return (
    <div className="lobby-screen">
      <h1 className="title">Game-dibber</h1>
      <p className="subtitle">Let Vancouver pick your family dinner!</p>

      <div className="lobby-tabs">
        <button
          className={`tab-btn ${tab === "create" ? "tab-active" : ""}`}
          onClick={() => setTab("create")}
        >
          Create Game
        </button>
        <button
          className={`tab-btn ${tab === "join" ? "tab-active" : ""}`}
          onClick={() => setTab("join")}
        >
          Join Game
        </button>
      </div>

      <div className="lobby-form">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="lobby-input"
          maxLength={20}
        />

        {tab === "create" && (
          <>
            <label className="count-label">How many people?</label>
            <div className="counter">
              <button
                onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
                className="counter-btn"
              >
                -
              </button>
              <span className="counter-value">{playerCount}</span>
              <button
                onClick={() => setPlayerCount(Math.min(10, playerCount + 1))}
                className="counter-btn"
              >
                +
              </button>
            </div>
            <button
              className="start-btn"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Game"}
            </button>
          </>
        )}

        {tab === "join" && (
          <>
            <input
              type="text"
              placeholder="Room code (e.g. XKDF)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="lobby-input room-code-input"
              maxLength={4}
            />
            <button
              className="start-btn"
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Game"}
            </button>
          </>
        )}

        {error && <p className="lobby-error">{error}</p>}
      </div>
    </div>
  );
}
