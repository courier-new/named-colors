/**
 * Represents a color with its keyword, hexadecimal, decimal, HSL values, and tags.
 */
export type Color = {
  keyword: string;
  hex: string;
  decimal: [r: number, g: number, b: number];
  hsl: [h: number, s: number, l: number];
  tags: string[];
};

const data: { colors: Color[] };

export default data;
