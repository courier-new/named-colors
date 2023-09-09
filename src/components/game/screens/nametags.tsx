import { type QRL, component$, useContext, useSignal } from "@builder.io/qwik";
import Frame from "../frame";
import ScoreHeader from "../score-header";
import type { GameMode, GameStateStore } from "~/components/useGameState";
import type { Color } from "~/data.json";
import { GlobalStore } from "~/context";
import { formatHSL } from "~/util/colors";
import Button from "~/components/button";
import Feedback from "../feedback";

type NametagsScreenProps = {
  /** The game state store. */
  store: GameStateStore<GameMode>;
  /** The current color to guess. */
  currentColor: Color;
  /** The callback to guess the name of a color. */
  guessName$: QRL<(color: Color, guess: string) => void>;
  /** The callback to generate a name hint for a color. */
  generateNameHint$: QRL<(color: Color) => string>;
  /** The callback to restart and start a new game. */
  startNewGame$: QRL<() => void>;
  /** [DEBUG ONLY] The callback to insta-win the game. */
  instaWinGame$: QRL<(score?: number) => void>;
};

export default component$<NametagsScreenProps>(
  ({
    store,
    currentColor,
    guessName$,
    generateNameHint$,
    startNewGame$,
    instaWinGame$,
  }) => {
    const globalStore = useContext(GlobalStore);

    // Signal to track the input for the user's guess.
    const guessInput = useSignal("");
    // Signal to track the input element.
    const guessInputRef = useSignal<HTMLInputElement | undefined>();

    return (
      <Frame classes="w-full sm:w-96 md:w-96 lg:w-[30rem] xl:w-[30rem]">
        <ScoreHeader store={store} />
        <div
          class={`flex-1 sm:flex-auto flex items-center justify-center text-2xl font-mono self-stretch mb-3 ${
            currentColor.hsl[2] < 50 ? "text-white" : ""
          }`}
          style={{
            backgroundColor: currentColor.hex,
            minHeight: "min(10rem, 25vh)",
            maxHeight: "30rem",
            height: "25vh",
          }}
        >
          {globalStore.godMode && (
            <>
              {currentColor.keyword}
              <br />
            </>
          )}
          {formatHSL(currentColor.hsl)}
        </div>
        <input
          ref={guessInputRef}
          id="guess"
          type="text"
          class="self-stretch mb-3 px-5 py-2.5 text-lg sm:text-base font-mono rounded-md bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 placeholder:text-gray-400 dark:placeholder:text-slate-600  dark:text-slate-200"
          autoFocus={true}
          spellcheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          maxLength={26}
          aria-label="Guess the color name"
          value={guessInput.value}
          onInput$={(event: any) => {
            guessInput.value = event.target.value.replace(/ /g, "");
          }}
          onKeyUp$={(event: any) => {
            if (event.key === "Enter" && guessInput.value.length >= 3) {
              guessName$(currentColor, guessInput.value);
              guessInput.value = "";
            }
          }}
        />
        <div class="flex self-stretch items-center gap-3">
          <Button
            class="flex-1"
            disabled={guessInput.value.length < 3}
            onClick$={() => {
              guessName$(currentColor, guessInput.value);
              guessInput.value = "";
              guessInputRef.value?.focus();
            }}
          >
            Guess!
          </Button>
          <Button
            variant="secondary"
            disabled={store.hints === 0}
            onClick$={async () => {
              const hint = await generateNameHint$(currentColor);
              guessInput.value = hint;
            }}
          >
            Use a hint
          </Button>
          <Button
            variant="secondary"
            onClick$={() => {
              if (confirm("Are you sure you want to restart?")) {
                guessInput.value = "";
                startNewGame$();
              }
            }}
          >
            Restart
          </Button>
          {globalStore.godMode && (
            <Button
              variant="secondary"
              onClick$={() => {
                const score = parseInt(guessInput.value, 10) || undefined;
                guessInput.value = "";
                instaWinGame$(score);
              }}
            >
              🔥
            </Button>
          )}
        </div>
        <div class="mt-3 sm:mt-6 self-stretch" style={{ minHeight: "7rem" }}>
          {/* Display the outcome and feedback for the previous guess. */}
          {!!store.guesses[store.index - 1] && !!store.set[store.index - 1] && (
            <Feedback
              mode="nametags"
              guessAndResult={store.guesses[store.index - 1]!}
              correctColor={store.set[store.index - 1]!}
            />
          )}
        </div>
      </Frame>
    );
  }
);
