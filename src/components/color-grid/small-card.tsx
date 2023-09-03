import { component$, useStyles$ } from "@builder.io/qwik";
import card from "./card.css?inline";
import { Link } from "@builder.io/qwik-city";
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

const CardContents = component$<Pick<CardProps, "color">>(({ color }) => {
  return (
    <div
      class={`w-full h-full p-2 font-mono ${
        color.keyword.length > 12 ? "text-lg" : "text-xl"
      } leading-tight tracking-tighter ${
        color.hsl[2] < 50 ? "text-white" : ""
      }`}
      style={{ backgroundColor: color.hex }}
    >
      <span class="block w-full h-full min-w-0 opacity-50 overflow-hidden break-words">
        {color.keyword}
      </span>
    </div>
  );
});

export default component$<CardProps>(
  ({ asLink, classes, color, visible = true }) => {
    useStyles$(card);

    return asLink ? (
      <Link
        class={`w-28 p-2 aspect-square flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md card-link hover:scale-102 ${
          color.hsl[2] < 50 ? "decoration-white" : ""
        } ${classes}`}
        style={{
          display: visible ? undefined : "none",
          transition: "all 300ms",
        }}
        href={asLink ? `/colors/${color.keyword}` : undefined}
        title={asLink ? `View ${color.keyword}` : undefined}
      >
        <CardContents color={color} />
      </Link>
    ) : (
      <div
        class={`w-28 p-2 aspect-square flex-shrink-0 border-solid bg-white border-gray-200 dark:border-slate-700 dark:bg-slate-900 border-2 rounded-md ${classes}`}
        style={{
          display: visible ? undefined : "none",
          transition: "all 300ms",
        }}
      >
        <CardContents color={color} />
      </div>
    );
  }
);

export const SmallPlaceholderCard = component$<PlaceholderCardProps>(
  ({ classes = "w-28 p-2" }) => {
    useStyles$(card);

    return (
      <div
        class={`aspect-square flex-shrink-0 border-solid bg-gray-200 border-gray-200 dark:border-slate-700 dark:bg-slate-700 border-2 rounded-md ${classes} `}
      />
    );
  }
);
