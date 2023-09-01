import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import {
  ThemeToggle,
  colorSchemeChangeListener,
  getColorPreference,
  setPreference,
} from "./theme-toggle/theme-toggle";
import { GlobalStore } from "~/context";
import { FormatToggle, getFormatPreference } from "./format-toggle";
import { Link, useLocation } from "@builder.io/qwik-city";
import Logo from "./logo/logo";
import { GridSizeToggle, getGridSizePreference } from "./grid-size-toggle";
import { GoBeaker16 } from "@qwikest/icons/octicons";

export default component$(() => {
  const globalStore = useContext(GlobalStore);
  const { url } = useLocation();

  useVisibleTask$(
    () => {
      globalStore.theme = getColorPreference();
      globalStore.format = getFormatPreference();
      globalStore.gridSize = getGridSizePreference();
      // Listen for changes to the user's color scheme preference and automatically update
      // the app's theme.
      return colorSchemeChangeListener((isDark) => {
        globalStore.theme = isDark ? "dark" : "light";
        setPreference(globalStore.theme);
      });
    },
    // Set user preferences from local storage on page load.
    { strategy: "document-ready" }
  );

  return (
    <header class="w-full z-50 py-5 bg-gray-50 dark:bg-slate-800 dark:text-slate-200 sticky top-0">
      <div class="flex flex-wrap px-10 gap-x-3 lg:gap-x-5 gap-y-2 sm:gap-y-0 items-center justify-between mx-auto max-w-3xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div class="flex flex-1 pr-3" style={{ flexBasis: "max-content" }}>
          <Link
            href="/"
            title="home"
            class="flex-shrink-0 flex items-center gap-2 lg:gap-3"
          >
            <div class="flex-shrink-0 w-6 h-6 lg:w-9 lg:h-9">
              <Logo />
            </div>
            <h2 class="flex-shrink-0 font-bold text-3xl lg:text-4xl">
              {globalStore.godMode ? "boss" : "named"}-colors
            </h2>
            {globalStore.godMode && <GoBeaker16 class="text-xl mt-1" />}
          </Link>
        </div>
        <div class="flex items-center gap-3 lg:gap-4 flex-shrink-0">
          {url.pathname === "/" || url.pathname.includes("/favorites") ? (
            <FormatToggle />
          ) : null}
          {url.pathname.includes("/favorites/") ? <GridSizeToggle /> : null}
          <ThemeToggle />
        </div>
        <span class="hidden sm:block border-r border-gray-300 dark:border-slate-600 h-4" />
        <ul class="flex items-center gap-3 lg:gap-4 flex-shrink-0 list-none text-sm basis-[100%] sm:basis-auto">
          <li>
            <Link href="/">Browse</Link>
          </li>
          <li>
            <Link href="/favorites">Favorites</Link>
          </li>
          <li>
            <Link href="/play">Play</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
    </header>
  );
});
