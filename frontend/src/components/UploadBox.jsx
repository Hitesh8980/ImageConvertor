import { useState, useRef, useCallback } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const UploadBox = ({ onUpload, uploadedFile, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  const [inputKey,   setInputKey]   = useState(0);
  const inputRef = useRef(null);

  const simulateProgress = (onDone) => {
    setIsLoading(true);
    setProgress(0);
    let p = 0;
    const tick = setInterval(() => {
      p += p < 60 ? 12 : p < 85 ? 5 : 2;
      if (p >= 100) {
        clearInterval(tick);
        setProgress(100);
        setTimeout(() => { setIsLoading(false); onDone(); }, 300);
      } else {
        setProgress(Math.min(p, 99));
      }
    }, 60);
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setError(null);
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large — max 10MB (yours: ${(file.size / (1024*1024)).toFixed(1)}MB).`);
      return;
    }
    if (uploadedFile?.url) URL.revokeObjectURL(uploadedFile.url);
    const url = URL.createObjectURL(file);
    simulateProgress(() => {
      onUpload({ file, url, name: file.name, size: file.size });
      setInputKey(k => k + 1);
    });
  }, [onUpload, uploadedFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  };

  const openPicker = () => inputRef.current?.click();

  const handleRemove = () => {
    if (uploadedFile?.url) URL.revokeObjectURL(uploadedFile.url);
    setError(null);
    setProgress(0);
    setInputKey(k => k + 1);
    onRemove();
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-section">
      <div className="section-label">
        <span className="label-dot"></span>
        DIAGRAM INPUT
      </div>

      {/* Hidden input — completely outside everything */}
      <input
        key={inputKey}
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
        style={{ display: 'none' }}
      />

      {/* CASE 1 — No file: show the drop zone */}
      {!uploadedFile && !isLoading && (
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={openPicker}
        >
          {isDragging && (
            <div className="drag-overlay">
              <div className="drag-overlay-inner">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Drop to upload</span>
              </div>
            </div>
          )}
          <div className="upload-idle">
            <div className="upload-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="upload-primary">Drop diagram here</p>
            <p className="upload-secondary">or <span className="upload-link">browse files</span> — PNG, JPG, WebP</p>
            <p className="upload-limit">Max file size: 10MB</p>
          </div>
        </div>
      )}

      {/* CASE 2 — Loading: show progress bar */}
      {isLoading && (
        <div className="upload-zone" style={{ cursor: 'default' }}>
          <div className="upload-loading">
            <div className="loading-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </div>
            <div className="loading-text">Processing image…</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <div className="progress-glow" style={{ left: `${progress}%` }} />
            </div>
            <div className="progress-pct">{progress}%</div>
          </div>
        </div>
      )}

      {/* CASE 3 — File uploaded: preview + buttons, zone has NO onClick, NO drag handlers */}
      {uploadedFile && !isLoading && (
        <div className="upload-zone has-file" style={{ cursor: 'default' }}>
          {isDragging && (
            <div
              className="drag-overlay"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <div className="drag-overlay-inner">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Drop to replace</span>
              </div>
            </div>
          )}

          <img src={uploadedFile.url} alt="Preview" className="preview-thumb" />

          <div className="file-meta">
            <div className="file-name">{uploadedFile.name}</div>
            <div className="file-size">{formatSize(uploadedFile.size)}</div>
            <div className="file-status">
              <span className="status-dot"></span>
              Ready to analyze
            </div>
          </div>

          {/* Plain onClick works perfectly — parent zone has no click/drag handlers */}
          <div className="file-actions">
            <button type="button" className="replace-btn" onClick={openPicker}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6"/>
                <path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Replace
            </button>
            <button type="button" className="remove-btn" onClick={handleRemove}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Inline error banner */}
      {error && (
        <div className="error-banner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
          <button className="error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default UploadBox;