"use client";

import { useRef, type MouseEvent, type TouchEvent } from "react";

export function useTouchScrollGuard() {
  const gestureRef = useRef({
    touchId: -1,
    startX: 0,
    startY: 0,
    startScrollTop: 0,
    moved: false,
    suppressClick: false,
  });

  const onTouchStartCapture = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    gestureRef.current = {
      touchId: touch.identifier,
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollTop: event.currentTarget.scrollTop,
      moved: false,
      suppressClick: false,
    };
  };

  const onTouchMoveCapture = (event: TouchEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    const touch = Array.from(event.touches).find((item) => item.identifier === gesture.touchId);
    if (!touch || gesture.moved) return;
    if (
      Math.hypot(touch.clientX - gesture.startX, touch.clientY - gesture.startY) > 6
      || Math.abs(event.currentTarget.scrollTop - gesture.startScrollTop) > 1
    ) {
      gesture.moved = true;
    }
  };

  const onTouchEndCapture = (event: TouchEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === gesture.touchId);
    if (!touch) return;
    gesture.suppressClick = gesture.moved
      || Math.hypot(touch.clientX - gesture.startX, touch.clientY - gesture.startY) > 6
      || Math.abs(event.currentTarget.scrollTop - gesture.startScrollTop) > 1;
    gesture.touchId = -1;
  };

  const onTouchCancelCapture = () => {
    gestureRef.current.touchId = -1;
    gestureRef.current.suppressClick = true;
  };

  const onScrollCapture = () => {
    if (gestureRef.current.touchId !== -1) gestureRef.current.moved = true;
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.suppressClick) return;
    gesture.suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    onTouchStartCapture,
    onTouchMoveCapture,
    onTouchEndCapture,
    onTouchCancelCapture,
    onScrollCapture,
    onClickCapture,
  };
}
