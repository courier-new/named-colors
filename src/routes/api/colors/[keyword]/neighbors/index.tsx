import { type RequestHandler } from "@builder.io/qwik-city";
import { uniqBy } from "lodash";
import data, { type Color } from "~/data.json";
import { distanceBetween } from "~/util/colors";

type NeighboringColors = {
  left: Color[];
  right: Color[];
};

export type NeighborsResponse = {
  hue: NeighboringColors;
  saturation: NeighboringColors;
  lightness: NeighboringColors;
};

const NUM_NEIGHBORS = 4;
export const EMPTY_RESPONSE: NeighborsResponse = {
  hue: { left: [], right: [] },
  saturation: { left: [], right: [] },
  lightness: { left: [], right: [] },
};

export const onGet: RequestHandler = async ({ json, params }) => {
  const keyword = params.keyword;
  if (!keyword) {
    json(400, { error: "Missing keyword" });
    return;
  }

  const baseColor = data.colors.find((color) => color.keyword === keyword);
  if (!baseColor) {
    json(404, { error: "Color not found" });
    return;
  }

  const response = EMPTY_RESPONSE;

  // Filter out aliases for the same hexcode, and the base color itself
  const neighbors = uniqBy(
    data.colors.filter(
      (color) => color.keyword !== keyword && color.hex !== baseColor.hex
    ),
    "hex"
  );

  (["hue", "saturation", "lightness"] as const).forEach((axis) => {
    const labeledNeighbors = neighbors.map((color) => ({
      ...color,
      distance: distanceBetween(baseColor, color, axis),
    }));

    const leftNeighbors = labeledNeighbors
      .filter((color) => color.distance <= 0)
      .sort((a, b) => {
        if (a.distance === b.distance) {
          if (a.hsl[2] === b.hsl[2]) {
            return a.hsl[1] - b.hsl[1];
          }
          return a.hsl[2] - b.hsl[2];
        }
        return Math.abs(a.distance) - Math.abs(b.distance);
      })
      .slice(0, NUM_NEIGHBORS);
    const rightNeighbors = labeledNeighbors
      .filter((color) => color.distance > 0)
      .sort((a, b) => {
        if (a.distance === b.distance) {
          if (a.hsl[2] === b.hsl[2]) {
            return a.hsl[1] - b.hsl[1];
          }
          return a.hsl[2] - b.hsl[2];
        }
        return Math.abs(a.distance) - Math.abs(b.distance);
      })
      .slice(0, NUM_NEIGHBORS);

    response[axis] = { left: leftNeighbors, right: rightNeighbors };
  });

  json(200, response);
};
