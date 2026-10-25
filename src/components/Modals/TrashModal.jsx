import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Trash2, RotateCcw } from 'lucide-react';

export const TrashModal = () => {
  const {
    trashModalOpen,
    setTrashModalOpen,
    pages,
    restorePage,
    permanentlyDeletePage
  } = useWorkspace();

  if (!trashModalOpen) return null;

  const trashPages = pages.filter((p) => p.inTrash);

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
      onClick={() => setTrashModalOpen(false)}
    >
      <div
        className="animate-popover"
        style={{
          width: '500px',
          maxWidth: '92vw',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-floating)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} color="var(--accent-red)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Trash ({trashPages.length})</span>
          </div>
          <button className="header-btn" onClick={() => setTrashModalOpen(false)}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '10px 14px', maxHeight: '360px', overflowY: 'auto' }}>
          {trashPages.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Trash is empty.
            </div>
          ) : (
            trashPages.map((page) => (
              <div
                key={page.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{page.icon || '📄'}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{page.title || 'Untitled'}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="sidebar-action-item"
                    style={{ fontSize: '11px', padding: '3px 8px', width: 'auto' }}
                    onClick={() => restorePage(page.id)}
                    title="Restore page"
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                  <button
                    className="sidebar-action-item"
                    style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--accent-red)', width: 'auto' }}
                    onClick={() => permanentlyDeletePage(page.id)}
                    title="Delete permanently"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
