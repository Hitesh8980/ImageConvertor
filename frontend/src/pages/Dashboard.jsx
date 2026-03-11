import { useState, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import DiagramViewer from '../components/DiagramViewer';
import ComponentList from '../components/ComponentList';
import { fetchComponents } from '../services/api';

const Dashboard = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    fetchComponents().then(data => {
      setComponents(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = (fileData) => {
    setUploadedFile(fileData);
    setSelectedComponent(null);
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setSelectedComponent(null);
  };

  return (
    <div className="dashboard">
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="orb orb-1" aria-hidden="true"></div>
      <div className="orb orb-2" aria-hidden="true"></div>

      <header className="dash-header">
        <div className="header-logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span className="logo-text">Circuit<span className="logo-accent">Lens</span></span>
        </div>

        <div className="header-status">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>System Online</span>
          </div>
          {uploadedFile && (
            <div className="file-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {uploadedFile.name}
            </div>
          )}
        </div>

        <div className="header-meta">
          <span className="meta-item">v1.0.0</span>
          <span className="meta-sep">·</span>
          <span className="meta-item">{components.length} components</span>
        </div>
      </header>

      <main className="dash-main">
        <section className="upload-row">
          <UploadBox
            onUpload={handleUpload}
            uploadedFile={uploadedFile}
            onRemove={handleRemove}
          />
        </section>

        <section className="content-row">
          <DiagramViewer
            uploadedFile={uploadedFile}
            selectedComponent={selectedComponent}
          />
          <ComponentList
            components={components}
            loading={loading}
            selectedId={selectedComponent?.id}
            onSelect={setSelectedComponent}
          />
        </section>
      </main>

      <footer className="dash-footer">
        <span>CircuitLens Dashboard</span>
        <span className="footer-sep">·</span>
        <span>Built with React + Tailwind</span>
      </footer>
    </div>
  );
};

export default Dashboard;