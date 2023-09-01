import { $, component$, useStore, useComputed$ } from "@builder.io/qwik";
import {
  useLocation,
  type DocumentHead,
  useNavigate,
} from "@builder.io/qwik-city";
import ColorGrid from "~/components/color-grid/grid";
import { GoSearch16 } from "@qwikest/icons/octicons";
import { ALL_TAGS } from "~/util/colors";
import data from "~/data.json";
import FilterButton from "~/components/color-grid/filter-button";

type SearchAndFilters = {
  /** The active search term. */
  search: string;
  /** The active tags to filter by. */
  activeTags: string[];
};

export default component$(() => {
  const { url } = useLocation();
  const nav = useNavigate();

  // Parse the URL query string to retrieve any tags to pre-filter by.
  const params = new URLSearchParams(url.search);
  const tags = params.get("tags")?.split(",") || [];

  const store = useStore<SearchAndFilters>({
    search: "",
    activeTags: tags,
  });

  /**
   * Toggle a tag on or off in the active filters.
   * @param tag The tag to toggle.
   */
  const toggleTag = $((tag: string) => {
    store.activeTags = store.activeTags.includes(tag)
      ? store.activeTags.filter((t) => t !== tag)
      : [...store.activeTags, tag];

    // Update the URL query string parameters to reflect the new active filters.
    const params = new URLSearchParams(url.search);
    params.set("tags", store.activeTags.join(","));
    nav(url.pathname + "?" + params.toString());
  });

  /** Clear all active tag filters. */
  const filterAll = $(() => {
    store.activeTags = [];

    // Delete the `tags` query string parameter from the URL.
    const params = new URLSearchParams(url.search);
    params.delete("tags");
    nav(url.pathname + "?" + params.toString());
  });

  /** Filter the colors based on the current search and active filters. */
  const filteredColors = useComputed$(() => {
    let filtered = data.colors.filter((color) => {
      if (!store.activeTags.length) {
        return true;
      }
      return store.activeTags.every((tag) => color.tags.includes(tag));
    });
    if (store.search) {
      filtered = filtered.filter(
        (color) =>
          // Match the search term against the color's name or hexcode.
          color.keyword.toLowerCase().includes(store.search.toLowerCase()) ||
          color.hex.toLowerCase().includes(store.search.toLowerCase())
      );
    }
    return filtered;
  });

  return (
    <>
      <div class="grid items-center mb-1 grid-cols-1 sm:grid-cols-[250px_minmax(0,_1fr)]">
        <div class="flex items-center sm:mr-5 pt-0.5 pb-3 w-full sm:w-auto">
          <GoSearch16
            aria-hidden={true}
            class="text-lg mr-3 dark:text-slate-300 flex-shrink-0"
          />
          <input
            class="flex-1 px-3 py-1.5 rounded-md bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 placeholder:text-gray-400 dark:placeholder:text-slate-600  dark:text-slate-200"
            placeholder="almond, blue, #ffe..."
            aria-label="Search colors"
            value={store.search}
            onInput$={(event: any) => {
              store.search = event.target.value.replace(/ /g, "");
            }}
          />
        </div>
        <div class="flex items-center gap-2 pt-0.5 px-0.5 pb-3 overflow-x-auto">
          <FilterButton
            label="all"
            title="Show all colors"
            // Show the "all" filter as active if no other filters are active.
            active={!store.activeTags.length}
            toggleFilter$={filterAll}
          />
          {ALL_TAGS.filter((tag) => tag.includes("level-")).map((label) => (
            <FilterButton
              key={label}
              label={label}
              title={`Filter to colors included in the CSS ${label.replace(
                "-",
                " "
              )} spec`}
              active={store.activeTags.includes(label)}
              toggleFilter$={() => toggleTag(label)}
            />
          ))}
          {ALL_TAGS.filter((tag) => !tag.includes("level-")).map((label) => (
            <FilterButton
              key={label}
              label={label}
              title={`Filter to colors with the '${label}' tag`}
              active={store.activeTags.includes(label)}
              toggleFilter$={() => toggleTag(label)}
            />
          ))}
        </div>
      </div>
      <p class="text-center text-gray-800 dark:text-slate-400 pt-3 pb-5">
        {filteredColors.value.length === 0
          ? "No colors match all of the current filters."
          : `${filteredColors.value.length} total color(s).`}
      </p>
      <ColorGrid colors={filteredColors.value} />
    </>
  );
});

export const head: DocumentHead = {
  title: "named-colors",
  meta: [
    {
      name: "description",
      content:
        "Explore, filter, play with, and enjoy the unique set of named colors in CSS.",
    },
  ],
};
