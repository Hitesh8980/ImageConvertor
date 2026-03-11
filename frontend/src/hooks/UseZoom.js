import { useState, useCallback } from 'react';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const STEP = 0.25;

export const useZoom = (initial = 1) => {
  const [zoom, setZoom] = useState(initial);

  const zoomIn  = useCallback(() => setZoom(z => Math.min(z + STEP, MAX_ZOOM)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - STEP, MIN_ZOOM)), []);
  const reset   = useCallback(() => setZoom(1), []);

  return { zoom, setZoom, zoomIn, zoomOut, reset, MIN_ZOOM, MAX_ZOOM };
};