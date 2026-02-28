"use client";

import dynamic from "next/dynamic";

const BiblicalWorldMap = dynamic(
  () =>
    import("@/components/landing/BiblicalWorldMap").then(
      (m) => m.BiblicalWorldMap
    ),
  { ssr: false }
);

export function BiblicalWorldMapLoader() {
  return <BiblicalWorldMap />;
}
