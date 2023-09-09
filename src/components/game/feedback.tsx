import { component$ } from "@builder.io/qwik";
import type { GameMode, GuessAndResult } from "../useGameState";
import type { Color } from "~/data.json";
import { GoCheckCircle24, GoXCircle24 } from "@qwikest/icons/octicons";
import { formatHSL } from "~/util/colors";

type FeedbackProps<Mode extends GameMode> = {
  mode: Mode;
  guessAndResult?: GuessAndResult<Mode>;
  correctColor: Color;
};

const Feedback = <Mode extends GameMode>({
  mode,
  guessAndResult,
  correctColor,
}: FeedbackProps<Mode>) => {
  if (!guessAndResult) {
    return null;
  }
  const { result, guess } = guessAndResult;

  const guessValue = typeof guess === "string" ? guess : formatHSL(guess);
  const correctValue =
    mode === "nametags" ? correctColor.keyword : formatHSL(correctColor.hsl);
  return (
    <div
      class={`w-full flex gap-2 sm:gap-3 items-center border-2 p-2 sm:p-3 rounded-md ${
        result === "incorrect"
          ? "border-red-400 dark:border-red-700"
          : result === "partial"
          ? "border-yellow-400 dark:border-yellow-700"
          : "border-green-400 dark:border-green-700"
      }`}
    >
      {result === "incorrect" ? (
        <GoXCircle24 class="text-red-500 text-4xl" />
      ) : (
        <GoCheckCircle24
          class={`${
            result === "partial" ? "text-yellow-500" : "text-green-500"
          } text-4xl`}
        />
      )}
      <h3 class="flex-1 text-left text-gray-600 dark:text-slate-500 leading-6">
        {result === "correct" && (
          <strong class="text-green-500">Correct!</strong>
        )}
        {result === "close-enough" && (
          <>
            <strong class="text-green-500">Close enough!</strong> We gave it to
            you for this one!
          </>
        )}
        {result === "partial" && (
          <>
            <strong class="text-yellow-500">Partial credit!</strong> Your guess
            was close, but part of it was still off.
          </>
        )}
        {result === "incorrect" && (
          <strong class="text-red-500">Incorrect!</strong>
        )}{" "}
        {result === "correct" && (
          <span>
            The color was <span class="font-mono">{correctValue}</span>.
          </span>
        )}
        {result !== "correct" && (
          <span>
            You guessed{" "}
            <span class="font-mono text-black dark:text-slate-100">
              {guessValue}
            </span>
            ; the correct answer was{" "}
            <span class="font-mono text-black dark:text-slate-100">
              {correctValue}
            </span>
            .
          </span>
        )}
      </h3>
    </div>
  );
};

export default component$(Feedback);
