"use client"

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/drake.mp3";
const HIT_RADIUS = 10;
const DEBUG_EASTER_EGG = true; // Enable debug mode in development

export default function DrakeEasterEgg() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const armedRef = useRef(false);
    const playedRef = useRef(false);
    const insideZoneRef = useRef(false);
    const [debugTarget, setDebugTarget] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const pickRandomSpot = () => {
            const target = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
            };
            targetRef.current = target;
            setDebugTarget(target);
        };

        const armAudio = () => {
            armedRef.current = true;
            audioRef.current = new Audio(AUDIO_SRC);
            audioRef.current.preload = "auto";
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (!armedRef.current || playedRef.current || !audioRef.current) return;

            const dx = event.clientX - targetRef.current.x;
            const dy = event.clientY - targetRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const isInsideZone = distance <= HIT_RADIUS;

            if (isInsideZone && !insideZoneRef.current) {
                insideZoneRef.current = true;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                insideZoneRef.current = false;
                });
            }

            if (!isInsideZone && insideZoneRef.current) {
                insideZoneRef.current = false;
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                }
            };

        pickRandomSpot();

        window.addEventListener("pointerdown", armAudio);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("resize", pickRandomSpot);

        return () => {
            window.removeEventListener("pointerdown", armAudio);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("resize", pickRandomSpot);
        };
    }, []);

   if(!DEBUG_EASTER_EGG) return null; // This component does not render anything

   return (
        <div
            style={{
                position: "fixed",
                left: debugTarget?.x ?? 0,
                top: debugTarget?.y ?? 0,
                width: HIT_RADIUS * 2,
                height: HIT_RADIUS * 2,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
            }}
        />
    );
}