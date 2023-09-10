import { type QRL, type Signal, component$ } from "@builder.io/qwik";
import Frame from "../frame";
import { HiFireSolid } from "@qwikest/icons/heroicons";
import { InColorFilter, InInputField } from "@qwikest/icons/iconoir";
import Button from "~/components/button";
import type { GameMode, HighScores } from "~/components/useGameState";

type NewGameScreenProps = {
  /** Signal tracking the number of colors currently selected to start a new game with. */
  numColorsSelected: Signal<number | "all">;
  /** The callback to select a game mode, with a number of colors. */
  selectMode$: QRL<(mode: GameMode, numColors: number | "all") => void>;
  /** The current high scores for each game mode. */
  highScores: HighScores;
};

export default component$<NewGameScreenProps>(
  ({ numColorsSelected, selectMode$, highScores }) => {
    return (
      <Frame>
        <h1 class="text-gray-500 dark:text-slate-400 font-extralight text-2xl mb-5">
          Customize your game mode
        </h1>

        {/* First, the user selects from radio boxes how many colors to play with. */}
        <h2 class="text-gray-800 dark:text-slate-300 font-bold text-lg mb-3">
          1. Number of colors
        </h2>
        <p class="text-gray-600 dark:text-slate-500 mb-4 leading-6">
          Choose how many colors you want to play with. The more colors you
          choose, the harder the game will be.
        </p>
        <div class="flex flex-row gap-3 items-center mb-7 text-gray-800 dark:text-slate-300 text-xl">
          <input
            class="h-6 w-6"
            type="radio"
            name="color-count"
            id="color-count-10"
            value="10"
            checked={numColorsSelected.value === 10}
            onChange$={() => (numColorsSelected.value = 10)}
          />
          <label for="color-count-10">10</label>
          <input
            class="h-6 w-6 ml-3"
            type="radio"
            name="color-count"
            id="color-count-20"
            value="20"
            checked={numColorsSelected.value === 20}
            onChange$={() => (numColorsSelected.value = 20)}
          />
          <label for="color-count-20">20</label>
          <input
            class="h-6 w-6 ml-3"
            type="radio"
            name="color-count"
            id="color-count-50"
            value="50"
            checked={numColorsSelected.value === 50}
            onChange$={() => (numColorsSelected.value = 50)}
          />
          <label for="color-count-50">50</label>
          <input
            class="h-6 w-6 ml-3"
            type="radio"
            name="color-count"
            id="color-count-all"
            value="all"
            checked={numColorsSelected.value === "all"}
            onChange$={() => (numColorsSelected.value = "all")}
          />
          <label
            for="color-count-all"
            class="flex items-center gap-1 flex-shrink-0"
          >
            All
            <HiFireSolid class="text-red-600" />
          </label>
        </div>

        {/* Then, the user picks a game mode and clicks a button to begin the game. */}
        <h2 class="text-gray-800 dark:text-slate-300 font-bold text-lg mb-3">
          2. Game mode
        </h2>
        <div class="flex flex-col xs:flex-row items-stretch gap-3 sm:gap-5">
          <div class="flex flex-col items-center flex-1 py-7 px-5 flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md text-gray-600 dark:text-slate-500">
            <InInputField class="text-gray-300 dark:text-slate-700 text-5xl mb-3" />
            <h3 class="font-bold text-base mb-2">Nametags</h3>
            <p class="mb-5 leading-6">
              In Nametags mode, you will be shown a color and asked to recall
              its keyword name. Resist the urge to cheat with the element
              inspector!
            </p>
            <Button
              onClick$={() => selectMode$("nametags", numColorsSelected.value)}
            >
              Play Nametags
            </Button>
            {highScores.nametags > 0 && (
              <em class="text-sm pt-3 text-gray-800 dark:text-slate-300">
                High Score: {highScores.nametags}
              </em>
            )}
          </div>
          <div class="flex flex-col items-center flex-1 py-7 px-5 flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md text-gray-600 dark:text-slate-500">
            <InColorFilter class="text-gray-300 dark:text-slate-700 text-5xl mb-3" />
            <h3 class="font-bold text-base mb-2">Sliders</h3>
            <p class="mb-5 leading-6">
              In this mode, slide the controls to adjust the HSL values and
              recreate the color based on just the keyword name. See how close
              you can get!
            </p>
            <Button
              onClick$={() => selectMode$("sliders", numColorsSelected.value)}
            >
              Play Sliders
            </Button>
            {highScores.sliders > 0 && (
              <em class="text-sm pt-3 text-gray-800 dark:text-slate-300">
                High Score: {highScores.sliders}
              </em>
            )}
          </div>
        </div>
      </Frame>
    );
  }
);
