"use client";

import { useState } from "react";
import SolarPanelCard from "./SolarPanelCard";

export default function SolarPanelCardDemo() {
  const [loading, setLoading] = useState(false);

  function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="w-full rounded-xl bg-[#eef4f6] p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SolarPanelCard
          name="Roof Array A"
          location="Rooftop, south face"
          outputKw={4.2}
          capacityKw={5.5}
          efficiency={21.4}
          todayKwh={18.6}
          status="producing"
          updatedLabel="2 min ago"
          loading={loading}
          href="#roof-array-a"
        />
        <SolarPanelCard
          name="Carport Array"
          location="Parking level 1"
          outputKw={0}
          capacityKw={8}
          efficiency={0}
          todayKwh={3.1}
          status="maintenance"
          updatedLabel="1 hr ago"
          loading={loading}
        />
      </div>
      <button
        type="button"
        onClick={refresh}
        disabled={loading}
        className="mt-4 rounded-full border-2 border-[#0f2a33] px-4 py-2 text-sm font-semibold text-[#0f2a33] hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#157548] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Refreshing" : "Refresh data"}
      </button>
    </div>
  );
}
