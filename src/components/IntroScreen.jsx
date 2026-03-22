import { useState } from "react";

export default function IntroScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(6);

  return (
    <div className="intro-screen">
      <h1 className="title">Game-dibber</h1>
      <p className="subtitle">Let Vancouver pick your family dinner!</p>

      <div className="player-count">
        <label htmlFor="players">How many people?</label>
        <div className="counter">
          <button
            onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
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
      </div>

      <button className="start-btn" onClick={() => onStart(playerCount)}>
        Let's Eat!
      </button>
    </div>
  );
}
