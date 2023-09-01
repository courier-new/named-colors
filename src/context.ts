import { createContextId } from "@builder.io/qwik";
import type { ThemePreference } from "./components/theme-toggle/theme-toggle";
import type { Format } from "./components/format-toggle";
import type { GridSize } from "./components/grid-size-toggle";

/**
 * Defines the shape of the global application store object.
 */
export type Store = {
  /** Setting to control the color theme to display the site with. */
  theme: ThemePreference | "auto";
  /** Setting to control the format to display color strings in. */
  format: Format;
  /** Lit of keywords for colors the user has favorited. */
  favorites: string[];
  /** Setting to control the grid size on supported views. */
  gridSize: GridSize;
  /** [DEBUG ONLY] Setting to add cheats to the game mode. */
  godMode: boolean;
};

export const GlobalStore = createContextId<Store>("global-store");
