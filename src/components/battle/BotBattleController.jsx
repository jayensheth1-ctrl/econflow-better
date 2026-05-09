import { useState, useEffect, useRef } from "react";
import { BATTLE_QUESTIONS, shuffleQuestions } from "../../lib/battleQuestions";
import { generateBot, getBotParams, getBotDelay, getLossStreak, setLossStreak, PENDING_FORFEIT_KEY } from "../../lib/botBattle";
import { saveBattleLog } from "../../lib/battleLogs";
import { updateProgress } from "../../lib/progressUtils";
import { playChaChig } from "../../lib/sounds";
import BotPreGame from "./BotPreGame";
import BotQuestion from "./BotQuestion";
import BotEndScreen from "./BotEndScreen";

const WIN_SCORE = 10;
const WIN_GEMS = 15;
const LOSS_GEMS = 10;

function getQuestions() {
  const seed = Date.now() % 1000000;
  const order = shuffleQuestions(seed);
  return order.slice(0, 20).map(i => BATTLE_QUESTIONS[i]);
}

export default function BotBattleController({
  myName, avatarConfig, progress, setProgress, onExit,
}) {
  const [phase, setPhase] = useState("pregame");
  const [myScore, setMyScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [won, setWon] = useState(false);
  const [forfeitMessage, setForfeitMessage] = useState(null);

  // Bot and questions stored in refs so they can be swapped on Play Again
  // without triggering re-renders or stale closure issues
  const botRef = useRef(generateBot());
  const questionsRef = useRef(getQuestions());

  // Mirrors of score state for use inside callbacks (avoid stale closures)
  const myScoreRef = useRef(0);
  const botScoreRef = useRef(0);
  const phaseRef = useRef("pregame");
  const gemsAwardedRef = useRef(false);
  const botIntervalRef = useRef(null);
  const paramsRef = useRef(null);

  // Expose current bot as a state so BotPreGame / BotEndScreen re-render when it changes
  const [botSnapshot, setBotSnapshot] = useState(() => ({ ...botRef.current }));

  function clearBotTimer() {
    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    }
  }

  function startBotInterval() {
    if (!paramsRef.current) return;
    // Pick a fixed tick interval close to the midpoint of the speed range
    const [min, max] = paramsRef.current.speedRange;
    const interval = (min + max) / 2;

    botIntervalRef.current = setInterval(() => {
      if (phaseRef.current !== "playing") {
        clearBotTimer();
        return;
      }
      const correct = Math.random() < paramsRef.current.accuracy;
      if (correct) {
        const newBotScore = botScoreRef.current + 1;
        botScoreRef.current = newBotScore;
        setBotScore(newBotScore);
        if (newBotScore >= WIN_SCORE) {
          finishGame(false);
        }
      }
    }, interval);
  }

  function startPlaying() {
    paramsRef.current = getBotParams(botRef.current);
    phaseRef.current = "playing";
    setPhase("playing");
    localStorage.setItem(PENDING_FORFEIT_KEY, "1");
    startBotInterval();
  }

  function handleUserAnswer(correct) {
    if (phaseRef.current !== "playing") return;
    if (correct) {
      const newMyScore = myScoreRef.current + 1;
      myScoreRef.current = newMyScore;
      setMyScore(newMyScore);
      playChaChig();
      if (newMyScore >= WIN_SCORE) {
        finishGame(true);
        return;
      }
    }
    setQuestionIdx(prev => prev + 1);
  }

  function finishGame(userWon, forfeit = false) {
    clearBotTimer();
    phaseRef.current = "finished";
    localStorage.removeItem(PENDING_FORFEIT_KEY);

    const result = userWon ? "win" : forfeit ? "forfeit" : "loss";
    saveBattleLog({
      botName: botRef.current.name,
      botEmoji: botRef.current.emoji,
      botStrength: botRef.current.strength,
      result,
      myScore: myScoreRef.current,
      botScore: botScoreRef.current,
      gemChange: userWon ? WIN_GEMS : -LOSS_GEMS,
    });

    if (userWon) {
      setLossStreak(0);
      awardWinGems();
    } else {
      setLossStreak(getLossStreak() + 1);
      deductLossGems(forfeit);
    }

    setWon(userWon);
    setPhase("finished");
  }

  async function awardWinGems() {
    if (gemsAwardedRef.current) return;
    gemsAwardedRef.current = true;
    const update = { gems: (progress.gems || 0) + WIN_GEMS };
    await updateProgress(progress, update);
    setProgress({ ...progress, ...update });
  }

  async function deductLossGems(forfeit = false) {
    const update = { gems: (progress.gems || 0) - LOSS_GEMS };
    await updateProgress(progress, update);
    setProgress({ ...progress, ...update });
    if (forfeit) setForfeitMessage(`You forfeited the battle. -${LOSS_GEMS} gems.`);
  }

  function handleForfeit() {
    finishGame(false, true);
  }

  useEffect(() => {
    return () => { clearBotTimer(); };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (phaseRef.current === "playing") {
        localStorage.setItem(PENDING_FORFEIT_KEY, "1");
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  function handlePlayAgain() {
    clearBotTimer();

    // Generate a brand new bot, guaranteed different name & strength
    const newBot = generateBot(botRef.current.name, botRef.current.strength);
    botRef.current = newBot;
    setBotSnapshot({ ...newBot });

    // Fresh questions
    questionsRef.current = getQuestions();

    // Reset all state
    myScoreRef.current = 0;
    botScoreRef.current = 0;
    gemsAwardedRef.current = false;
    paramsRef.current = null;
    setMyScore(0);
    setBotScore(0);
    setQuestionIdx(0);
    setWon(false);
    setForfeitMessage(null);
    phaseRef.current = "pregame";
    setPhase("pregame");
  }

  const currentQuestion = questionsRef.current[questionIdx % questionsRef.current.length];

  if (phase === "pregame") {
    return <BotPreGame bot={botSnapshot} onReady={startPlaying} />;
  }

  if (phase === "finished") {
    return (
      <BotEndScreen
        won={won}
        myScore={myScore}
        botScore={botScore}
        myName={myName || "You"}
        bot={botSnapshot}
        winGems={WIN_GEMS}
        lossGems={LOSS_GEMS}
        forfeitMessage={forfeitMessage}
        onPlayAgain={handlePlayAgain}
        onBack={onExit}
      />
    );
  }

  return (
    <BotQuestion
      question={currentQuestion}
      questionNum={questionIdx + 1}
      myScore={myScore}
      botScore={botScore}
      myName={myName || "You"}
      botName={botSnapshot.name}
      onAnswer={handleUserAnswer}
      onForfeit={handleForfeit}
    />
  );
}