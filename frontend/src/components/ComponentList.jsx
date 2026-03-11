import { useState } from 'react';

const ComponentList = ({ components, loading, selectedId, onSelect }) => {
  const [search, setSearch] = useState('');

  const filtered = components.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="component-panel">
      <div className="panel-header">
        <span className="section-label">
          <span className="label-dot" style={{ '--dot-color': '#a78bfa' }}></span>
          COMPONENTS
        </span>
        <span className="component-count">{components.length} detected</span>
      </div>

      <div className="search-wrap">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Filter components..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      <div className="component-list-scroll">
        {loading ? (
          <div className="list-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="skeleton-sym"></div>
                <div className="skeleton-text">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="list-empty">
            <p>No components match "{search}"</p>
          </div>
        ) : (
          <ul className="component-list">
            {filtered.map((comp, i) => (
              <li
                key={comp.id}
                className={`component-item ${selectedId === comp.id ? 'selected' : ''}`}
                onClick={() => onSelect(selectedId === comp.id ? null : comp)}
                style={{ animationDelay: `${i * 0.05}s`, '--item-color': comp.color }}
              >
                <div className="comp-symbol" style={{ borderColor: comp.color, color: comp.color }}>
                  {comp.symbol}
                </div>
                <div className="comp-info">
                  <div className="comp-name">{comp.name}</div>
                  <div className="comp-desc">{comp.description}</div>
                </div>
                <div className="comp-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
                {selectedId === comp.id && (
                  <div className="selected-bar" style={{ backgroundColor: comp.color }}></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedId && (
        <div className="selection-footer">
          <div className="footer-dot" style={{ backgroundColor: components.find(c => c.id === selectedId)?.color }}></div>
          <span>{components.find(c => c.id === selectedId)?.name} selected</span>
          <button className="clear-selection" onClick={() => onSelect(null)}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default ComponentList;