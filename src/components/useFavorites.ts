import { $, type QRL, useVisibleTask$, useContext } from "@builder.io/qwik";
import { GlobalStore } from "~/context";

const KEY = "favorites";

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
        const favoritesJSON = window.localStorage.getItem(KEY);
        globalStore.favorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
      } catch (error) {
        console.warn("Could not load favorites from local storage", error);
        globalStore.favorites = [];
      }
    },
    { strategy: "document-ready" }
  );

  const addFavorite$ = $((name: string) => {
    const set = new Set([...globalStore.favorites, name]);
    globalStore.favorites = Array.from(set);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
    } catch (error) {
      console.warn("Could not save favorite to local storage", error);
    }
  });

  const removeFavorite$ = $((name: string) => {
    const newFavorites = globalStore.favorites.filter((n) => n !== name);
    globalStore.favorites = newFavorites;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.warn("Could not remove favorite from local storage", error);
    }
  });

  return [globalStore.favorites, addFavorite$, removeFavorite$];
}
