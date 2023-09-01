import { component$, event$, useContext } from "@builder.io/qwik";
import { GlobalStore } from "../context";
import { TbLayoutList, TbLayoutGrid } from "@qwikest/icons/tablericons";

export type GridSize = "small" | "large";
export const GRID_SIZE_STORAGE_KEY = "grid-size-preference";

export const getGridSizePreference = (): GridSize => {
  if (localStorage.getItem(GRID_SIZE_STORAGE_KEY)) {
    return localStorage.getItem(GRID_SIZE_STORAGE_KEY) as GridSize;
  } else {
    return "small";
  }
};

export const GridSizeToggle = component$(() => {
  const globalStore = useContext(GlobalStore);

  const onClick$ = event$(() => {
    const newSize = globalStore.gridSize === "small" ? "large" : "small";
    globalStore.gridSize = newSize;
    localStorage.setItem(GRID_SIZE_STORAGE_KEY, newSize);
  });

  return (
    <button
      type="button"
      class="grid-size-toggle text-xl"
      id="grid-size-toggle"
      title={`Switch grid size`}
      aria-label={globalStore.gridSize}
      aria-live="polite"
      onClick$={onClick$}
    >
      {globalStore.gridSize === "small" ? <TbLayoutGrid /> : <TbLayoutList />}
    </button>
  );
});
