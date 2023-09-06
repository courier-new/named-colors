import {
  $,
  type QwikKeyboardEvent,
  type QwikMouseEvent,
  type QwikTouchEvent,
  component$,
  useSignal,
  useVisibleTask$,
  Slot,
  type QRL,
  useStyles$,
  type Signal,
} from "@builder.io/qwik";
import { clamp } from "lodash";
import interactive from "./interactive.css?inline";

export type Interaction = {
  left: number;
  top: number;
};

// Finds a proper touch point by its identifier
const getTouchPoint = (touches: TouchList, touchId?: number): Touch => {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i]?.identifier === touchId) {
      return touches[i]!;
    }
  }
  return touches[0]!;
};

// Returns a relative position of the pointer inside the node's bounding box
const getRelativePosition = (
  node: HTMLDivElement,
  event: QwikTouchEvent | QwikMouseEvent | MouseEvent | TouchEvent,
  touchId?: number
): Interaction => {
  const rect = node.getBoundingClientRect();

  // Get user's pointer position from `touches` array if it's a `TouchEvent`
  const pointer =
    "touches" in event
      ? getTouchPoint(event.touches, touchId)
      : (event as any as QwikMouseEvent);

  return {
    left: clamp(
      (pointer.pageX - (rect.left + window.scrollX)) / rect.width,
      0,
      1
    ),
    top: clamp(
      (pointer.pageY - (rect.top + window.scrollY)) / rect.height,
      0,
      1
    ),
  };
};

// Prevent mobile browsers from handling mouse events (conflicting with touch ones).
// If we detected a touch interaction before, we prefer reacting to touch events only.
const isInvalid = (
  event: QwikTouchEvent | QwikMouseEvent,
  hasTouch: boolean
): boolean => {
  return hasTouch && !("touches" in event);
};

type InteractiveProps = {
  refToFocus: Signal<HTMLButtonElement | undefined>;
  onMove$: QRL<(interaction: Interaction) => void>;
  onKey$: QRL<(offset: Interaction) => void>;
};

export default component$<InteractiveProps>(
  ({ refToFocus, onMove$, onKey$, ...rest }) => {
    useStyles$(interactive);
    const containerRef = useSignal<HTMLDivElement>();

    const isShiftDown = useSignal(false);
    const isMoving = useSignal(false);
    const touchId = useSignal<number>();
    const hasTouch = useSignal(false);

    const handleMoveStart$ = $(
      (event: QwikTouchEvent | QwikMouseEvent, element: HTMLDivElement) => {
        if (isInvalid(event, hasTouch.value)) return;
        isMoving.value = true;
        refToFocus.value?.focus();

        if ("touches" in event) {
          hasTouch.value = true;
          const changedTouches = event.changedTouches || [];
          if (changedTouches.length)
            touchId.value = changedTouches[0]?.identifier;
        }

        onMove$(getRelativePosition(element, event, touchId.value));
      }
    );

    const handleKeyDown$ = $((event: QwikKeyboardEvent) => {
      const { key } = event;

      if (!["ArrowLeft", "ArrowRight", "Shift"].includes(key)) {
        return;
      }

      if (key === "Shift") {
        isShiftDown.value = true;
        return;
      }

      const offset = isShiftDown.value ? 0.1 : 0.01;

      // Send relative offset to the parent component.
      onKey$({
        left: key === "ArrowRight" ? offset : key === "ArrowLeft" ? -offset : 0,
        top: key === "ArrowDown" ? offset : key === "ArrowUp" ? -offset : 0,
      });
    });

    const handleKeyUp$ = $((event: QwikKeyboardEvent) => {
      if (event.key === "Shift") {
        isShiftDown.value = false;
      }
    });

    useVisibleTask$(({ cleanup, track }) => {
      track(() => isMoving.value);

      const handleMove = (event: MouseEvent | TouchEvent) => {
        // If user moves their pointer outside of the window, `mousemove`/`touchmove`
        // events stop firing. However, if the user returns the pointer back to the
        // document, the browser will fire a `mousemove`/`touchmove` event even if the
        // user's pointer is not pressed. This is a problem because we need to stop the
        // picker from following the cursor when the user is not pressing the mouse button
        // or touching the screen. We check `event.buttons` and `event.touches` to ensure
        // that the user has not released the pointer.
        const isDown =
          "touches" in event ? event.touches.length > 0 : event.buttons > 0;

        if (isDown && containerRef.value) {
          onMove$(
            getRelativePosition(containerRef.value, event, touchId.value)
          );
        }
      };

      const handleMoveEnd = () => {
        isMoving.value = false;
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("mousemove", handleMove);
      };

      if (isMoving.value) {
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchend", handleMoveEnd);
        window.addEventListener("mouseup", handleMoveEnd);
      } else {
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("touchend", handleMoveEnd);
        window.removeEventListener("mouseup", handleMoveEnd);
      }

      cleanup(() => {
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("touchend", handleMoveEnd);
        window.removeEventListener("mouseup", handleMoveEnd);
      });
    });

    return (
      <div
        {...rest}
        preventdefault:touchstart={true}
        preventdefault:mousedown={true}
        onTouchStart$={handleMoveStart$}
        onMouseDown$={handleMoveStart$}
        class="interactive"
        onKeyDown$={handleKeyDown$}
        onKeyUp$={handleKeyUp$}
        role="slider"
        ref={containerRef}
      >
        <Slot />
      </div>
    );
  }
);
