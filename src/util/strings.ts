/**
 * compareCloseEnough compares two strings to see if they are close enough to be
 * considered the same string. The threshold for closeness is if the strings differ
 * by at most 2 characters.
 *
 * @param str1 The first string to compare.
 * @param str2 The second string to compare.
 * @returns True if the strings are close enough, false otherwise.
 */
export const compareCloseEnough = (str1: string, str2: string): boolean => {
  if (str1.toLowerCase() === str2.toLowerCase()) {
    return true;
  }

  // If the strings differ by more than 2 characters in length, they are not close enough.
  if (str1.length >= str2.length + 2 || str2.length >= str1.length + 2) {
    return false;
  }

  // We will compare the strings character by character, counting differences.
  let differences = 0;
  let i = 0;
  let j = 0;
  while (i < str1.length && j < str2.length) {
    if (str1[i]?.toLowerCase() !== str2[j]?.toLowerCase()) {
      differences++;
      // If the strings differ by more than 2 characters, they are not close enough and
      // we can stop comparing and just return false.
      if (differences > 2) {
        return false;
      }
      // It's possible the difference is due to an extra or missing character in one of
      // the strings. If that's the case, we can increment the index for the string with
      // the extra character and continue. To check, we will look ahead one character in
      // each string to see if it matches the current character in the other string.
      if (str1[i + 1]?.toLowerCase() === str2[j]?.toLowerCase()) {
        i++;
      } else if (str1[i]?.toLowerCase() === str2[j + 1]?.toLowerCase()) {
        j++;
      }
    }
    i++;
    j++;
  }

  return differences <= 2;
};

/**
 * generateHint generates a hint for a word in the form of a string with some letters
 * filled in and underscore "gaps". The number of letters filled in is determined by the
 * length of the word and will not exceed 2/5 of the total letters in the word. The
 * positions of the letters filled in are random.
 *
 * @param word The word to generate a hint for.
 * @returns A string with some letters filled in and some underscore "gaps".
 * @example```ts
 * const word = "watermelon";
 * generateHint(word); // "_a____el_n"
 * generateHint(word); // "w_te___l__"
 * ```
 */
export const generateHint = (word: string): string => {
  // We will attempt to fill in up to 2/5 of the letters in the word.
  const numToFill = Math.floor((word.length / 5) * 2);
  // Start with an array of underscores the same length as the word.
  const hintText = Array.from({ length: word.length }).fill("_");
  // We will build a set of indices of letters to fill in, to make sure we have numToFill
  // unique indices.
  const lettersToFill = new Set<number>();
  while (lettersToFill.size < numToFill) {
    lettersToFill.add(Math.floor(Math.random() * word.length));
  }
  // Now we can fill in the letters at the random indices chosen.
  lettersToFill.forEach((index) => {
    hintText[index] = word[index];
  });
  return hintText.join("");
};
