/**
 * Concatenates a list of class names, filtering out any that are undefined or falsey.
 *
 * @param {...(string | undefined)[]} classes - The list of class names to concatenate.
 * @returns {string} The concatenated class names.
 */
export function cn(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}
