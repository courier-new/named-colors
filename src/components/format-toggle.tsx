import { component$, event$, useContext } from "@builder.io/qwik";
import { GlobalStore } from "../context";

export type Format = "hex" | "keyword" | "rgb" | "hsl";
export const FORMAT_STORAGE_KEY = "format-preference";

export const getFormatPreference = (): Format => {
  if (localStorage.getItem(FORMAT_STORAGE_KEY)) {
    return localStorage.getItem(FORMAT_STORAGE_KEY) as Format;
  } else {
    return "hex";
  }
};

export const FormatToggle = component$(() => {
  const globalStore = useContext(GlobalStore);

  const onClick$ = event$(() => {
    let newFormat: Format = "hex";
    switch (globalStore.format) {
      case "hex":
        newFormat = "keyword";
        break;
      case "keyword":
        newFormat = "rgb";
        break;
      case "rgb":
        newFormat = "hsl";
        break;
      case "hsl":
        newFormat = "hex";
        break;
    }
    globalStore.format = newFormat;
    localStorage.setItem(FORMAT_STORAGE_KEY, newFormat);
  });

  return (
    <button
      type="button"
      class="format-toggle font-mono"
      id="format-toggle"
      title={`Switch format`}
      aria-label={globalStore.theme}
      aria-live="polite"
      onClick$={onClick$}
    >
      {globalStore.format === "hex" && "HEX"}
      {globalStore.format === "keyword" && "name"}
      {globalStore.format === "rgb" && "RGB"}
      {globalStore.format === "hsl" && "HSL"}
    </button>
  );
});
