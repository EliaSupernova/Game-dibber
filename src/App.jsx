import { useState } from "react";
import { options } from "./data/options";
import VoteScreen from "./components/VoteScreen";
import VoteResults from "./components/VoteResults";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | handoff | vote | results
  const [names, setNames] = useState(["", "", "", "", "", ""]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [votes, setVotes] = useState([]); // [{ name, vote }]

  function addName() {
    if (names.length < 10) setNames([...names, ""]);
  }

  function removeName() {
    if (names.length > 2) setNames(names.slice(0, -1));
  }

  function updateName(i, val) {
    const copy = [...names];
    copy[i] = val;
    setNames(copy);
  }

  function startVoting() {
    const filled = names.map((n, i) => n.trim() || `Person ${i + 1}`);
    setNames(filled);
    setCurrentPlayer(0);
    setVotes([]);
    setScreen("handoff");
  }

  function handleReady() {
    setScreen("vote");
  }

  function handleVote(optionKey) {
    const newVotes = [...votes, { name: names[currentPlayer], vote: optionKey }];
    setVotes(newVotes);

    if (currentPlayer < names.length - 1) {
      setCurrentPlayer(currentPlayer + 1);
      setScreen("handoff");
    } else {
      setScreen("results");
    }
  }

  function handlePlayAgain() {
    setScreen("setup");
    setCurrentPlayer(0);
    setVotes([]);
  }

  return (
    <div className="app">
      {screen === "setup" && (
        <div className="setup-screen">
          <h1 className="title">Game-dibber</h1>
          <p className="subtitle">Takeout vote for the fam</p>

          <div className="names-section">
            <div className="names-header">
              <span>Who's eating? ({names.length})</span>
              <div className="names-btns">
                <button className="small-btn" onClick={removeName}>-</button>
                <button className="small-btn" onClick={addName}>+</button>
              </div>
            </div>
            {names.map((name, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Person ${i + 1}`}
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                className="name-input"
              />
            ))}
          </div>

          <button className="start-btn" onClick={startVoting}>
            Start Voting
          </button>
        </div>
      )}

      {screen === "handoff" && (
        <div className="handoff-screen">
          <div className="handoff-emoji">
            {currentPlayer === 0 ? "\uD83D\uDCF1" : "\uD83D\uDC49\uD83D\uDCF1"}
          </div>
          <h2 className="handoff-name">{names[currentPlayer]}</h2>
          <p className="handoff-text">
            {currentPlayer === 0
              ? "You're up first!"
              : "Pass the phone!"}
          </p>
          <p className="handoff-count">
            {currentPlayer + 1} of {names.length}
          </p>
          <button className="start-btn" onClick={handleReady}>
            I'm ready
          </button>
        </div>
      )}

      {screen === "vote" && (
        <VoteScreen
          playerName={names[currentPlayer]}
          onVote={handleVote}
        />
      )}

      {screen === "results" && (
        <VoteResults votes={votes} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
