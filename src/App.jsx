import { useState, useEffect } from "react";
import { questions } from "./data/questions";
import { pickCuisine, groupTally } from "./logic/scorer";
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  submitResult,
  startGame,
  roomExists,
} from "./lib/room";
import LobbyScreen from "./components/LobbyScreen";
import WaitingRoom from "./components/WaitingRoom";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import QuizQuestion from "./components/QuizQuestion";
import MyResultWaiting from "./components/MyResultWaiting";
import GroupResults from "./components/GroupResults";
import "./App.css";

const SCREENS = {
  LOBBY: "lobby",
  WAITING: "waiting",
  QUIZ: "quiz",
  MY_RESULT: "myResult",
  GROUP_RESULTS: "groupResults",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOBBY);
  const [roomCode, setRoomCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [myResult, setMyResult] = useState(null);

  // Check URL for room code on mount
  useEffect(() => {
    const path = window.location.pathname.slice(1).toUpperCase();
    if (path && /^[A-Z0-9]{4}$/.test(path)) {
      setRoomCode(path);
    }

    // Restore session
    const savedRoom = sessionStorage.getItem("gd_roomCode");
    const savedPlayer = sessionStorage.getItem("gd_playerId");
    const savedHost = sessionStorage.getItem("gd_isHost");
    if (savedRoom && savedPlayer) {
      setRoomCode(savedRoom);
      setPlayerId(savedPlayer);
      setIsHost(savedHost === "true");
    }
  }, []);

  // Subscribe to room data when we have a room code and player ID
  useEffect(() => {
    if (!roomCode || !playerId) return;

    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      setRoomData(data);
    });

    return unsubscribe;
  }, [roomCode, playerId]);

  // Auto-transition based on room data changes
  useEffect(() => {
    if (!roomData || !playerId) return;

    const players = roomData.players ? Object.values(roomData.players) : [];
    const myPlayer = roomData.players?.[playerId];
    const allFinished =
      players.length > 0 && players.every((p) => p.cuisine !== null);

    // If game started and we're still in waiting room, go to quiz
    if (roomData.started && screen === SCREENS.WAITING && !myPlayer?.cuisine) {
      setScreen(SCREENS.QUIZ);
      return;
    }

    // If all players finished, show group results
    if (allFinished && players.length >= 2) {
      setScreen(SCREENS.GROUP_RESULTS);
      return;
    }

    // If I finished but others haven't, show my result waiting
    if (myPlayer?.cuisine && screen === SCREENS.QUIZ) {
      setMyResult(myPlayer.cuisine);
      setScreen(SCREENS.MY_RESULT);
    }
  }, [roomData, playerId, screen]);

  // Restore screen state from session on room data load
  useEffect(() => {
    if (!roomData || !playerId) return;
    if (screen !== SCREENS.LOBBY) return;

    const myPlayer = roomData.players?.[playerId];
    if (!myPlayer) return;

    const players = Object.values(roomData.players);
    const allFinished = players.every((p) => p.cuisine !== null);

    if (allFinished && players.length >= 2) {
      setMyResult(myPlayer.cuisine);
      setScreen(SCREENS.GROUP_RESULTS);
    } else if (myPlayer.cuisine) {
      setMyResult(myPlayer.cuisine);
      setScreen(SCREENS.MY_RESULT);
    } else if (roomData.started) {
      setScreen(SCREENS.QUIZ);
    } else {
      setScreen(SCREENS.WAITING);
    }
  }, [roomData, playerId]);

  async function handleCreateRoom(name, playerCount) {
    const code = await createRoom(playerCount);
    const pid = await joinRoom(code, name);
    setRoomCode(code);
    setPlayerId(pid);
    setIsHost(true);
    sessionStorage.setItem("gd_roomCode", code);
    sessionStorage.setItem("gd_playerId", pid);
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
    setIsHost(false);
    sessionStorage.setItem("gd_roomCode", code);
    sessionStorage.setItem("gd_playerId", pid);
    sessionStorage.setItem("gd_isHost", "false");
    window.history.replaceState(null, "", "/" + code);
    setScreen(SCREENS.WAITING);
  }

  async function handleStartQuiz() {
    await startGame(roomCode);
  }

  async function handleAnswer(tags) {
    const newAnswers = [...playerAnswers, tags];

    if (currentQuestion < questions.length - 1) {
      setPlayerAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const cuisine = pickCuisine(newAnswers);
      setMyResult(cuisine);
      await submitResult(roomCode, playerId, cuisine);
    }
  }

  function handlePlayAgain() {
    sessionStorage.removeItem("gd_roomCode");
    sessionStorage.removeItem("gd_playerId");
    sessionStorage.removeItem("gd_isHost");
    setScreen(SCREENS.LOBBY);
    setRoomCode(null);
    setPlayerId(null);
    setIsHost(false);
    setRoomData(null);
    setCurrentQuestion(0);
    setPlayerAnswers([]);
    setMyResult(null);
    window.history.replaceState(null, "", "/");
  }

  // Compute group data from room players
  const groupData =
    roomData?.players && screen === SCREENS.GROUP_RESULTS
      ? groupTally(roomData.players)
      : null;

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
          onStartQuiz={handleStartQuiz}
        />
      )}

      {screen === SCREENS.QUIZ && (
        <div className="quiz-screen">
          <PlayerBanner
            playerNumber={
              roomData?.players
                ? Object.keys(roomData.players).indexOf(playerId) + 1
                : 1
            }
            totalPlayers={
              roomData?.players ? Object.keys(roomData.players).length : 1
            }
          />
          <ProgressBar current={currentQuestion} total={questions.length} />
          <QuizQuestion
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {screen === SCREENS.MY_RESULT && (
        <MyResultWaiting myResult={myResult} roomData={roomData} />
      )}

      {screen === SCREENS.GROUP_RESULTS && groupData && (
        <GroupResults groupData={groupData} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
