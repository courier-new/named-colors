import { component$ } from "@builder.io/qwik";
import {
  pointsForGuessResult,
  type GameMode,
  type GuessAndResult,
} from "../useGameState";
import type { Color } from "~/data.json";
import { type ColorHSL, formatHSL } from "~/util/colors";
import { GoCheckCircle24, GoXCircle24 } from "@qwikest/icons/octicons";

type SummaryProps<Mode extends GameMode> = {
  mode: Mode;
  guesses: GuessAndResult<GameMode>[];
  colors: Color[];
};

const Summary = <Mode extends GameMode>({
  mode,
  guesses,
  colors,
}: SummaryProps<Mode>) => {
  return (
    <div class="grid grid-cols-[min-content_1fr_1fr_min-content] gap-y-3 text-left mb-8">
      <span class="border-b border-gray-300 dark:border-slate-600 pb-3" />
      <span class="font-bold dark:text-slate-200 border-b border-gray-300 dark:border-slate-600 pb-3 pl-3">
        Guess
      </span>
      <span class="font-bold dark:text-slate-200 border-b border-gray-300 dark:border-slate-600 pb-3 pl-3">
        Actual
      </span>
      <span class="font-bold dark:text-slate-200 border-b border-gray-300 dark:border-slate-600 pb-3 text-right">
        Points
      </span>
      {guesses.map(({ guess, result }, index) => {
        const actualColor = colors[index]!;
        const points = pointsForGuessResult(result);
        let guessValue: string;
        let actualValue: string;

        if (mode === "nametags") {
          guessValue = guess as string;
          actualValue = actualColor.keyword;
        } else {
          guessValue = formatHSL(guess as ColorHSL);
          actualValue = formatHSL(actualColor.hsl);
        }

        return (
          <>
            {result === "incorrect" ? (
              <GoXCircle24 class="text-red-500" />
            ) : (
              <GoCheckCircle24
                class={`${
                  result === "partial" ? "text-yellow-500" : "text-green-500"
                }`}
              />
            )}
            <span
              class={`${
                result === "incorrect"
                  ? "text-red-500"
                  : result === "partial"
                  ? "text-yellow-500"
                  : "text-gray-600 dark:text-slate-500"
              } font-mono px-3`}
            >
              {guessValue}
            </span>
            <span class="font-mono pl-3 text-gray-600 dark:text-slate-500">
              {actualValue}
            </span>
            <span class="text-right text-gray-600 dark:text-slate-500">
              {points}
            </span>
          </>
        );
      })}
    </div>
  );
};

export default component$(Summary);
