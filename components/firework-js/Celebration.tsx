"use client";

import { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

export default function Celebration({
  trigger,
}: {
  trigger: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<Fireworks | null>(null);

  // Create once
  useEffect(() => {
    if (!containerRef.current) return;

    fireworksRef.current = new Fireworks(containerRef.current, {
      rocketsPoint: {
        min: 20,
        max: 80,
      },
      hue: {
        min: 0,
        max: 360,
      },
      delay: {
        min: 15,
        max: 30,
      },
      acceleration: 1.05,
      friction: 0.98,
      gravity: 1.2,
      particles: 120,
      traceLength: 3,
      explosion: 8,
      autoresize: true,
    });

    return () => {
      fireworksRef.current?.stop();
    };
  }, []);

  // Trigger whenever needed
  useEffect(() => {
    if (!trigger) return;

    fireworksRef.current?.start();

    const timeout = setTimeout(() => {
      fireworksRef.current?.stop();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}