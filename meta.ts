import type { GalleryItem } from "../types";
import Demo from "./Demo";

export const solarPanelCard: GalleryItem = {
  slug: "solar-panel-card",
  name: "Solar Panel Card",
  type: "card",
  week: 1,
  description:
    "A status card for one solar array: live output against capacity, efficiency, today's yield and a clear status label.",
  added: "2026-10-10",
  sourceFile: "SolarPanelCard.tsx",
  usage: `import SolarPanelCard from "@/registry/solar-panel-card/SolarPanelCard";

<SolarPanelCard
  name="Roof Array A"
  location="South roof"
  outputKw={4.2}
  capacityKw={5.5}
  efficiency={21.4}
  todayKwh={18.6}
  status="producing"
  updatedLabel="2 min ago"
  href="/arrays/roof-a"
/>`,
  props: [
    { name: "name", type: "string", description: "Panel or array name. Required." },
    { name: "location", type: "string", description: "Shown under the name." },
    { name: "outputKw", type: "number", description: "Current output in kW. Required." },
    { name: "capacityKw", type: "number", description: "Maximum rated output in kW. Required." },
    { name: "efficiency", type: "number", description: "Conversion efficiency in percent. Required." },
    { name: "todayKwh", type: "number", description: "Energy produced today in kWh." },
    { name: "status", type: '"producing" | "idle" | "maintenance" | "offline"', description: "Sets the label, colors and panel graphic. Required." },
    { name: "updatedLabel", type: "string", description: 'Last update text, e.g. "2 min ago".' },
    { name: "loading", type: "boolean", default: "false", description: "Shows a skeleton while data loads." },
    { name: "href", type: "string", description: "Makes the card a link with hover and focus states." },
    { name: "footer", type: "ReactNode", description: "Extra content under the stats, such as a button." },
    { name: "className", type: "string", description: "Extra classes for the outer element." },
  ],
  Demo,
};
