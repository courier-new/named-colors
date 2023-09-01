import { component$ } from "@builder.io/qwik";
import Card from "./card";
import type { Color } from "~/data.json";
import data from "~/data.json";

type GridProps = {
  colors: Color[];
};

export default component$<GridProps>(({ colors }) => {
  return (
    <div class="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-3 md:gap-4 xl:gap-5">
      {data.colors.map((color) => (
        <Card
          key={color.keyword}
          color={color}
          asLink={true}
          visible={colors.findIndex((c) => c.keyword === color.keyword) > -1}
        />
      ))}
    </div>
  );
});
