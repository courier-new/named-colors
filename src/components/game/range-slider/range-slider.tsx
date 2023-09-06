import Interactive, { type Interaction } from "./interactive";
import Pointer from "./pointer";

import {
  $,
  type QRL,
  component$,
  useStyles$,
  useSignal,
} from "@builder.io/qwik";
import { clamp } from "lodash";
import rangeSlider from "./range-slider.css?inline";
import { formatHSL, type ColorHSL } from "~/util/colors";

interface RangeSliderProps {
  hsl: ColorHSL;
  onChange$: QRL<(hsl: ColorHSL) => void>;
}

export default component$<RangeSliderProps>(({ hsl, onChange$ }) => {
  useStyles$(rangeSlider);
  const huePointerRef = useSignal<HTMLButtonElement>();
  const satPointerRef = useSignal<HTMLButtonElement>();
  const lightPointerRef = useSignal<HTMLButtonElement>();

  const handleHueMove$ = $((interaction: Interaction) => {
    onChange$({ ...hsl, h: 360 * interaction.left });
  });

  const handleHueKey$ = $((offset: Interaction) => {
    // Hue measured in degrees of the color circle ranging from 0 to 360
    onChange$({
      ...hsl,
      h: clamp(hsl.h + offset.left * 360, 0, 360),
    });
  });

  const handleSatMove$ = $((interaction: Interaction) => {
    onChange$({ ...hsl, s: 100 * interaction.left });
  });

  const handleSatKey$ = $((offset: Interaction) => {
    // Saturation measured as a percentage from 0% to 100%
    onChange$({
      ...hsl,
      s: clamp(hsl.s + offset.left * 100, 0, 100),
    });
  });

  const handleLightMove$ = $((interaction: Interaction) => {
    onChange$({ ...hsl, l: 100 * interaction.left });
  });

  const handleLightKey$ = $((offset: Interaction) => {
    // Lightness measured as a percentage from 0% to 100%
    onChange$({
      ...hsl,
      l: clamp(hsl.l + offset.left * 100, 0, 100),
    });
  });

  return (
    <>
      <div class="hue relative h-3 mb-8">
        <Interactive
          refToFocus={huePointerRef}
          onMove$={handleHueMove$}
          onKey$={handleHueKey$}
          aria-label="Hue"
          aria-valuenow={Math.round(hsl.h)}
          aria-valuemax="360"
          aria-valuemin="0"
        >
          <Pointer
            ref={huePointerRef}
            classes="z-10"
            left={hsl.h / 360}
            color={`hsl(${hsl.h}, 100%, 50%)`}
            output={{ for: "hue", value: Math.round(hsl.h).toString() }}
          />
        </Interactive>
      </div>
      <div
        class="sat relative h-3 mb-8"
        style={{
          background: `linear-gradient(to right, hsl(${hsl.h}, 0%, 50%), hsl(${hsl.h}, 100%, 50%))`,
        }}
      >
        <Interactive
          refToFocus={satPointerRef}
          onMove$={handleSatMove$}
          onKey$={handleSatKey$}
          aria-label="Saturation"
          aria-valuenow={Math.round(hsl.s)}
          aria-valuemax="100"
          aria-valuemin="0"
        >
          <Pointer
            ref={satPointerRef}
            classes="z-20"
            left={hsl.s / 100}
            color={`hsl(${hsl.h}, ${hsl.s}%, 50%)`}
            output={{ for: "sat", value: `${Math.round(hsl.s)}%` }}
          />
        </Interactive>
      </div>
      <div
        class="light relative h-3 mb-8"
        style={{
          background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
        }}
      >
        <Interactive
          refToFocus={lightPointerRef}
          onMove$={handleLightMove$}
          onKey$={handleLightKey$}
          aria-label="Lightness"
          aria-valuenow={Math.round(hsl.l)}
          aria-valuemax="100"
          aria-valuemin="0"
        >
          <Pointer
            ref={lightPointerRef}
            classes="z-30"
            left={hsl.l / 100}
            color={formatHSL(hsl)}
            output={{ for: "light", value: `${Math.round(hsl.l)}%` }}
          />
        </Interactive>
      </div>
    </>
  );
});
