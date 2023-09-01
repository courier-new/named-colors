import { $, type QRL, useVisibleTask$, useContext } from "@builder.io/qwik";
import { GlobalStore } from "~/context";

/** Local storage key for persisting user's favorite colors. */
const FAVORITES_STORAGE_KEY = "favorites";

/**
 * useFavorites consolidates logic for managing a user's set of favorite colors. It
 * returns a tuple containing:
 * - An array of the user's current favorite colors.
 * - A function to add a color by name to the user's favorites.
 * - A function to remove a color by name from the user's favorites.
 *
 * The user's favorites are persisted to local storage and can be accessed with this hook
 * or via the `GlobalStore` context across the application.
 *
 * @returns A tuple containing the user's favorite colors, a function to add a favorite,
 * and a function to remove a favorite.
 */
export function useFavorites(): [
  favorites: string[],
  addFavorite$: QRL<(name: string) => void>,
  removeFavorite$: QRL<(name: string) => void>,
] {
  const globalStore = useContext(GlobalStore);

  useVisibleTask$(
    () => {
      if (globalStore.favorites.length) return;
      try {
        const favoritesJSON = window.localStorage.getItem(
          FAVORITES_STORAGE_KEY
        );
        globalStore.favorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      } catch (error) {
        console.warn("Could not load favorites from local storage", error);
        globalStore.favorites = [];
      }
    },
    // Set the user's favorites in app state on page load.
    { strategy: "document-ready" }
  );

  const addFavorite$ = $((name: string) => {
    const set = new Set([...globalStore.favorites, name]);
    globalStore.favorites = Array.from(set);
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(Array.from(set))
      );
    } catch (error) {
      console.warn("Could not save favorite to local storage", error);
    }
  });

  const removeFavorite$ = $((name: string) => {
    const newFavorites = globalStore.favorites.filter((n) => n !== name);
    globalStore.favorites = newFavorites;
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.warn("Could not remove favorite from local storage", error);
    }
  });

  return [globalStore.favorites, addFavorite$, removeFavorite$];
}
