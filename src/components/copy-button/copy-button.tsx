import {
  $,
  type PropFunction,
  Slot,
  component$,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import copyButton from "./copy-button.css?inline";

type CopyButtonProps = {
  /** The value to copy to the clipboard when the button is pressed. */
  valueToCopy: string;
  /** The title to display when hovering over the button. */
  title: string;
  /** Additional classes to apply to the button element. */
  classes?: string;
  /** Optionally, a callback to invoke when the button is pressed. */
  onCopy$?: PropFunction<() => void>;
};

export default component$<CopyButtonProps>(
  ({ valueToCopy, title, classes = "", onCopy$ }) => {
    useStyles$(copyButton);
    const copied = useSignal(false);

    const copy = $(() => {
      // Write the value to copy to the clipboard.
      navigator.clipboard.writeText(valueToCopy);
      // Invoke the optional `onCopy` callback.
      onCopy$?.();
      // Set the `copied` signal to `true` for 2 seconds.
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    });

    return (
      <button
        disabled={copied.value}
        title={title}
        onClick$={copy}
        class={`relative ${classes}`}
      >
        <Slot />
        {/* Display a tooltip for feedback for a brief duration after the button
            is pressed. */}
        <span
          data-copied={copied.value.toString()}
          class="copied-tooltip rounded-sm"
        >
          Copied!
        </span>
      </button>
    );
  }
);
