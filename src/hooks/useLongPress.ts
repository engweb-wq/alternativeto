import React, { useCallback, useEffect, useRef, useState } from 'react';

interface UseLongPressOptions {
  delayMs?: number;
  moveThresholdPx?: number;
  onLongPress: () => void;
}

export function useLongPress({
  delayMs = 450,
  moveThresholdPx = 10,
  onLongPress,
}: UseLongPressOptions) {
  const [isPressing, setIsPressing] = useState(false);

  const callbackRef = useRef(onLongPress);
  callbackRef.current = onLongPress;

  const holdTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    startPointRef.current = null;
    setIsPressing(false);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      // Do not hijack clicks/holds on interactive buttons, inputs, or explicitly opted-out controls
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, select, [data-no-long-press="true"]')) {
        return;
      }

      clearTimers();
      longPressFiredRef.current = false;
      startPointRef.current = { x: e.clientX, y: e.clientY };

      feedbackTimerRef.current = window.setTimeout(() => {
        setIsPressing(true);
      }, 120);

      holdTimerRef.current = window.setTimeout(() => {
        longPressFiredRef.current = true;
        setIsPressing(false);
        startPointRef.current = null;

        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          try {
            navigator.vibrate(16);
          } catch {
            // Ignore vibration failures on restricted devices
          }
        }

        callbackRef.current();
      }, delayMs);
    },
    [clearTimers, delayMs]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!startPointRef.current) return;
      const dx = Math.abs(e.clientX - startPointRef.current.x);
      const dy = Math.abs(e.clientY - startPointRef.current.y);
      if (dx > moveThresholdPx || dy > moveThresholdPx) {
        clearTimers();
      }
    },
    [clearTimers, moveThresholdPx]
  );

  const onPointerUp = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const onPointerLeave = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const onPointerCancel = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const onClickCapture = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (longPressFiredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressFiredRef.current = false;
    }
  }, []);

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isPressing || longPressFiredRef.current) {
        e.preventDefault();
      }
    },
    [isPressing]
  );

  return {
    isPressing,
    longPressProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onClickCapture,
      onContextMenu,
    },
  };
}
