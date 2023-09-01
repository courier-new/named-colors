import {
  component$,
  useComputed$,
  useContext,
  useStyles$,
} from "@builder.io/qwik";
import {
  GoHeartFill24,
  GoHeart24,
  GoArrowUpRight16,
} from "@qwikest/icons/octicons";
import card from "./card.css?inline";
import { GlobalStore } from "~/context";
import { Link } from "@builder.io/qwik-city";
import { useFavorites } from "../useFavorites";
import CopyButton from "../copy-button/copy-button";
import { tooltipForFormat, valueForFormat } from "~/util/colors";
import type { Color } from "~/data.json";

type PlaceholderCardProps = {
  classes?: string;
};

type CardProps = {
  asLink?: boolean;
  color: Color;
  classes?: string;
  visible?: boolean;
};

export default component$<CardProps>(
  ({ asLink, color, classes = "", visible = true }) => {
    useStyles$(card);
    const globalStore = useContext(GlobalStore);
    const colorValue = useComputed$(() =>
      valueForFormat(globalStore.format, color)
    );

    const [favorites, addFavorite$, removeFavorite$] = useFavorites();
    const isFavorited = favorites.includes(color.keyword);

    return (
      <div
        class={`w-full p-5 xs:p-3 flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md flex flex-col ${
          asLink && "card-link hover:scale-102"
        } ${classes}`}
        style={{
          display: visible ? undefined : "none",
          transition: "all 300ms",
        }}
      >
        <div class="h-28 mb-6" style={{ backgroundColor: color.hex }} />
        {asLink ? (
          <Link
            href={`/colors/${color.keyword}`}
            title={`View ${color.keyword}`}
            class="group flex items-center justify-between font-mono text-gray-600 dark:text-slate-300 py-2"
          >
            <span class="min-w-0 overflow-hidden text-ellipsis text-sm">
              {color.keyword}
            </span>
            <GoArrowUpRight16 class="inline-block ml-1 opacity-0 group-hover:opacity-100" />
          </Link>
        ) : (
          <span class="min-w-0 overflow-hidden text-ellipsis text-sm font-mono text-gray-600 dark:text-slate-300 py-2">
            {color.keyword}
          </span>
        )}
        <hr class="mb-2 border-gray-300 dark:border-slate-600" />
        <div class="flex justify-between items-center">
          <CopyButton
            title={`${tooltipForFormat(globalStore.format)} for ${
              color.keyword
            }`}
            classes="font-mono text-gray-400 dark:text-slate-500 text-xs"
            valueToCopy={colorValue.value}
          >
            {colorValue.value}
          </CopyButton>
          <span class="flex-grow" />
          <button
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
      </div>
    );
  }
);

export const PlaceholderCard = component$<PlaceholderCardProps>(
  ({ classes = "w-full p-5 xs:p-3" }) => {
    useStyles$(card);

    return (
      <div
        class={`flex-shrink-0 border-solid bg-gray-200 border-gray-200 dark:border-slate-700 dark:bg-slate-700 border-2 rounded-md flex flex-col ${classes}`}
      />
    );
  }
);
