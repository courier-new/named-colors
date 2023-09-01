import { component$, useContext } from "@builder.io/qwik";
import ColorGrid from "~/components/color-grid/grid";
import { useFavorites } from "~/components/useFavorites";
import { GlobalStore } from "~/context";
import BigCard from "~/components/color-grid/big-card";
import data from "~/data.json";

export default component$(() => {
  const [favorites] = useFavorites();
  const globalStore = useContext(GlobalStore);

  const favoriteColors = data.colors.filter((color) =>
    favorites.includes(color.keyword)
  );

  if (!favoriteColors.length) {
    return (
      <p class="text-center text-gray-800 dark:text-slate-400 pt-3 pb-5">
        You haven't added any favorites yet.
      </p>
    );
  }

  if (globalStore.gridSize === "small") {
    return <ColorGrid colors={favoriteColors} />;
  }

  return (
    <>
      {favoriteColors.map((color) => (
        <BigCard
          key={color.keyword}
          asLink={true}
          color={color}
          classes="mb-5"
        />
      ))}
    </>
  );
});
