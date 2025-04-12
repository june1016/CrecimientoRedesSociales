"use client";

import dynamic from "next/dynamic";

const InstagramGrowthModel = dynamic(
  () => import("@/features/instagram-growth-model"),
  {
    ssr: false,
    loading: () => <div>Cargando...</div>,
  }
);

export default function InstagramGrowthWrapper() {
  return (
    <div suppressHydrationWarning>
      <InstagramGrowthModel />
    </div>
  );
}
