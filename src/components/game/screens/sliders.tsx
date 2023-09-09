import {
  $,
  type QRL,
  component$,
  useStore,
  useContext,
} from "@builder.io/qwik";
import { type ColorHSL, formatHSL } from "~/util/colors";
import Frame from "../frame";
import ScoreHeader from "../score-header";
import type { GameMode, GameStateStore } from "~/components/useGameState";
import type { Color } from "~/data.json";
import { GlobalStore } from "~/context";
import RangeSlider from "../range-slider/range-slider";
import Button from "~/components/button";
import { mapValues } from "lodash";
import Feedback from "../feedback";

type SlidersScreenProps = {
  /** The game state store. */
  store: GameStateStore<GameMode>;
  /** The current color to guess. */
  currentColor: Color;
  /** The callback to guess the HSL values of a color. */
  guessHSL$: QRL<(color: Color, guess: ColorHSL) => void>;
  /** The callback to generate an HSL hint for a color. */
  generateHSLHint$: QRL<(color: Color) => ColorHSL>;
  /** The callback to restart and start a new game. */
  startNewGame$: QRL<() => void>;
  /** [DEBUG ONLY] The callback to insta-win the game. */
  instaWinGame$: QRL<(score?: number) => void>;
};

const getRandomHSL = (): ColorHSL => ({
  h: Math.random() * 360,
  s: Math.random() * 100,
  l: Math.random() * 100,
});

export default component$<SlidersScreenProps>(
  ({
    store,
    currentColor,
    guessHSL$,
    generateHSLHint$,
    startNewGame$,
    instaWinGame$,
  }) => {
    const globalStore = useContext(GlobalStore);

    // Store to track each slider's input value for the user's guess.
    const guessHSLStore = useStore<ColorHSL>(getRandomHSL);

    // Lazy-loadable change handler for the slider inputs.
    const onChange$ = $(({ h, s, l }: ColorHSL) => {
      guessHSLStore.h = h;
      guessHSLStore.s = s;
      guessHSLStore.l = l;
    });

    return (
      <Frame classes="w-full sm:w-96 md:w-96 lg:w-[30rem] xl:w-[30rem]">
        <ScoreHeader store={store} />
        <div
          class={`flex-1 sm:flex-auto flex items-center justify-center text-2xl font-mono self-stretch mb-3 ${
            guessHSLStore.l < 50 ? "text-white" : ""
          }`}
          style={{
            backgroundColor: formatHSL(guessHSLStore),
            minHeight: "min(10rem, 25vh)",
            maxHeight: "30rem",
            height: "25vh",
          }}
        >
          {currentColor.keyword}
        </div>
        <div class="self-stretch mt-4">
          <RangeSlider hsl={guessHSLStore} onChange$={onChange$} />
        </div>
        <div class="flex self-stretch items-center gap-3">
          <Button
            class="flex-1"
            onClick$={() => {
              guessHSL$(currentColor, mapValues(guessHSLStore, Math.round));
              onChange$(getRandomHSL());
            }}
          >
            Guess!
          </Button>
          <Button
            variant="secondary"
            disabled={store.hints === 0}
            onClick$={async () => {
              const hint = await generateHSLHint$(currentColor);
              // Set the HSL channel value to the hint's value if it's not -1.
              if (hint.h !== -1) {
                guessHSLStore.h = hint.h;
              } else if (hint.s !== -1) {
                guessHSLStore.s = hint.s;
              } else if (hint.l !== -1) {
                guessHSLStore.l = hint.l;
              }
            }}
          >
            Use a hint
          </Button>
          <Button
            variant="secondary"
            onClick$={() => {
              if (confirm("Are you sure you want to restart?")) {
                startNewGame$();
              }
            }}
          >
            Restart
          </Button>
          {globalStore.godMode && (
            <Button variant="secondary" onClick$={() => instaWinGame$()}>
              🔥
            </Button>
          )}
        </div>
        <div
          class="w-full mt-3 sm:mt-6 self-stretch"
          style={{ minHeight: "5.75rem" }}
        >
          {/* Display the outcome and feedback for the previous guess. */}
          {!!store.guesses[store.index - 1] && !!store.set[store.index - 1] && (
            <Feedback
              mode="sliders"
              guessAndResult={store.guesses[store.index - 1]!}
              correctColor={store.set[store.index - 1]!}
            />
          )}
        </div>
      </Frame>
    );
  }
);
