import Button from "~/components/button";
import AnimatedCircle from "../animated-circle/animated-circle";
import Frame from "../frame";
import { component$, type QRL } from "@builder.io/qwik";

type MenuScreenProps = {
  /** The callback to start a new game. */
  startNewGame$: QRL<() => void>;
};

export default component$<MenuScreenProps>(({ startNewGame$ }) => {
  return (
    <Frame>
      <AnimatedCircle />
      <h1 class="dark:text-slate-200 text-3xl font-extralight mb-6">
        How well do{" "}
        <em>
          <strong>you</strong>
        </em>{" "}
        know your named colors?
      </h1>
      <p class="text-gray-600 dark:text-slate-500 mb-10 leading-6">
        Challenge your recall of colors in the palette of named CSS colors.
        Choose from different modes to train your memory.
      </p>
      <Button onClick$={startNewGame$}>Start new game</Button>
    </Frame>
  );
});
