import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Search, X, FileText, ChevronRight, Clock } from 'lucide-react';

export const SearchModal = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    pages,
    selectPage
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const alivePages = pages.filter((p) => !p.inTrash);

  const filteredPages = query.trim()
    ? alivePages.filter((page) => {
        const q = query.toLowerCase();
        const titleMatch = page.title.toLowerCase().includes(q);
        const blockMatch = page.blocks.some((b) => (b.content || '').toLowerCase().includes(q));
        return titleMatch || blockMatch;
      })
    : alivePages;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredPages.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPages.length) % (filteredPages.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPages[selectedIndex]) {
        selectPage(filteredPages[selectedIndex].id);
        setSearchModalOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchModalOpen(false);
    }
  };

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        className="search-modal-card animate-popover"
        style={{
          width: '560px',
          maxWidth: '92vw',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-floating)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, notes, or database items... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              fontSize: '15px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)'
            }}
          />
          <button className="header-btn" onClick={() => setSearchModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase' }}>
            {query.trim() ? 'Matching Results' : 'Recent Pages'}
          </div>

          {filteredPages.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No results found for "{query}"
            </div>
          ) : (
            filteredPages.map((page, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={page.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onClick={() => {
                    selectPage(page.id);
                    setSearchModalOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span style={{ fontSize: '18px' }}>{page.icon || '📄'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {page.title || 'Untitled'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} />
                      <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
