import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Table as TableIcon,
  Kanban,
  List as ListIcon,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  User
} from 'lucide-react';
import './DatabaseView.css';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Under Review', 'Done'];
const PRIORITY_OPTIONS = ['Urgent', 'High', 'Medium', 'Low'];

export const DatabaseView = ({ databaseId = 'db-roadmap' }) => {
  const {
    databases,
    updateDatabaseRow,
    addDatabaseRow,
    deleteDatabaseRow,
    setDatabaseActiveView
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const db = databases[databaseId] || databases['db-roadmap'];

  if (!db) return null;

  const activeView = db.activeView || 'table';

  // Filter rows based on search
  const filteredRows = db.rows.filter((row) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (row.cells['prop-title'] || '').toLowerCase();
    const assignee = (row.cells['prop-assignee'] || '').toLowerCase();
    const status = (row.cells['prop-status'] || '').toLowerCase();
    return title.includes(q) || assignee.includes(q) || status.includes(q);
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Done': return 'status-done';
      case 'In Progress': return 'status-inprogress';
      case 'Under Review': return 'status-underreview';
      default: return 'status-notstarted';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'priority-urgent';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  // Cycle to next status on click
  const handleCycleStatus = (rowId, currentStatus) => {
    const nextIdx = (STATUS_OPTIONS.indexOf(currentStatus) + 1) % STATUS_OPTIONS.length;
    updateDatabaseRow(db.id, rowId, { 'prop-status': STATUS_OPTIONS[nextIdx] });
  };

  // Cycle to next priority on click
  const handleCyclePriority = (rowId, currentPriority) => {
    const nextIdx = (PRIORITY_OPTIONS.indexOf(currentPriority) + 1) % PRIORITY_OPTIONS.length;
    updateDatabaseRow(db.id, rowId, { 'prop-priority': PRIORITY_OPTIONS[nextIdx] });
  };

  // ==================== TABLE VIEW ====================
  const renderTableView = () => (
    <div className="db-table-wrapper">
      <table className="db-table">
        <thead>
          <tr>
            <th style={{ minWidth: '240px' }}>Task / Feature</th>
            <th style={{ width: '130px' }}>Status</th>
            <th style={{ width: '100px' }}>Priority</th>
            <th style={{ width: '140px' }}>Assignee</th>
            <th style={{ width: '120px' }}>Target Date</th>
            <th style={{ width: '130px' }}>Domain</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  className="cell-input"
                  style={{ fontWeight: 500 }}
                  value={row.cells['prop-title'] || ''}
                  onChange={(e) => updateDatabaseRow(db.id, row.id, { 'prop-title': e.target.value })}
                />
              </td>
              <td>
                <span
                  className={`status-pill ${getStatusClass(row.cells['prop-status'])}`}
                  title="Click to cycle status"
                  onClick={() => handleCycleStatus(row.id, row.cells['prop-status'])}
                >
                  ● {row.cells['prop-status'] || 'Not Started'}
                </span>
              </td>
              <td>
                <span
                  className={`priority-pill ${getPriorityClass(row.cells['prop-priority'])}`}
                  title="Click to cycle priority"
                  onClick={() => handleCyclePriority(row.id, row.cells['prop-priority'])}
                >
                  {row.cells['prop-priority'] || 'Low'}
                </span>
              </td>
              <td>
                <input
                  type="text"
                  className="cell-input"
                  value={row.cells['prop-assignee'] || ''}
                  onChange={(e) => updateDatabaseRow(db.id, row.id, { 'prop-assignee': e.target.value })}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="cell-input"
                  value={row.cells['prop-date'] || ''}
                  onChange={(e) => updateDatabaseRow(db.id, row.id, { 'prop-date': e.target.value })}
                />
              </td>
              <td>
                <span className="badge badge-purple">
                  {row.cells['prop-tag'] || 'General'}
                </span>
              </td>
              <td>
                <button
                  className="header-btn"
                  title="Delete row"
                  onClick={() => deleteDatabaseRow(db.id, row.id)}
                  style={{ width: '22px', height: '22px' }}
                >
                  <Trash2 size={12} color="var(--text-muted)" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="board-add-card-btn"
        style={{ padding: '8px 14px', borderTop: '1px solid var(--border-subtle)', borderRadius: 0 }}
        onClick={() => addDatabaseRow(db.id)}
      >
        <Plus size={14} />
        <span>New Row</span>
      </button>
    </div>
  );

  // ==================== BOARD (KANBAN) VIEW ====================
  const renderBoardView = () => (
    <div className="db-board-wrapper">
      {STATUS_OPTIONS.map((status) => {
        const columnRows = filteredRows.filter((r) => (r.cells['prop-status'] || 'Not Started') === status);
        return (
          <div key={status} className="board-column">
            <div className="board-column-header">
              <span className={`status-pill ${getStatusClass(status)}`}>
                {status}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {columnRows.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {columnRows.map((card) => (
                <div key={card.id} className="board-card">
                  <div className="board-card-title">{card.cells['prop-title']}</div>
                  
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span className={`priority-pill ${getPriorityClass(card.cells['prop-priority'])}`}>
                      {card.cells['prop-priority']}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                      {card.cells['prop-tag']}
                    </span>
                  </div>

                  <div className="board-card-footer">
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={11} />
                      {card.cells['prop-assignee']}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {card.cells['prop-date']}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="board-add-card-btn"
              onClick={() => addDatabaseRow(db.id, { 'prop-status': status })}
            >
              <Plus size={13} />
              <span>Add card</span>
            </button>
          </div>
        );
      })}
    </div>
  );

  // ==================== LIST VIEW ====================
  const renderListView = () => (
    <div className="db-list-wrapper">
      {filteredRows.map((row) => (
        <div key={row.id} className="list-row">
          <div className="list-row-title">
            <span>📄</span>
            <span>{row.cells['prop-title']}</span>
          </div>
          <div className="list-row-meta">
            <span
              className={`status-pill ${getStatusClass(row.cells['prop-status'])}`}
              onClick={() => handleCycleStatus(row.id, row.cells['prop-status'])}
            >
              {row.cells['prop-status']}
            </span>
            <span className={`priority-pill ${getPriorityClass(row.cells['prop-priority'])}`}>
              {row.cells['prop-priority']}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {row.cells['prop-assignee']}
            </span>
            <button
              className="header-btn"
              onClick={() => deleteDatabaseRow(db.id, row.id)}
              style={{ width: '22px', height: '22px' }}
            >
              <Trash2 size={12} color="var(--text-muted)" />
            </button>
          </div>
        </div>
      ))}
      <button
        className="board-add-card-btn"
        style={{ marginTop: '8px' }}
        onClick={() => addDatabaseRow(db.id)}
      >
        <Plus size={14} />
        <span>New Item</span>
      </button>
    </div>
  );

  // ==================== GALLERY VIEW ====================
  const renderGalleryView = () => (
    <div className="db-gallery-wrapper">
      {filteredRows.map((card) => (
        <div key={card.id} className="gallery-card">
          <img
            src={card.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
            alt="cover"
            className="gallery-cover"
          />
          <div className="gallery-content">
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {card.cells['prop-title']}
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <span className={`status-pill ${getStatusClass(card.cells['prop-status'])}`}>
                {card.cells['prop-status']}
              </span>
              <span className={`priority-pill ${getPriorityClass(card.cells['prop-priority'])}`}>
                {card.cells['prop-priority']}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {card.cells['prop-assignee']} • {card.cells['prop-date']}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ==================== CALENDAR VIEW ====================
  const renderCalendarView = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="db-calendar-wrapper">
        <div className="calendar-grid">
          {days.map((d) => (
            <div key={d} className="calendar-day-header">{d}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
            const matchingRows = filteredRows.filter((r) => r.cells['prop-date'] === dateStr);

            return (
              <div key={i} className="calendar-cell">
                <span className="calendar-day-number">{dayNum}</span>
                {matchingRows.map((r) => (
                  <div key={r.id} className="calendar-event-pill" title={r.cells['prop-title']}>
                    {r.cells['prop-title']}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="database-container">
      {/* Top Bar: Tabs & Search */}
      <div className="database-header">
        <div className="view-tabs">
          <button
            className={`view-tab ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'table')}
          >
            <TableIcon size={14} />
            <span>Table</span>
          </button>
          <button
            className={`view-tab ${activeView === 'board' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'board')}
          >
            <Kanban size={14} />
            <span>Board</span>
          </button>
          <button
            className={`view-tab ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'list')}
          >
            <ListIcon size={14} />
            <span>List</span>
          </button>
          <button
            className={`view-tab ${activeView === 'gallery' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'gallery')}
          >
            <LayoutGrid size={14} />
            <span>Gallery</span>
          </button>
          <button
            className={`view-tab ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'calendar')}
          >
            <CalendarIcon size={14} />
            <span>Calendar</span>
          </button>
        </div>

        <div className="database-actions">
          <input
            type="text"
            className="db-search-input"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="db-new-btn"
            onClick={() => addDatabaseRow(db.id)}
          >
            <Plus size={13} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* View Content Renderer */}
      {activeView === 'table' && renderTableView()}
      {activeView === 'board' && renderBoardView()}
      {activeView === 'list' && renderListView()}
      {activeView === 'gallery' && renderGalleryView()}
      {activeView === 'calendar' && renderCalendarView()}
    </div>
  );
};
