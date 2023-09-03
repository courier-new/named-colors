import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import BigCard from "~/components/color-grid/big-card";
import Card, { PlaceholderCard } from "~/components/color-grid/card";
import SmallCard, {
  SmallPlaceholderCard,
} from "~/components/color-grid/small-card";
import data, { type Color } from "~/data.json";
import {
  EMPTY_RESPONSE,
  type NeighborsResponse,
} from "~/routes/api/colors/[keyword]/neighbors";

/** A card displaying a neighboring color. */
const NeighborCard = component$<{ color: Color; asLink?: boolean }>(
  ({ color, asLink = true }) => (
    <>
      {/* Display a smaller, more compact version of the card on
          smaller screens, and a more normal-sized card with a
          max width on larger screens. */}
      <SmallCard classes="lg:hidden" color={color} asLink={asLink} />
      <Card
        classes="hidden lg:flex max-w-[11rem] "
        color={color}
        asLink={asLink}
      />
    </>
  )
);

/**
 * Placeholder variant of the `NeighborCard`, for preserving positioning/layout while data
 * is loading.
 */
const NeighborPlaceholderCard = component$(() => (
  <>
    <SmallPlaceholderCard classes="lg:hidden" />
    <PlaceholderCard classes="hidden lg:flex max-w-[11rem] h-56" />
  </>
));

export default component$(() => {
  const location = useLocation();

  // Look up the color by the keyword provided in the URL.
  const color = data.colors.find(
    (color) => color.keyword === location.params.keyword
  );

  if (!color) {
    return <h1 class="text-gray-800 dark:text-slate-300">Color not found.</h1>;
  }

  // Load the neighboring colors for the current color.
  const neighbors = useResource$<NeighborsResponse>(
    async ({ cleanup, track }) => {
      // Track the keyword in the URL to ensure the resource is reloaded when the URL (and
      // thus the current color) changes.
      track(() => location.params.keyword);

      // Abort any pending requests when the resource is disposed.
      const controller = new AbortController();
      cleanup(() => controller.abort());

      const endpointURL = new URL(
        `/api/colors/${location.params.keyword}/neighbors`,
        location.url.href
      );
      try {
        const resp = await fetch(endpointURL, {
          method: "GET",
          signal: controller.signal,
        });
        const json = (await resp.json()) as NeighborsResponse;
        return json;
      } catch (err) {
        console.error(err);
        return EMPTY_RESPONSE;
      }
    }
  );

  return (
    <>
      <BigCard color={color} />
      <h2 class="mt-8 text-xl text-gray-900 dark:text-slate-200">
        Neighboring colors
      </h2>
      <div class="flex items-center min-h-28">
        <h3 class="text-sm rotate-90 uppercase spacing font-bold -ml-2 tracking-widest text-gray-400 dark:text-slate-500">
          Hue
        </h3>
        {/* Zero-width totally invisible placeholder to prevent layout shift when resource
            loads on the server; onPending isn't rendered then. */}
        <SmallPlaceholderCard classes="lg:hidden w-0 p-0 border-none mt-3 mb-4 h-28" />
        <PlaceholderCard classes="hidden lg:flex w-0 p-0 xs:p-0 h-56 border-none my-3.5" />
        <Resource
          value={neighbors}
          onPending={() => (
            <div class="w-full flex gap-2 pt-3 pb-4 overflow-hidden">
              {Array.from({ length: 7 }).map((_, id) => (
                <NeighborPlaceholderCard key={id} />
              ))}
            </div>
          )}
          onResolved={(ns) => (
            <div class="pt-3 pb-4 overflow-x-auto overflow-y-hidden">
              <div
                class="flex gap-2"
                style={{
                  minWidth: (ns.hue.left.length + ns.hue.right.length) * 300,
                }}
              >
                {/* TODO: Show this color emphasized differently. */}
                {[...ns.hue.left].reverse().map((color) => (
                  <NeighborCard key={color.keyword} color={color} />
                ))}
                <NeighborCard color={color} asLink={false} />
                {ns.hue.right.map((color) => (
                  <NeighborCard key={color.keyword} color={color} />
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
});
