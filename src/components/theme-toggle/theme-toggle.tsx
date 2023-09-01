import { component$, event$, useContext, useStyles$ } from "@builder.io/qwik";
import { SunAndMoon } from "./sun-and-moon";
import { THEME_STORAGE_KEY } from "../router-head";
import themeToggle from "./theme-toggle.css?inline";
import { GlobalStore } from "../../context";

export type ThemePreference = "dark" | "light";

export const colorSchemeChangeListener = (
  onColorSchemeChange: (isDark: boolean) => void
) => {
  const listener = ({ matches: isDark }: MediaQueryListEvent) => {
    onColorSchemeChange(isDark);
  };
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => listener(event));

  return () =>
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", listener);
};

export const setPreference = (theme: ThemePreference) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  reflectPreference(theme);
};

export const reflectPreference = (theme: ThemePreference) => {
  document.firstElementChild?.setAttribute("data-theme", theme);
  document.firstElementChild?.classList.remove(
    theme === "dark" ? "light" : "dark"
  );
  document.firstElementChild?.classList.add(
    theme === "dark" ? "dark" : "light"
  );
};

export const getColorPreference = (): ThemePreference => {
  if (localStorage.getItem(THEME_STORAGE_KEY)) {
    return localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference;
  } else {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
};

export const ThemeToggle = component$(() => {
  useStyles$(themeToggle);
  const state = useContext(GlobalStore);

  const onClick$ = event$(() => {
    state.theme = state.theme === "light" ? "dark" : "light";
    setPreference(state.theme);
  });

  return (
    <button
      type="button"
      class="theme-toggle"
      id="theme-toggle"
      title={`Switch to ${state.theme === "light" ? "dark" : "light"} theme`}
      aria-label={state.theme}
      aria-live="polite"
      onClick$={onClick$}
    >
      <SunAndMoon />
    </button>
  );
});
