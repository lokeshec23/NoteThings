import React from 'react';
import { PRESET_ICONS } from '../../data/initialData';
import { X, Shuffle } from 'lucide-react';

export const IconPicker = ({ onSelect, onClose, onRandomize }) => {
  return (
    <div
      className="dropdown-menu animate-popover"
      style={{
        position: 'absolute',
        top: '60px',
        left: '0px',
        width: 'min(280px, calc(100vw - 24px))',
        maxWidth: 'calc(100vw - 24px)',
        backgroundColor: 'var(--bg-floating)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-floating)',
        padding: '12px',
        zIndex: 500
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Select Icon</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onRandomize}
            title="Random icon"
            style={{ color: 'var(--text-muted)', padding: '2px 4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <Shuffle size={12} />
          </button>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
        {PRESET_ICONS.map((icon, idx) => (
          <button
            key={idx}
            style={{
              fontSize: '20px',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="header-btn"
            onClick={() => {
              onSelect(icon);
              onClose();
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};
