"use client";

import { useSyncExternalStore } from "react";
import { Board } from "@/components/Board";

const subscribe = () => () => undefined;

export default function Home() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  if (!isClient) {
    return (
      <div className="px-8 py-6">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          Project board
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">
          Website Launch
        </h1>
      </div>
    );
  }

  return <Board />;
}
