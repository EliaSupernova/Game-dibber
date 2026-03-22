import { useState } from "react";
import { questions } from "./data/questions";
import { pickCuisine, groupTally } from "./logic/scorer";
import IntroScreen from "./components/IntroScreen";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import QuizQuestion from "./components/QuizQuestion";
import PlayerResult from "./components/PlayerResult";
import GroupResults from "./components/GroupResults";
import "./App.css";

const SCREENS = {
  INTRO: "intro",
  QUIZ: "quiz",
  PLAYER_RESULT: "playerResult",
  GROUP_RESULTS: "groupResults",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [playerCount, setPlayerCount] = useState(6);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [groupData, setGroupData] = useState(null);

  function handleStart(count) {
    setPlayerCount(count);
    setCurrentPlayer(1);
    setCurrentQuestion(0);
    setPlayerAnswers([]);
    setAllResults([]);
    setScreen(SCREENS.QUIZ);
  }

  function handleAnswer(tags) {
    const newAnswers = [...playerAnswers, tags];

    if (currentQuestion < questions.length - 1) {
      setPlayerAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const cuisine = pickCuisine(newAnswers);
      setCurrentResult(cuisine);
      setScreen(SCREENS.PLAYER_RESULT);
    }
  }

  function handleNextPlayer() {
    const newAllResults = [...allResults, currentResult];

    if (currentPlayer < playerCount) {
      setAllResults(newAllResults);
      setCurrentPlayer(currentPlayer + 1);
      setCurrentQuestion(0);
      setPlayerAnswers([]);
      setCurrentResult(null);
      setScreen(SCREENS.QUIZ);
    } else {
      const data = groupTally(newAllResults);
      setGroupData(data);
      setScreen(SCREENS.GROUP_RESULTS);
    }
  }

  function handlePlayAgain() {
    setScreen(SCREENS.INTRO);
    setCurrentPlayer(1);
    setCurrentQuestion(0);
    setPlayerAnswers([]);
    setAllResults([]);
    setCurrentResult(null);
    setGroupData(null);
  }

  return (
    <div className="app">
      {screen === SCREENS.INTRO && <IntroScreen onStart={handleStart} />}

      {screen === SCREENS.QUIZ && (
        <div className="quiz-screen">
          <PlayerBanner
            playerNumber={currentPlayer}
            totalPlayers={playerCount}
          />
          <ProgressBar current={currentQuestion} total={questions.length} />
          <QuizQuestion
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {screen === SCREENS.PLAYER_RESULT && (
        <PlayerResult
          playerNumber={currentPlayer}
          cuisineKey={currentResult}
          onNext={handleNextPlayer}
          isLast={currentPlayer === playerCount}
        />
      )}

      {screen === SCREENS.GROUP_RESULTS && (
        <GroupResults groupData={groupData} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
