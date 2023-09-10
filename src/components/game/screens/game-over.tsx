import { type QRL, component$ } from "@builder.io/qwik";
import Frame from "../frame";
import AnimatedCircle from "../animated-circle/animated-circle";
import type {
  GameMode,
  GameStateStore,
  HighScores,
} from "~/components/useGameState";
import Summary from "../summary";
import Button from "~/components/button";

type GameOverScreenProps = {
  /** The game state store. */
  store: GameStateStore<GameMode>;
  /** The current high scores for each game mode. */
  highScores: HighScores;
  /** The callback to restart and start a new game. */
  startNewGame$: QRL<() => void>;
};

export default component$<GameOverScreenProps>(
  ({ store, highScores, startNewGame$ }) => {
    // Calculate the percentage of correct guesses.
    const correctPercent = store.index
      ? Math.round((store.score / store.index) * 100)
      : 0;

    const gameoverText = store.lives === 0 ? "Game over!" : "Nice job!";
    const highScoreText =
      highScores[store.mode] > 0
        ? `Your high score is ${highScores[store.mode]}. `
        : "";
    const followupText =
      correctPercent < 10
        ? "Keep practicing to improve! Remember to use your hints if you need them."
        : correctPercent < 50
        ? "Keep practicing to improve!"
        : correctPercent < 80
        ? "You're starting to get them now!"
        : correctPercent < 95
        ? "You have a great color memory!"
        : "You're a true color master!";
    const modeSuggestionText =
      correctPercent < 50 && store.set.length > 20
        ? "Try adjusting the number of colors down while you're building your memory."
        : correctPercent > 75 && store.set.length <= 20
        ? "Try adding more colors to further challenge yourself."
        : "";
    return (
      <Frame>
        <AnimatedCircle />
        <h1 class=" dark:text-slate-200 text-3xl font-extralight mb-6">
          {gameoverText} You got{" "}
          <strong>
            {store.score} / {store.set.length}
          </strong>{" "}
          ({correctPercent}%) correct.
        </h1>
        <p class="text-gray-600 dark:text-slate-500 mb-8 leading-6">
          {highScoreText}
          {followupText} {modeSuggestionText}
        </p>
        <Summary mode={store.mode} guesses={store.guesses} colors={store.set} />
        <Button onClick$={startNewGame$}>Start new game</Button>
      </Frame>
    );
  }
);
