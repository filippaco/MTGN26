"use client"

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/drake.mp3";
const DESKTOP_HIT_RADIUS = 36;
const MOBILE_HIT_RADIUS = 90;
const DEBUG_EASTER_EGG = true; // Enable debug mode in development

export default function DrakeEasterEgg() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const hitRadiusRef = useRef(DESKTOP_HIT_RADIUS);
    const isMobileRef = useRef(false);
    const armedRef = useRef(false);
    const insideZoneRef = useRef(false);
    const [debugTarget, setDebugTarget] = useState<{ x: number; y: number } | null>(null);
    const [debugRadius, setDebugRadius] = useState(DESKTOP_HIT_RADIUS);

    useEffect(() => {
        const updatePointerMode = () => {
            isMobileRef.current = window.matchMedia("(pointer: coarse)").matches;
            hitRadiusRef.current = isMobileRef.current ? MOBILE_HIT_RADIUS : DESKTOP_HIT_RADIUS;
            setDebugRadius(hitRadiusRef.current);
        };

        const pickRandomSpot = () => {
            updatePointerMode();

            const horizontalPadding = Math.min(40, window.innerWidth / 4);
            const topPadding = Math.min(100, window.innerHeight / 3);
            const bottomPadding = Math.min(80, window.innerHeight / 3);

            const target = {
                x: horizontalPadding + Math.random() * Math.max(window.innerWidth - horizontalPadding * 2, 1),
                y: topPadding + Math.random() * Math.max(window.innerHeight - topPadding - bottomPadding, 1),
            };
            targetRef.current = target;
            setDebugTarget(target);
        };

        const armAudio = () => {
            if (armedRef.current && audioRef.current) return;

            armedRef.current = true;
            audioRef.current = new Audio(AUDIO_SRC);
            audioRef.current.preload = "auto";
        };

        const stopAudio = () => {
            if (!audioRef.current) return;

            insideZoneRef.current = false;
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };

        const checkZone = (x: number, y: number) => {
            if (!armedRef.current || !audioRef.current) return;

            const dx = x - targetRef.current.x;
            const dy = y - targetRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const isInsideZone = distance <= hitRadiusRef.current;

            if (isInsideZone && !insideZoneRef.current) {
                insideZoneRef.current = true;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                    insideZoneRef.current = false;
                });
            }

            if (!isInsideZone && insideZoneRef.current) {
                stopAudio();
            }
        };

        const handlePointerDown = (event: PointerEvent) => {
            armAudio();
            checkZone(event.clientX, event.clientY);
        };

        const handlePointerMove = (event: PointerEvent) => {
            checkZone(event.clientX, event.clientY);
        };

        const handlePointerEnd = (event: PointerEvent) => {
            if (event.pointerType === "touch" || isMobileRef.current) {
                stopAudio();
            }
            };

        pickRandomSpot();

        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerEnd);
        window.addEventListener("pointercancel", handlePointerEnd);
        window.addEventListener("resize", pickRandomSpot);

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerEnd);
            window.removeEventListener("pointercancel", handlePointerEnd);
            window.removeEventListener("resize", pickRandomSpot);
            stopAudio();
        };
    }, []);

   if(!DEBUG_EASTER_EGG || !debugTarget) return null; // This component does not render anything

   return (
        <div
            style={{
                position: "fixed",
                left: debugTarget?.x ?? 0,
                top: debugTarget?.y ?? 0,
                width: debugRadius * 2,
                height: debugRadius * 2,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
            }}
        />
    );
}
