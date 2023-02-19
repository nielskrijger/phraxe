import { kebabCase } from "lodash";

/**
 * Returns a kebab-cased slug from a string.
 */
export function slugify(str: string): string {
  return kebabCase(str).substr(0, 100);
}
