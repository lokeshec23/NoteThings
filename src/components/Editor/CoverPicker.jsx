import React from 'react';
import { PRESET_COVERS } from '../../data/initialData';
import { X } from 'lucide-react';

export const CoverPicker = ({ onSelect, onClose, currentCover }) => {
  return (
    <div
      className="dropdown-menu animate-popover"
      style={{
        position: 'absolute',
        top: '60px',
        right: '12px',
        width: 'min(320px, calc(100vw - 24px))',
        maxWidth: 'calc(100vw - 24px)',
        backgroundColor: 'var(--bg-floating)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-floating)',
        padding: '12px',
        zIndex: 500
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Choose Cover</span>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
        {PRESET_COVERS.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="cover preset"
            style={{
              width: '100%',
              height: '48px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              border: currentCover === url ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)'
            }}
            onClick={() => {
              onSelect(url);
              onClose();
            }}
          />
        ))}
      </div>

      {currentCover && (
        <button
          className="sidebar-action-item"
          style={{ marginTop: '10px', color: 'var(--accent-red)', fontSize: '12px' }}
          onClick={() => {
            onSelect(null);
            onClose();
          }}
        >
          Remove cover
        </button>
      )}
    </div>
  );
};
