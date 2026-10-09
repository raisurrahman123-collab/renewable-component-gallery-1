import type { GalleryItem } from "./types";
import { solarChargeButton } from "./solar-charge-button/meta";
import { solarPanelCard } from "./solar-panel-card/meta";

// To add a component: create registry/<slug>/, write meta.ts, then add it here.
export const registry: GalleryItem[] = [
  solarChargeButton,
  solarPanelCard,
];

export function getItem(slug: string) {
  return registry.find((item) => item.slug === slug);
}
