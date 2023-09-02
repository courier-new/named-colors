import type { Format } from "~/components/format-toggle";
import data, { type Color } from "~/data.json";

/**
 * ColorHSL represents a color in the HSL color space.
 */
export type ColorHSL = {
  /** The hue channel value (in the range 0 to 360). */
  h: number;
  /** The saturation channel percentage value (in the range 0 to 100). */
  s: number;
  /** The lightness channel percentage value (in the range 0 to 100). */
  l: number;
};

/**
 * ALL_TAGS is a list of all the unique tags referenced by colors in the data.json file.
 * It is used to generate the tag filters next to the search bar.
 */
export const ALL_TAGS = Array.from(
  new Set(data.colors.flatMap((color) => color.tags))
).sort();

/**
 * rgbToHex implements the conversion of a set of RGB values representing a color to the
 * corresponding set of HSL values. The conversion is based on the algorithm described at
 * https://www.rapidtables.com/convert/color/rgb-to-hsl.html. The return values are
 * rounded to the nearest whole number.
 *
 * This function was run over the data.json file to generate the HSL values for each
 * color.
 *
 * @param r The red value.
 * @param g The green value.
 * @param b The blue value.
 * @returns Tuple of corresponding hue, saturation, and lightness values.
 */
export const rgbToHSL = (
  r: number,
  g: number,
  b: number
): [h: number, s: number, l: number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = (((g - b) / delta) % 6) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  if (h < 0) {
    h += 360;
  }

  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
};

/**
 * Calculates the numerical distance between two colors along a specified axis.
 *
 * @param a The first color.
 * @param b The second color.
 * @param axis The axis to calculate the distance along, i.e. "hue", "saturation", or
 * "lightness".
 * @returns The unit distance between the two colors along the specified axis.
 * @example```ts
 * const red = { hsl: [0, 100, 50] };
 * const blue = { hsl: [240, 100, 50] };
 * const green = { hsl: [120, 100, 50] };
 * const violet = { hsl: [300, 100, 50] };
 * const black = { hsl: [0, 0, 0] };
 *
 * distanceBetween(red, blue, "hue"); // -120
 * distanceBetween(blue, red, "hue"); // 120
 * distanceBetween(red, blue, "saturation"); // 0
 * distanceBetween(red, black, "saturation"); // -100
 * distanceBetween(red, green, "hue"); // 120
 * distanceBetween(red, violet, "hue"); // -60
 * distanceBetween(violet, red "hue"); // 60
 * ```
 */
export const distanceBetween = (
  a: Color,
  b: Color,
  axis: "hue" | "saturation" | "lightness"
): number => {
  const [aH, aS, aL] = a.hsl;
  const [bH, bS, bL] = b.hsl;

  switch (axis) {
    case "hue":
      // We apply special handling for shades of gray and red, which both have a hue of 0
      // in the HSL color space. We want to treat grays as having a distance of 0 from
      // other grays, and reds as having a distance of 0 from other reds, but grays and
      // reds should be considered as far away from each other as possible.
      //
      // If both colors have a hue of 0 and share the same saturation, they are either both
      // gray or both red, so we return a distance of 0.
      if (aH === 0 && bH === 0 && aS === bS) {
        return 0;
      }
      // However, if one is a shade of gray (i.e. its hue and saturation are both 0) and
      // the other is not, we return NaN to indicate that the colors are as far away from
      // each other as possible.
      if (aS !== bS && ((aH === 0 && aS === 0) || (bH === 0 && bS === 0))) {
        return NaN;
      }

      const dH = bH - aH;
      // The hue value cycles from 0 to 360 and then wrap, so colors at opposite ends of
      // the spectrum (e.g. hue 0 and hue 359) are actually very close to each other. If
      // the normal distance is greater than 180, we return the distance between the two
      // hues in the opposite direction (-360 + dH) to get the shorter distance.
      return dH > 180
        ? -360 + dH
        : // Likewise, if the normal distance is less than -180, we return the distance
        // between the two hues in the opposite direction (360 + dH) to get the shorter
        // distance.
        dH < -180
        ? 360 + dH
        : // Otherwise, we already found the shortest distance, so we return it.
          dH;
    case "saturation":
      return bS - aS;
    case "lightness":
      return bL - aL;
  }
};

/**
 * compareColorsCloseEnough compares two colors to see if they are close enough to be
 * considered the same color by taking the difference between their hue, saturation, and
 * lightness values and comparing each to a threshold.
 *
 * @param c1 The first color to compare.
 * @param c2 The second color to compare.
 * @param channel The color channels to compare. If "all", all channels must be within 10
 * units of each other. If "any", at least one of hue or saturation must be within 10
 * units of each other, and lightness must be within 20 units.
 * @returns True if the colors are close enough, false otherwise.
 */
export const compareColorsCloseEnough = (
  c1: ColorHSL,
  c2: ColorHSL,
  channel: "all" | "any"
): boolean => {
  const { h: h1, s: s1, l: l1 } = c1;
  const { h: h2, s: s2, l: l2 } = c2;

  const hueDiff = Math.abs(h1 - h2);
  const satDiff = Math.abs(s1 - s2);
  const lightDiff = Math.abs(l1 - l2);

  if (channel === "all") {
    return hueDiff < 10 && satDiff < 10 && lightDiff < 10;
  } else {
    return (hueDiff < 10 || satDiff < 10) && lightDiff < 20;
  }
};

/**
 * tooltipForFormat returns the tooltip text to display for a button to copy a color in a
 * given format.
 *
 * @param format The color format to provide a tooltip for.
 * @returns The tooltip text to display for the copy button.
 */
export const tooltipForFormat = (format: Format): string => {
  switch (format) {
    case "hex":
      return "Copy hex code";
    case "keyword":
      return "Copy keyword";
    case "rgb":
      return "Copy RGB code";
    case "hsl":
      return "Copy HSL code";
    default:
      return "Copy color";
  }
};

/**
 * formatHSL returns the string format representation of a color in the HSL color space.
 *
 * @param hsl The HSL color to format, either as an object with `h`, `s`, and `l`
 * properties, or as an array with three elements representing `h`, `s`, and `l`.
 * @returns The color formatted as an HSL string.
 */
export const formatHSL = (
  hsl: ColorHSL | [h: number, s: number, l: number]
): string => {
  let h, s, l: number;
  if (Array.isArray(hsl)) {
    [h, s, l] = hsl;
  } else {
    ({ h, s, l } = hsl);
  }
  return `hsl(${h},${s}%,${l}%)`;
};

/**
 * Returns the color value representation in the specified format, as a string.
 *
 * @param format The format to return the color value in.
 * @param color The color to format.
 * @returns The color formatted as a string in the specified format.
 */
export const valueForFormat = (format: Format, color: Color): string => {
  switch (format) {
    case "keyword":
      return color.keyword;
    case "rgb":
      return `rgb(${color.decimal.join(",")})`;
    case "hsl":
      return formatHSL(color.hsl);
    case "hex":
    default:
      return color.hex;
  }
};

/**
 * generateHSLHint generates a color hint in the form of a `ColorHSL` object, based on a
 * given color. The hint will contain the correct value for one of the three color
 * channels, picked at random, and the other two channels will be set to -1.
 *
 * @param color The color to generate a hint for.
 * @returns A `ColorHSL` object representing the hint.
 * @example```ts
 * const red = { hsl: [0, 100, 50] };
 * generateHSLHint(red); // { h: -1, s: 100, l: -1 }
 * generateHSLHint(red); // { h: 0, s: -1, l: -1 }
 * ```
 */
export const generateHSLHint = (color: Color): ColorHSL => {
  const channel = Math.floor(Math.random() * 3);
  const value = color.hsl[channel] || 0;

  return {
    h: channel === 0 ? value : -1,
    s: channel === 1 ? value : -1,
    l: channel === 2 ? value : -1,
  };
};
