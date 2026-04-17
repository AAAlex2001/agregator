interface WheelDeltaParams {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  containerWidth: number;
}

export function hasReachedHorizontalEnd(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
  threshold = 120,
): boolean {
  return scrollLeft + clientWidth >= scrollWidth - threshold;
}

export function getNormalizedWheelDelta({
  deltaX,
  deltaY,
  deltaMode,
  containerWidth,
}: WheelDeltaParams): number {
  const pixelMultiplier = 1.25;
  const lineHeight = 40;

  let delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;

  if (deltaMode === 1) {
    delta *= lineHeight;
  } else if (deltaMode === 2) {
    delta *= containerWidth;
  }

  return delta * pixelMultiplier;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}