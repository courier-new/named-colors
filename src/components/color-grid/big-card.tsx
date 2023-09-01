import {
  component$,
  useContext,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import bigCard from "./big-card.css?inline";
import {
  GoArrowUpRight16,
  GoHash24,
  GoHeart24,
  GoHeartFill24,
} from "@qwikest/icons/octicons";
import { useFavorites } from "~/components/useFavorites";
import CopyButton from "~/components/copy-button/copy-button";
import { GlobalStore } from "~/context";
import { tooltipForFormat, valueForFormat } from "~/util/colors";
import type { Color } from "~/data.json";

type BigCardProps = {
  asLink?: boolean;
  color: Color;
  classes?: string;
};

export default component$<BigCardProps>(({ asLink, color, classes = "" }) => {
  useStyles$(bigCard);

  const globalStore = useContext(GlobalStore);
  const timesClicked = useSignal(0);

  const [favorites, addFavorite$, removeFavorite$] = useFavorites();
  const isFavorited = favorites.includes(color.keyword);
  const hex = valueForFormat("hex", color);
  const rgb = valueForFormat("rgb", color);
  const hsl = valueForFormat("hsl", color);

  return (
    <>
      <div
        class={`flex sm:flex-row flex-col sm:items-center gap-2 big-card w-full p-5 flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md ${classes}`}
      >
        <div
          class="xs:w-48 h-48 lg:w-56 lg:h-56 sm:mr-4 mb-2 sm:mb-0 flex-shrink-0"
          style={{ backgroundColor: color.hex }}
          onClick$={() => {
            if (color.keyword === "cadetblue") {
              timesClicked.value += 1;
              if (timesClicked.value === 5) {
                globalStore.godMode = !globalStore.godMode;
                timesClicked.value = 0;
              }
            }
          }}
        />
        <div class="flex flex-col flex-1">
          <h1 class="flex items-center justify-between text-3xl font-mono mb-2 lg:mb-4 dark:text-slate-300">
            {asLink ? (
              <Link
                href={`/colors/${color.keyword}`}
                title={`View ${color.keyword}`}
                class="group flex items-center justify-between font-mono"
              >
                {color.keyword}
                <GoArrowUpRight16 class="inline-block ml-1 opacity-0 group-hover:opacity-100" />
              </Link>
            ) : (
              color.keyword
            )}
            <button
              class="visible sm:hidden flex-shrink-0"
              onClick$={() => {
                if (isFavorited) {
                  removeFavorite$(color.keyword);
                } else {
                  addFavorite$(color.keyword);
                }
              }}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? (
                <GoHeartFill24 class="text-pink-300 dark:text-pink-600" />
              ) : (
                <GoHeart24 class="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300" />
              )}
            </button>
          </h1>
          <div class="grid grid-cols-[min-content_min-content] gap-x-5 items-center">
            <span class="code-label">HEX</span>
            <CopyButton
              title={`${tooltipForFormat(globalStore.format)} for ${
                color.keyword
              }`}
              classes="font-mono justify-self-start text-gray-400 dark:text-slate-500 z-30"
              valueToCopy={hex}
            >
              {hex}
            </CopyButton>
            <span class="code-label">RGB</span>
            <CopyButton
              title={`${tooltipForFormat(globalStore.format)} for ${
                color.keyword
              }`}
              classes="font-mono justify-self-start text-gray-400 dark:text-slate-500 z-20"
              valueToCopy={rgb}
            >
              {rgb}
            </CopyButton>
            <span class="code-label">HSL</span>
            <CopyButton
              title={`${tooltipForFormat(globalStore.format)} for ${
                color.keyword
              }`}
              classes="font-mono justify-self-start text-gray-400 dark:text-slate-500 z-10"
              valueToCopy={hsl}
            >
              {hsl}
            </CopyButton>
          </div>
          <div class="mt-5 lg:mt-10 flex items-center">
            <GoHash24 class="text-gray-400 mr-2" />
            {color.tags.map((tag, index) => (
              <span
                key={tag}
                class="text-sm flex-shrink-0 mr-1 dark:text-slate-300"
              >
                <Link href={`/?tags=${tag}`}>{tag}</Link>
                {index < color.tags.length - 1 ? "," : null}
              </span>
            ))}
          </div>
        </div>
        <button
          class="hidden sm:block flex-shrink-0 text-3xl self-start -mt-0.5"
          onClick$={() => {
            if (isFavorited) {
              removeFavorite$(color.keyword);
            } else {
              addFavorite$(color.keyword);
            }
          }}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <GoHeartFill24 class="text-pink-300 dark:text-pink-600" />
          ) : (
            <GoHeart24 class="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300" />
          )}
        </button>
      </div>
    </>
  );
});
