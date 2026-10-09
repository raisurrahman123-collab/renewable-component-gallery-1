import type { ComponentType } from "react";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface GalleryItem {
  /** URL segment: /components/<slug>. Must match the folder name in /registry. */
  slug: string;
  name: string;
  /** UI category, e.g. "button", "card". Matches the Type line in the Discord post. */
  type: string;
  /** Challenge week the component was submitted in. */
  week: number;
  description: string;
  /** YYYY-MM-DD */
  added: string;
  /** Component file inside registry/<slug>/, shown as source code on the page. */
  sourceFile: string;
  usage: string;
  props: PropDoc[];
  Demo: ComponentType;
}
