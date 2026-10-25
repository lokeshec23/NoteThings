import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TEMPLATES } from '../../data/initialData';
import { X, LayoutTemplate, Plus } from 'lucide-react';

export const TemplatesModal = () => {
  const { templatesModalOpen, setTemplatesModalOpen, applyTemplate } = useWorkspace();

  if (!templatesModalOpen) return null;

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => setTemplatesModalOpen(false)}
    >
      <div
        className="animate-popover"
        style={{
          width: '640px',
          maxWidth: '92vw',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-floating)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutTemplate size={18} color="var(--accent-purple)" />
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Workspace Templates Gallery</span>
          </div>
          <button className="header-btn" onClick={() => setTemplatesModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{tmpl.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{tmpl.title}</span>
                    <span className="badge badge-blue">{tmpl.category}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {tmpl.description}
                  </div>
                </div>
              </div>

              <button
                className="db-new-btn"
                style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}
                onClick={() => applyTemplate(tmpl.id)}
              >
                <Plus size={13} />
                <span>Use Template</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
