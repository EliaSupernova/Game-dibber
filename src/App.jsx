import { useState, useEffect } from "react";
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  submitVote,
  startGame,
  roomExists,
} from "./lib/room";
import LobbyScreen from "./components/LobbyScreen";
import WaitingRoom from "./components/WaitingRoom";
import VoteScreen from "./components/VoteScreen";
import VoteResults from "./components/VoteResults";
import "./App.css";

const SCREENS = {
  LOBBY: "lobby",
  WAITING: "waiting",
  VOTE: "vote",
  RESULTS: "results",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOBBY);
  const [roomCode, setRoomCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [roomData, setRoomData] = useState(null);

  // Check URL for room code on mount
  useEffect(() => {
    const path = window.location.pathname.slice(1).toUpperCase();
    if (path && /^[A-Z0-9]{4}$/.test(path)) {
      setRoomCode(path);
    }
    const savedRoom = sessionStorage.getItem("gd_roomCode");
    const savedPlayer = sessionStorage.getItem("gd_playerId");
    const savedName = sessionStorage.getItem("gd_playerName");
    const savedHost = sessionStorage.getItem("gd_isHost");
    if (savedRoom && savedPlayer) {
      setRoomCode(savedRoom);
      setPlayerId(savedPlayer);
      setPlayerName(savedName || "");
      setIsHost(savedHost === "true");
    }
  }, []);

  // Subscribe to room
  useEffect(() => {
    if (!roomCode || !playerId) return;
    return subscribeToRoom(roomCode, setRoomData);
  }, [roomCode, playerId]);

  // Auto-transition
  useEffect(() => {
    if (!roomData || !playerId) return;

    const players = roomData.players ? Object.values(roomData.players) : [];
    const myPlayer = roomData.players?.[playerId];
    const allVoted = players.length > 0 && players.every((p) => p.vote);

    if (allVoted && players.length >= 2) {
      setScreen(SCREENS.RESULTS);
      return;
    }

    if (roomData.started && screen === SCREENS.WAITING && !myPlayer?.vote) {
      setScreen(SCREENS.VOTE);
      return;
    }

    if (myPlayer?.vote && screen === SCREENS.VOTE) {
      setScreen(SCREENS.RESULTS);
    }
  }, [roomData, playerId, screen]);

  // Restore state on reload
  useEffect(() => {
    if (!roomData || !playerId || screen !== SCREENS.LOBBY) return;
    const myPlayer = roomData.players?.[playerId];
    if (!myPlayer) return;

    const players = Object.values(roomData.players);
    const allVoted = players.every((p) => p.vote);

    if (allVoted || myPlayer.vote) {
      setScreen(SCREENS.RESULTS);
    } else if (roomData.started) {
      setScreen(SCREENS.VOTE);
    } else {
      setScreen(SCREENS.WAITING);
    }
  }, [roomData, playerId]);

  async function handleCreateRoom(name, playerCount) {
    const code = await createRoom(playerCount);
    const pid = await joinRoom(code, name);
    setRoomCode(code);
    setPlayerId(pid);
    setPlayerName(name);
    setIsHost(true);
    sessionStorage.setItem("gd_roomCode", code);
    sessionStorage.setItem("gd_playerId", pid);
    sessionStorage.setItem("gd_playerName", name);
    sessionStorage.setItem("gd_isHost", "true");
    window.history.replaceState(null, "", "/" + code);
    setScreen(SCREENS.WAITING);
  }

  async function handleJoinRoom(name, code) {
    const exists = await roomExists(code);
    if (!exists) throw new Error("Room not found");
    const pid = await joinRoom(code, name);
    setRoomCode(code);
    setPlayerId(pid);
    setPlayerName(name);
    setIsHost(false);
    sessionStorage.setItem("gd_roomCode", code);
    sessionStorage.setItem("gd_playerId", pid);
    sessionStorage.setItem("gd_playerName", name);
    sessionStorage.setItem("gd_isHost", "false");
    window.history.replaceState(null, "", "/" + code);
    setScreen(SCREENS.WAITING);
  }

  async function handleVote(optionKey) {
    await submitVote(roomCode, playerId, optionKey);
  }

  function handlePlayAgain() {
    sessionStorage.clear();
    setScreen(SCREENS.LOBBY);
    setRoomCode(null);
    setPlayerId(null);
    setPlayerName("");
    setIsHost(false);
    setRoomData(null);
    window.history.replaceState(null, "", "/");
  }

  return (
    <div className="app">
      {screen === SCREENS.LOBBY && (
        <LobbyScreen
          initialRoomCode={roomCode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
      {screen === SCREENS.WAITING && (
        <WaitingRoom
          roomCode={roomCode}
          roomData={roomData}
          playerId={playerId}
          isHost={isHost}
          onStartQuiz={() => startGame(roomCode)}
        />
      )}
      {screen === SCREENS.VOTE && (
        <VoteScreen playerName={playerName} onVote={handleVote} />
      )}
      {screen === SCREENS.RESULTS && roomData && (
        <VoteResults roomData={roomData} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
