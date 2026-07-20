"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

export function useTouchScrollGuard() {
  const gestureRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    moved: false,
    suppressClick: false,
  });

  const onPointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      suppressClick: false,
    };
  };

  const onPointerMoveCapture = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (event.pointerType !== "touch" || event.pointerId !== gesture.pointerId || gesture.moved) return;
    if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 6) {
      gesture.moved = true;
    }
  };

  const finishTouch = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (event.pointerType !== "touch" || event.pointerId !== gesture.pointerId) return;
    gesture.suppressClick = gesture.moved;
    gesture.pointerId = -1;
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.suppressClick) return;
    gesture.suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    onPointerDownCapture,
    onPointerMoveCapture,
    onPointerUpCapture: finishTouch,
    onPointerCancelCapture: finishTouch,
    onClickCapture,
  };
}
