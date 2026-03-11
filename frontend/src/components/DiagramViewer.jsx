import { useRef, useState,  useEffect } from 'react';
import { useZoom } from '../hooks/UseZoom';

const DiagramViewer = ({ uploadedFile, selectedComponent }) => {
  const { zoom, setZoom, zoomIn, zoomOut, reset, MIN_ZOOM, MAX_ZOOM } = useZoom(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef(null);
  const containerRef = useRef(null);

  // Attach wheel with passive:false so preventDefault actually blocks page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (!uploadedFile) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.min(Math.max(parseFloat((z + delta).toFixed(2)), MIN_ZOOM), MAX_ZOOM));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [uploadedFile, setZoom, MIN_ZOOM, MAX_ZOOM]);

  const handleMouseDown = (e) => {
    if (!uploadedFile) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !panStart.current) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const handleReset = () => { reset(); setPan({ x: 0, y: 0 }); };

  return (
    <div className="viewer-panel">
      <div className="panel-header">
        <span className="section-label">
          <span className="label-dot"></span>
          DIAGRAM VIEWER
        </span>
        {uploadedFile && (
          <div className="zoom-indicator">
            <div className="zoom-bar-track">
              <div
                className="zoom-bar-fill"
                style={{ width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%` }}
              />
            </div>
            <span className="zoom-pct">{Math.round(zoom * 100)}%</span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className={`viewer-canvas ${isPanning ? 'panning' : ''} ${!uploadedFile ? 'empty' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
      >
        {!uploadedFile ? (
          <div className="viewer-empty">
            <div className="empty-text">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Upload a diagram to begin</p>
            </div>
          </div>
        ) : (
          <div
            className="diagram-image-wrap"
            style={{
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
              transition: isPanning ? 'none' : 'transform 0.12s ease',
            }}
          >
            <img src={uploadedFile.url} alt="Diagram" className="diagram-image" draggable={false} />
            {selectedComponent && (
              <div className="component-overlay">
                <div className="overlay-badge">
                  <span className="overlay-symbol">{selectedComponent.symbol}</span>
                  <span className="overlay-name">{selectedComponent.name}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="zoom-controls">
        <button className="zoom-btn" onClick={zoomOut} disabled={!uploadedFile || zoom <= MIN_ZOOM} title="Zoom Out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <button className="zoom-btn reset-btn" onClick={handleReset} disabled={!uploadedFile} title="Reset View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset
        </button>
        <button className="zoom-btn" onClick={zoomIn} disabled={!uploadedFile || zoom >= MAX_ZOOM} title="Zoom In">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DiagramViewer;