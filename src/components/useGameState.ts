import { $, type QRL, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import { shuffle } from "lodash";
import data, { type Color } from "~/data.json";
import {
  compareColorsCloseEnough,
  type ColorHSL,
  generateHSLHint,
} from "~/util/colors";
import { compareCloseEnough, generateHint } from "~/util/strings";

export type GameState = "menu" | "new-game" | "playing" | "game-over";
export type GameMode = "nametags" | "sliders";
export type Guess<Mode extends GameMode> = Mode extends "nametags"
  ? string
  : ColorHSL;
export type GuessResult = "correct" | "close-enough" | "partial" | "incorrect";
type GuessEvaluator<Mode extends GameMode> = (
  color: Color,
  guess: Guess<Mode>
) => GuessResult;
export type GuessAndResult<Mode extends GameMode> = {
  guess: Guess<Mode>;
  result: GuessResult;
};
export type HighScores = {
  [mode in GameMode]: number;
};

export type GameStateStore<Mode extends GameMode> = {
  mode: Mode;
  state: GameState;
  set: Color[];
  index: number;
  score: number;
  lives: number;
  hints: number;
  guesses: GuessAndResult<Mode>[];
};

const GAME_STATE_STORAGE_KEY = "game-state";
const HIGH_SCORES_STORAGE_KEY = "high-scores";

const DEFAULT_STATE: GameStateStore<"nametags"> = {
  state: "menu",
  mode: "nametags",
  set: [],
  index: 0,
  guesses: [],
  score: 0,
  lives: 3,
  hints: 3,
};

const DEFAULT_HIGH_SCORES: HighScores = {
  nametags: 0,
  sliders: 0,
};

const getGameState = (): GameStateStore<GameMode> => {
  if (isBrowser) {
    const gameStateJSON = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (gameStateJSON) {
      try {
        const gameState = JSON.parse(gameStateJSON);
        if (
          gameState.state in ["menu", "new-game", "playing", "game-over"] &&
          gameState.mode in ["name", "color"]
        ) {
          return gameState;
        }
      } catch {
        return DEFAULT_STATE;
      }
    }
  }
  return DEFAULT_STATE;
};

const setGameState = (gameState: GameStateStore<GameMode>) => {
  localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState));
};

const getHighScores = (): HighScores => {
  if (isBrowser) {
    const highScoresJSON = localStorage.getItem(HIGH_SCORES_STORAGE_KEY);
    if (highScoresJSON) {
      try {
        const highScores = JSON.parse(highScoresJSON);
        if (
          "nametags" in highScores &&
          "sliders" in highScores &&
          typeof highScores.nametags === "number" &&
          typeof highScores.sliders === "number"
        ) {
          return highScores;
        }
      } catch {
        return DEFAULT_HIGH_SCORES;
      }
    }
  }
  return DEFAULT_HIGH_SCORES;
};

const setHighScores = (highScores: HighScores) => {
  localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(highScores));
};

export const pointsForGuessResult = (result: GuessResult): number => {
  switch (result) {
    case "correct":
      return 1;
    case "close-enough":
      return 1;
    case "partial":
      return 0.5;
    case "incorrect":
    default:
      return 0;
  }
};

export const useGameState = (
  godMode: boolean
): {
  store: GameStateStore<GameMode>;
  highScores: HighScores;
  startNewGame$: QRL<() => void>;
  selectMode$: QRL<(mode: GameMode, count: number | "all") => void>;
  generateNameHint$: QRL<(color: Color) => string>;
  generateHSLHint$: QRL<(color: Color) => ColorHSL>;
  guessName$: QRL<(color: Color, guess: Guess<"nametags">) => void>;
  guessHSL$: QRL<(color: Color, guess: Guess<"sliders">) => void>;
  instaWinGame$: QRL<(score?: number) => void>;
} => {
  const store = useStore<GameStateStore<GameMode>>(getGameState);
  const highScores = useStore<HighScores>(getHighScores);

  useVisibleTask$(() => {
    const localState = getGameState();
    if (
      (localState.state === "playing" || localState.state === "game-over") &&
      store.state !== "playing"
    ) {
      store.state = localState.state;
      store.mode = localState.mode;
      store.set = localState.set;
      store.index = localState.index;
      store.guesses = localState.guesses;
      store.score = localState.score;
      store.lives = localState.lives;
      store.hints = localState.hints;
    }
    const localHighScores = getHighScores();
    highScores.nametags = localHighScores.nametags;
    highScores.sliders = localHighScores.sliders;
  });

  const startNewGame$ = $(() => {
    store.state = "new-game";
    store.set = [];
    store.index = 0;
    store.guesses = [];
    store.score = 0;
    store.lives = 3;
    store.hints = godMode ? 999 : 3;
    setGameState(store);
  });

  const selectMode$ = $((mode: GameMode, count: number | "all") => {
    store.state = "playing";
    store.mode = mode;
    const shuffled =
      count === "all"
        ? shuffle(data.colors)
        : // Go easy on the user; don't include any of the colors that are basically
          // just shades of white
          shuffle(data.colors.filter((color) => !color.tags.includes("light")));
    if (count === "all") {
      store.set = shuffled;
    } else {
      store.set = shuffled.slice(0, count);
    }
    setGameState(store);
  });

  const finishGame$ = $(() => {
    store.state = "game-over";
    setGameState(store);

    if (store.mode === "nametags" && store.score > highScores.nametags) {
      highScores.nametags = store.score;
      setHighScores(highScores);
    } else if (store.mode === "sliders" && store.score > highScores.sliders) {
      highScores.sliders = store.score;
      setHighScores(highScores);
    }
  });

  const instaWinGame$ = $((score?: number) => {
    if (!godMode) {
      return;
    }
    store.index = store.set.length;
    store.score = score || store.set.length;
    store.guesses = store.set.map((color) => ({
      guess:
        store.mode === "nametags"
          ? color.keyword
          : {
              h: color.hsl[0],
              s: color.hsl[1],
              l: color.hsl[2],
            },
      result: "correct",
    }));
    if (store.score <= store.set.length - 3) {
      store.lives = 0;
    }
    finishGame$();
  });

  const generateNameHint$ = $((color: Color): string => {
    const hint = generateHint(color.keyword);
    store.hints -= 1;
    setGameState(store);
    return hint;
  });

  const generateHSLHint$ = $((color: Color): ColorHSL => {
    const hint = generateHSLHint(color);
    store.hints -= 1;
    setGameState(store);
    return hint;
  });

  const guess$ = $(
    <Mode extends GameMode>(
      color: Color,
      guess: Guess<Mode>,
      evaluator: GuessEvaluator<Mode>
    ) => {
      store.index += 1;

      const result = evaluator(color, guess);
      store.guesses.push({ guess, result });

      if (result !== "incorrect") {
        store.score += pointsForGuessResult(result);
        if (store.index === store.set.length) {
          finishGame$();
        } else {
          setGameState(store);
          return;
        }
      }

      store.lives -= 1;
      setGameState(store);
      if (store.lives === 0) {
        finishGame$();
      }
    }
  );

  const guessName$ = $((color: Color, guess: Guess<"nametags">) => {
    if (store.mode !== "nametags") {
      return;
    }

    // Hack because generic type param is not forwarded by $() function
    // https://github.com/BuilderIO/qwik/issues/3332
    const guessFn = <Mode extends GameMode>(
      color: Color,
      guess: Guess<Mode>,
      evaluator: GuessEvaluator<Mode>
    ) => guess$(color, guess, evaluator) as Promise<void>;

    guessFn<"nametags">(color, guess, (color, guess) =>
      guess === color.keyword
        ? "correct"
        : compareCloseEnough(guess, color.keyword)
        ? "close-enough"
        : "incorrect"
    );
  });

  const guessHSL$ = $((color: Color, guess: Guess<"sliders">) => {
    if (store.mode !== "sliders") {
      return;
    }

    // Hack because generic type param is not forwarded by $() function
    // https://github.com/BuilderIO/qwik/issues/3332
    const guessFn = <Mode extends GameMode>(
      color: Color,
      guess: Guess<Mode>,
      evaluator: GuessEvaluator<Mode>
    ) => guess$(color, guess, evaluator) as Promise<void>;

    guessFn<"sliders">(color, guess, (color, guess) =>
      guess.h === color.hsl[0] &&
      guess.s === color.hsl[1] &&
      guess.l === color.hsl[2]
        ? "correct"
        : compareColorsCloseEnough(
            guess,
            {
              h: color.hsl[0],
              s: color.hsl[1],
              l: color.hsl[2],
            },
            "all"
          )
        ? "close-enough"
        : compareColorsCloseEnough(
            guess,
            {
              h: color.hsl[0],
              s: color.hsl[1],
              l: color.hsl[2],
            },
            "any"
          )
        ? "partial"
        : "incorrect"
    );
  });

  return {
    store,
    highScores,
    startNewGame$,
    selectMode$,
    generateNameHint$,
    generateHSLHint$,
    guessName$,
    guessHSL$,
    instaWinGame$,
  };
};
