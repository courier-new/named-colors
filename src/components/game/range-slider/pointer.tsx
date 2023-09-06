import { type Signal, component$, useStyles$ } from "@builder.io/qwik";
import pointer from "./pointer.css?inline";

type PointerProps = {
  ref: Signal<HTMLButtonElement | undefined>;
  output: {
    for: string;
    value: string;
  };
  left: number;
  color: string;
  classes?: string;
};

export default component$<PointerProps>(
  ({ ref, output, color, left, classes = "" }) => {
    useStyles$(pointer);

    return (
      <button
        ref={ref}
        class={`pointer ${classes}`}
        style={{ left: `${left * 100}%` }}
      >
        <div class="pointer-fill" style={{ backgroundColor: color }} />
        <output class="output rounded-md text-sm px-2 py-1" for={output.for}>
          {output.value}
        </output>
      </button>
    );
  }
);
