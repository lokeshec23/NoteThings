import React from 'react';
import { X, Calendar, User, Tag, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Under Review', 'Done'];
const PRIORITY_OPTIONS = ['Urgent', 'High', 'Medium', 'Low'];

export const RowDetailModal = ({ row, dbId, onClose, onUpdate, onDelete }) => {
  if (!row) return null;

  const cells = row.cells || {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container animate-scale-in"
        style={{ maxWidth: '640px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📄</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Database Item Details</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="header-btn"
              title="Delete this row"
              onClick={() => {
                onDelete(dbId, row.id);
                onClose();
              }}
              style={{ color: 'var(--accent-red)' }}
            >
              <Trash2 size={14} />
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Item Title */}
        <input
          type="text"
          className="page-title-input"
          style={{ fontSize: '24px', marginBottom: '20px' }}
          value={cells['prop-title'] || ''}
          placeholder="Untitled Task"
          onChange={(e) => onUpdate(dbId, row.id, { 'prop-title': e.target.value })}
        />

        {/* Properties Grid */}
        <div className="detail-properties-grid">
          {/* Status */}
          <div className="detail-property-row">
            <div className="detail-prop-label">
              <CheckCircle2 size={13} color="var(--accent-blue)" />
              <span>Status</span>
            </div>
            <div className="detail-prop-val">
              <select
                className="detail-select"
                value={cells['prop-status'] || 'Not Started'}
                onChange={(e) => onUpdate(dbId, row.id, { 'prop-status': e.target.value })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div className="detail-property-row">
            <div className="detail-prop-label">
              <AlertCircle size={13} color="var(--accent-orange)" />
              <span>Priority</span>
            </div>
            <div className="detail-prop-val">
              <select
                className="detail-select"
                value={cells['prop-priority'] || 'Medium'}
                onChange={(e) => onUpdate(dbId, row.id, { 'prop-priority': e.target.value })}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div className="detail-property-row">
            <div className="detail-prop-label">
              <User size={13} color="var(--accent-purple)" />
              <span>Assignee</span>
            </div>
            <div className="detail-prop-val">
              <input
                type="text"
                className="cell-input"
                style={{ padding: '4px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}
                value={cells['prop-assignee'] || ''}
                placeholder="Unassigned"
                onChange={(e) => onUpdate(dbId, row.id, { 'prop-assignee': e.target.value })}
              />
            </div>
          </div>

          {/* Target Date */}
          <div className="detail-property-row">
            <div className="detail-prop-label">
              <Calendar size={13} color="var(--accent-green)" />
              <span>Target Date</span>
            </div>
            <div className="detail-prop-val">
              <input
                type="date"
                className="cell-input"
                style={{ padding: '4px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}
                value={cells['prop-date'] || ''}
                onChange={(e) => onUpdate(dbId, row.id, { 'prop-date': e.target.value })}
              />
            </div>
          </div>

          {/* Domain / Tag */}
          <div className="detail-property-row">
            <div className="detail-prop-label">
              <Tag size={13} color="var(--accent-yellow)" />
              <span>Domain / Tag</span>
            </div>
            <div className="detail-prop-val">
              <input
                type="text"
                className="cell-input"
                style={{ padding: '4px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}
                value={cells['prop-tag'] || ''}
                placeholder="e.g. Core Engine, Mobile, Cloud"
                onChange={(e) => onUpdate(dbId, row.id, { 'prop-tag': e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '20px 0' }} />

        {/* Notes & Description */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Notes & Comments
          </div>
          <textarea
            rows={4}
            className="block-input"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              lineHeight: 1.5,
              backgroundColor: 'var(--bg-secondary)'
            }}
            placeholder="Add detailed specifications, links, or notes for this item..."
            value={cells['prop-notes'] || ''}
            onChange={(e) => onUpdate(dbId, row.id, { 'prop-notes': e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
