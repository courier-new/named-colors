import { component$ } from "@builder.io/qwik";
import type { GameMode, GameStateStore } from "../useGameState";
import { GoHeartFill24, GoLightBulb16 } from "@qwikest/icons/octicons";

export default component$<{ store: GameStateStore<GameMode> }>(({ store }) => {
  const correctPercent = store.index
    ? Math.round((store.score / store.index) * 100)
    : 0;

  return (
    <div class="grid grid-cols-2 xs:grid-cols-3 sm:flex-1 self-stretch items-center mb-2">
      <span
        class="text-gray-400 dark:text-slate-600 text-left"
        aria-label={`${store.score} correct out of ${store.index} (${correctPercent}%)`}
      >
        {store.score} / {store.index} ({correctPercent}%)
      </span>
      <span
        class="text-gray-600 dark:text-slate-400 hidden xs:block"
        aria-label={`${store.set.length - store.index} to go!`}
      >
        {store.set.length - store.index} to go!
      </span>
      <div
        class="flex items-center justify-end mt-0.5"
        aria-label={`${store.lives} li${
          store.lives === 1 ? "fe" : "ves"
        } remaining, ${store.hints} hint${
          store.hints === 1 ? "" : "s"
        } remaining`}
      >
        {Array.from({ length: store.lives }).map((_, id) => (
          <GoHeartFill24
            key={id}
            class="text-red-500 dark:text-red-600 text-xl -mt-0.5 flex-shrink-0"
          />
        ))}
        <span class="border-l border-gray-300 dark:border-slate-600 h-6 ml-3 mr-2 -mt-0.5" />
        <GoLightBulb16
          class={`${
            store.hints === 0
              ? "text-gray-300 dark:text-slate-600"
              : "text-blue-700 dark:text-blue-500"
          } flex-shrink-0 text-xl -mt-0.5`}
        />
        <span
          class={`${
            store.hints === 0
              ? "text-gray-300 dark:text-slate-600"
              : "text-blue-700 dark:text-blue-500"
          } text-xl font-bold`}
          title={`${store.hints} hint${store.hints === 1 ? "" : "s"} remaining`}
        >
          {store.hints}
        </span>
      </div>
    </div>
  );
});
