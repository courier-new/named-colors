import { component$, useContext, useSignal } from "@builder.io/qwik";
import Button from "~/components/button";
import Frame from "~/components/game/frame";
import { useGameState } from "~/components/useGameState";
import { GlobalStore } from "~/context";
import MenuScreen from "~/components/game/screens/menu";
import NewGameScreen from "~/components/game/screens/new-game";
import NametagsScreen from "~/components/game/screens/nametags";
import SlidersScreen from "~/components/game/screens/sliders";
import GameOverScreen from "~/components/game/screens/game-over";

export default component$(() => {
  const globalStore = useContext(GlobalStore);

  const {
    store,
    highScores,
    startNewGame$,
    selectMode$,
    generateNameHint$,
    generateHSLHint$,
    guessName$,
    guessHSL$,
    instaWinGame$,
  } = useGameState(globalStore.godMode);

  // Selected number of colors to start a new game with.
  const numColorsSelected = useSignal<number | "all">(10);
  // The current color to guess.
  const currentColor = store.set[store.index];

  if (store.state === "menu") {
    return <MenuScreen startNewGame$={startNewGame$} />;
  }

  if (store.state === "new-game") {
    return (
      <NewGameScreen
        numColorsSelected={numColorsSelected}
        selectMode$={selectMode$}
        highScores={highScores}
      />
    );
  }

  if (store.state === "playing") {
    if (!currentColor) {
      return (
        <Frame>
          <div class="flex-1 flex flex-col items-center justify-center">
            <h1 class="dark:text-slate-200 text-3xl font-extralight mb-6">
              Oops! Something went wrong.
            </h1>
            <Button onClick$={startNewGame$}>Restart</Button>
          </div>
        </Frame>
      );
    }

    return store.mode === "nametags" ? (
      <NametagsScreen
        store={store}
        currentColor={currentColor}
        guessName$={guessName$}
        generateNameHint$={generateNameHint$}
        startNewGame$={startNewGame$}
        instaWinGame$={instaWinGame$}
      />
    ) : (
      <SlidersScreen
        store={store}
        currentColor={currentColor}
        guessHSL$={guessHSL$}
        generateHSLHint$={generateHSLHint$}
        startNewGame$={startNewGame$}
        instaWinGame$={instaWinGame$}
      />
    );
  }

  return (
    <GameOverScreen
      store={store}
      highScores={highScores}
      startNewGame$={startNewGame$}
    />
  );
});
