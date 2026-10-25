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
  User,
  Filter,
  ArrowUpDown,
  Maximize2,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Hash,
  Tag,
  CheckCircle2,
  CheckSquare,
  Link as LinkIcon,
  Type,
  FileText
} from 'lucide-react';
import { RowDetailModal } from './RowDetailModal';
import { ViewSettingsDrawer } from './ViewSettingsDrawer';
import { AddPropertyPopover } from './AddPropertyPopover';
import { ColumnHeaderMenu } from './ColumnHeaderMenu';
import { CalculateMenu } from './CalculateMenu';
import './DatabaseView.css';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Under Review', 'Done'];
const PRIORITY_OPTIONS = ['Urgent', 'High', 'Medium', 'Low'];

export const DatabaseView = ({ databaseId = 'db-roadmap' }) => {
  const {
    databases,
    updateDatabaseRow,
    addDatabaseRow,
    deleteDatabaseRow,
    setDatabaseActiveView,
    addDatabaseProperty,
    updateDatabaseProperty,
    deleteDatabaseProperty,
    togglePropertyVisibility
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedRow, setSelectedRow] = useState(null);

  // Notion Drawer & Popovers State
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [activeColumnMenu, setActiveColumnMenu] = useState(null); // property object
  const [activeCalcMenu, setActiveCalcMenu] = useState(null); // { propId }
  const [columnCalculations, setColumnCalculations] = useState({
    'prop-title': 'count_all',
    'prop-status': 'count_values',
    'prop-priority': 'count_unique'
  });
  const [splitNewOpen, setSplitNewOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set(['row-1', 'row-2', 'row-3']));

  const db = databases[databaseId] || databases['db-roadmap'];

  if (!db) return null;

  const activeView = db.activeView || 'table';
  const properties = db.properties || [
    { id: 'prop-title', name: 'Task / Feature', type: 'title' },
    { id: 'prop-status', name: 'Status', type: 'status' },
    { id: 'prop-priority', name: 'Priority', type: 'select' },
    { id: 'prop-assignee', name: 'Assignee', type: 'text' },
    { id: 'prop-date', name: 'Target Date', type: 'date' },
    { id: 'prop-tag', name: 'Domain', type: 'select' }
  ];

  const hiddenProps = new Set(db.hiddenProperties || []);
  const visibleProperties = properties.filter((p) => !hiddenProps.has(p.id));

  // Filter rows based on search, status filter, and priority filter
  let processedRows = (db.rows || []).filter((row) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = Object.values(row.cells || {}).some((v) =>
        String(v || '').toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    if (statusFilter !== 'All') {
      if ((row.cells['prop-status'] || 'Not Started') !== statusFilter) return false;
    }
    if (priorityFilter !== 'All') {
      if ((row.cells['prop-priority'] || 'Low') !== priorityFilter) return false;
    }
    return true;
  });

  // Sort rows
  if (sortOrder === 'title-asc') {
    processedRows.sort((a, b) => (a.cells['prop-title'] || '').localeCompare(b.cells['prop-title'] || ''));
  } else if (sortOrder === 'title-desc') {
    processedRows.sort((a, b) => (b.cells['prop-title'] || '').localeCompare(a.cells['prop-title'] || ''));
  } else if (sortOrder === 'date-asc') {
    processedRows.sort((a, b) => (a.cells['prop-date'] || '').localeCompare(b.cells['prop-date'] || ''));
  } else if (sortOrder === 'date-desc') {
    processedRows.sort((a, b) => (b.cells['prop-date'] || '').localeCompare(a.cells['prop-date'] || ''));
  }

  // Build hierarchical row display list (Notion sub-item architecture)
  const hierarchicalRows = [];
  const topLevelRows = processedRows.filter((r) => !r.parentId);
  topLevelRows.forEach((parent) => {
    const subitems = processedRows.filter((r) => r.parentId === parent.id);
    hierarchicalRows.push({ ...parent, hasSubitems: subitems.length > 0, subitemCount: subitems.length, isChild: false });
    if (expandedRows.has(parent.id)) {
      subitems.forEach((child) => {
        hierarchicalRows.push({ ...child, hasSubitems: false, isChild: true });
      });
    }
  });
  processedRows.forEach((r) => {
    if (r.parentId && !hierarchicalRows.some((hr) => hr.id === r.id)) {
      hierarchicalRows.push({ ...r, hasSubitems: false, isChild: true });
    }
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

  const handleCycleStatus = (rowId, currentStatus) => {
    const nextIdx = (STATUS_OPTIONS.indexOf(currentStatus) + 1) % STATUS_OPTIONS.length;
    updateDatabaseRow(db.id, rowId, { 'prop-status': STATUS_OPTIONS[nextIdx] });
  };

  const handleCyclePriority = (rowId, currentPriority) => {
    const nextIdx = (PRIORITY_OPTIONS.indexOf(currentPriority) + 1) % PRIORITY_OPTIONS.length;
    updateDatabaseRow(db.id, rowId, { 'prop-priority': PRIORITY_OPTIONS[nextIdx] });
  };

  // Property Icon Helper
  const getPropertyIcon = (type) => {
    switch (type) {
      case 'title': return <span className="prop-icon-aa">Aa</span>;
      case 'text': return <Type size={12} />;
      case 'status': return <CheckCircle2 size={12} color="var(--accent-blue)" />;
      case 'select': return <ChevronDown size={12} />;
      case 'multi-select': return <Tag size={12} color="var(--accent-purple)" />;
      case 'date': return <span style={{ fontSize: '11px' }}>📅</span>;
      case 'person': return <User size={12} />;
      case 'number': return <Hash size={12} />;
      case 'checkbox': return <CheckSquare size={12} />;
      case 'url': return <LinkIcon size={12} />;
      default: return <FileText size={12} />;
    }
  };

  // Calculate Column Output
  const computeColumnCalculation = (prop) => {
    const calcType = columnCalculations[prop.id];
    if (!calcType || calcType === 'none') return 'Calculate';

    const values = processedRows.map((r) => r.cells[prop.id]).filter(Boolean);
    const total = processedRows.length;

    switch (calcType) {
      case 'count_all':
        return `Count ${total}`;
      case 'count_values':
        return `Values ${values.length}`;
      case 'count_unique': {
        const unique = new Set(values).size;
        return `Unique ${unique}`;
      }
      case 'count_empty':
        return `Empty ${total - values.length}`;
      case 'percent_empty': {
        const pct = total > 0 ? Math.round(((total - values.length) / total) * 100) : 0;
        return `${pct}% empty`;
      }
      case 'sum': {
        const sum = values.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        return `Sum ${sum}`;
      }
      case 'average': {
        const sum = values.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        const avg = values.length > 0 ? (sum / values.length).toFixed(1) : 0;
        return `Avg ${avg}`;
      }
      default:
        return 'Calculate';
    }
  };

  // ==================== TABLE VIEW (NOTION SPEC) ====================
  const renderTableView = () => (
    <div className="db-table-wrapper">
      <table className="db-table">
        <thead>
          <tr>
            {visibleProperties.map((prop) => (
              <th
                key={prop.id}
                className="db-th-clickable"
                onClick={() => setActiveColumnMenu(prop)}
                style={{
                  minWidth: prop.type === 'title' ? '240px' : '140px',
                  width: prop.type === 'title' ? '280px' : 'auto'
                }}
              >
                <div className="th-content-row">
                  {getPropertyIcon(prop.type)}
                  <span>{prop.name}</span>
                </div>
              </th>
            ))}

            {/* + Add property Header Button */}
            <th className="th-add-property">
              <button
                className="th-add-prop-btn"
                onClick={() => setAddPropertyOpen(true)}
                title="Add a new property"
              >
                <Plus size={13} />
                <span>Add property</span>
              </button>
            </th>

            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {hierarchicalRows.map((row) => (
            <tr key={row.id} className={`db-table-row ${row.isChild ? 'db-subitem-row' : ''}`}>
              {visibleProperties.map((prop) => {
                const cellVal = row.cells[prop.id];

                if (prop.type === 'title') {
                  return (
                    <td key={prop.id} className="td-title-cell">
                      <div className="title-cell-wrapper" style={{ paddingLeft: row.isChild ? '24px' : '6px' }}>
                        {row.isChild && (
                          <CornerDownRight size={11} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '4px' }} />
                        )}
                        {row.hasSubitems ? (
                          <button
                            className="row-subitem-toggle-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRows((prev) => {
                                const next = new Set(prev);
                                if (next.has(row.id)) next.delete(row.id);
                                else next.add(row.id);
                                return next;
                              });
                            }}
                            title={expandedRows.has(row.id) ? 'Collapse sub-items' : 'Expand sub-items'}
                          >
                            <ChevronRight size={11} className={expandedRows.has(row.id) ? 'rotate-90' : ''} />
                          </button>
                        ) : !row.isChild ? (
                          <div style={{ width: '16px', flexShrink: 0 }} />
                        ) : null}

                        <input
                          type="text"
                          className="cell-input title-input"
                          value={cellVal || ''}
                          onChange={(e) =>
                            updateDatabaseRow(db.id, row.id, { [prop.id]: e.target.value })
                          }
                          placeholder="Untitled"
                        />

                        {/* Actions on hover: + Sub-item & OPEN peek */}
                        <div className="row-hover-actions">
                          {!row.isChild && (
                            <button
                              className="row-add-subitem-btn"
                              onClick={() => {
                                addDatabaseRow(db.id, { 'prop-title': 'Sub-task' }, row.id);
                                setExpandedRows((prev) => new Set(prev).add(row.id));
                              }}
                              title="Add sub-task"
                            >
                              <Plus size={9} />
                              <span>Sub-item</span>
                            </button>
                          )}

                          <button
                            className="row-open-peek-btn"
                            onClick={() => setSelectedRow(row)}
                            title="Open item page preview"
                          >
                            <Maximize2 size={10} />
                            <span>OPEN</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                }

                if (prop.type === 'status') {
                  return (
                    <td key={prop.id}>
                      <span
                        className={`status-pill ${getStatusClass(cellVal)}`}
                        title="Click to cycle status"
                        onClick={() => handleCycleStatus(row.id, cellVal)}
                      >
                        ● {cellVal || 'Not Started'}
                      </span>
                    </td>
                  );
                }

                if (prop.type === 'select' && prop.id === 'prop-priority') {
                  return (
                    <td key={prop.id}>
                      <span
                        className={`priority-pill ${getPriorityClass(cellVal)}`}
                        title="Click to cycle priority"
                        onClick={() => handleCyclePriority(row.id, cellVal)}
                      >
                        {cellVal || 'Low'}
                      </span>
                    </td>
                  );
                }

                if (prop.type === 'date') {
                  return (
                    <td key={prop.id}>
                      <input
                        type="date"
                        className="cell-input"
                        value={cellVal || ''}
                        onChange={(e) =>
                          updateDatabaseRow(db.id, row.id, { [prop.id]: e.target.value })
                        }
                      />
                    </td>
                  );
                }

                if (prop.type === 'checkbox') {
                  return (
                    <td key={prop.id}>
                      <input
                        type="checkbox"
                        checked={!!cellVal}
                        onChange={(e) =>
                          updateDatabaseRow(db.id, row.id, { [prop.id]: e.target.checked })
                        }
                      />
                    </td>
                  );
                }

                if (prop.type === 'number') {
                  return (
                    <td key={prop.id}>
                      <input
                        type="number"
                        className="cell-input"
                        value={cellVal || ''}
                        onChange={(e) =>
                          updateDatabaseRow(db.id, row.id, { [prop.id]: e.target.value })
                        }
                        placeholder="0"
                      />
                    </td>
                  );
                }

                // Default text / select
                return (
                  <td key={prop.id}>
                    <input
                      type="text"
                      className="cell-input"
                      value={cellVal || ''}
                      onChange={(e) =>
                        updateDatabaseRow(db.id, row.id, { [prop.id]: e.target.value })
                      }
                      placeholder="Empty"
                    />
                  </td>
                );
              })}

              <td className="td-empty-prop-space"></td>

              <td>
                <button
                  className="header-btn row-trash-btn"
                  title="Delete row"
                  onClick={() => deleteDatabaseRow(db.id, row.id)}
                >
                  <Trash2 size={12} />
                </button>
              </td>
            </tr>
          ))}

          {/* Notion Bottom '+ New page' Row */}
          <tr className="db-new-page-inline-row" onClick={() => addDatabaseRow(db.id)}>
            <td colSpan={visibleProperties.length + 2}>
              <div className="new-page-inline-content">
                <Plus size={13} color="var(--text-muted)" />
                <span>New page</span>
              </div>
            </td>
          </tr>
        </tbody>

        {/* Notion Column Calculation Bar (Footer) */}
        <tfoot>
          <tr className="db-calculate-row">
            {visibleProperties.map((prop) => (
              <td key={prop.id}>
                <div
                  className="calc-pill-interactive"
                  onClick={() => setActiveCalcMenu({ propId: prop.id })}
                >
                  <span>{computeColumnCalculation(prop)}</span>
                </div>
              </td>
            ))}
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // ==================== BOARD (KANBAN) VIEW ====================
  const renderBoardView = () => (
    <div className="db-board-wrapper">
      {STATUS_OPTIONS.map((status) => {
        const columnRows = processedRows.filter((r) => (r.cells['prop-status'] || 'Not Started') === status);
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
                <div
                  key={card.id}
                  className="board-card"
                  onClick={() => setSelectedRow(card)}
                >
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
      {processedRows.map((row) => (
        <div key={row.id} className="list-row" onClick={() => setSelectedRow(row)}>
          <div className="list-row-title">
            <span className="prop-icon-aa" style={{ fontSize: '12px' }}>Aa</span>
            <span>{row.cells['prop-title']}</span>
          </div>
          <div className="list-row-meta" onClick={(e) => e.stopPropagation()}>
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
        <span>New page</span>
      </button>
    </div>
  );

  // ==================== GALLERY VIEW ====================
  const renderGalleryView = () => (
    <div className="db-gallery-wrapper">
      {processedRows.map((card) => (
        <div key={card.id} className="gallery-card" onClick={() => setSelectedRow(card)}>
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
            const matchingRows = processedRows.filter((r) => r.cells['prop-date'] === dateStr);

            return (
              <div
                key={i}
                className="calendar-cell"
                onClick={() => {
                  addDatabaseRow(db.id, {
                    'prop-title': 'Scheduled Item',
                    'prop-date': dateStr
                  });
                }}
              >
                <span className="calendar-day-number">{dayNum}</span>
                {matchingRows.map((r) => (
                  <div
                    key={r.id}
                    className="calendar-event-pill"
                    title={r.cells['prop-title']}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRow(r);
                    }}
                  >
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
      {/* Top Header: Database Title & View Tab Pill & Controls */}
      <div className="database-top-bar">
        {/* Left: View Tabs Pill (Matches Screenshot [田 Table]) */}
        <div className="db-views-tab-group">
          <button
            className={`db-view-pill ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'table')}
          >
            <TableIcon size={14} />
            <span>Table</span>
          </button>
          <button
            className={`db-view-pill ${activeView === 'board' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'board')}
          >
            <Kanban size={14} />
            <span>Board</span>
          </button>
          <button
            className={`db-view-pill ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'list')}
          >
            <ListIcon size={14} />
            <span>List</span>
          </button>
          <button
            className={`db-view-pill ${activeView === 'gallery' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'gallery')}
          >
            <LayoutGrid size={14} />
            <span>Gallery</span>
          </button>
          <button
            className={`db-view-pill ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setDatabaseActiveView(db.id, 'calendar')}
          >
            <CalendarIcon size={14} />
            <span>Calendar</span>
          </button>
        </div>

        {/* Right: Search, Settings Button (Sliders), and Blue 'New ∨' Split Button */}
        <div className="database-top-actions">
          <input
            type="text"
            className="db-search-input"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Notion Signature View Settings Sliders Button (Matches Screenshot) */}
          <button
            className={`db-sliders-btn ${viewSettingsOpen ? 'active' : ''}`}
            onClick={() => setViewSettingsOpen((prev) => !prev)}
            title="Open View Settings (Layout, Visibility, Filters, Automations)"
          >
            <SlidersHorizontal size={15} />
          </button>

          {/* Notion Signature Blue Split Button [New | ∨] (Matches Screenshot) */}
          <div className="db-split-new-btn-group">
            <button
              className="db-split-new-primary"
              onClick={() => addDatabaseRow(db.id)}
            >
              New
            </button>
            <button
              className="db-split-new-dropdown"
              onClick={() => setSplitNewOpen((p) => !p)}
            >
              <ChevronDown size={14} />
            </button>

            {splitNewOpen && (
              <div
                className="dropdown-menu animate-popover"
                style={{ position: 'absolute', right: 0, top: '34px', zIndex: 1000, width: '180px' }}
                onMouseLeave={() => setSplitNewOpen(false)}
              >
                <button
                  className="sidebar-action-item"
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    addDatabaseRow(db.id);
                    setSplitNewOpen(false);
                  }}
                >
                  <Plus size={13} />
                  <span>New empty page</span>
                </button>
                <button
                  className="sidebar-action-item"
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    addDatabaseRow(db.id, {
                      'prop-title': 'Feature: AI Auto-tagging',
                      'prop-priority': 'High',
                      'prop-status': 'In Progress',
                      'prop-tag': 'AI & Core'
                    });
                    setSplitNewOpen(false);
                  }}
                >
                  <span>✨ New AI Feature</span>
                </button>
                <button
                  className="sidebar-action-item"
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    addDatabaseRow(db.id, {
                      'prop-title': 'Bug: Fix Dark Mode contrast',
                      'prop-priority': 'Urgent',
                      'prop-status': 'Not Started',
                      'prop-tag': 'Frontend'
                    });
                    setSplitNewOpen(false);
                  }}
                >
                  <span>🐞 Bug Report item</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notion Quick Filter & Sort Toolbar */}
      <div className="db-filter-sort-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="db-toolbar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priority:</span>
          <select
            className="db-toolbar-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <ArrowUpDown size={12} color="var(--text-muted)" />
          <select
            className="db-toolbar-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="title-asc">Title: A → Z</option>
            <option value="title-desc">Title: Z → A</option>
            <option value="date-asc">Date: Earliest</option>
            <option value="date-desc">Date: Latest</option>
          </select>
        </div>
      </div>

      {/* View Content Renderer */}
      {activeView === 'table' && renderTableView()}
      {activeView === 'board' && renderBoardView()}
      {activeView === 'list' && renderListView()}
      {activeView === 'gallery' && renderGalleryView()}
      {activeView === 'calendar' && renderCalendarView()}

      {/* Popovers & Drawers */}
      {/* 1. Add Property Popover */}
      {addPropertyOpen && (
        <AddPropertyPopover
          onAdd={(name, type) => addDatabaseProperty(db.id, name, type)}
          onClose={() => setAddPropertyOpen(false)}
        />
      )}

      {/* 2. Column Header Menu */}
      {activeColumnMenu && (
        <ColumnHeaderMenu
          property={activeColumnMenu}
          onRename={(propId, newName) => updateDatabaseProperty(db.id, propId, { name: newName })}
          onSortAsc={() => {
            setSortOrder('title-asc');
            setActiveColumnMenu(null);
          }}
          onSortDesc={() => {
            setSortOrder('title-desc');
            setActiveColumnMenu(null);
          }}
          onFilter={() => {
            setStatusFilter(activeColumnMenu.name);
            setActiveColumnMenu(null);
          }}
          onHide={() => {
            togglePropertyVisibility(db.id, activeColumnMenu.id);
            setActiveColumnMenu(null);
          }}
          onDelete={() => {
            deleteDatabaseProperty(db.id, activeColumnMenu.id);
            setActiveColumnMenu(null);
          }}
          onClose={() => setActiveColumnMenu(null)}
        />
      )}

      {/* 3. Column Calculation Menu */}
      {activeCalcMenu && (
        <CalculateMenu
          currentCalc={columnCalculations[activeCalcMenu.propId]}
          onSelect={(calcType) => {
            setColumnCalculations((prev) => ({ ...prev, [activeCalcMenu.propId]: calcType }));
          }}
          onClose={() => setActiveCalcMenu(null)}
        />
      )}

      {/* 4. Notion View Settings Side Drawer (Matching Screenshot) */}
      {viewSettingsOpen && (
        <ViewSettingsDrawer
          db={db}
          onClose={() => setViewSettingsOpen(false)}
        />
      )}

      {/* 5. Row / Card Detail Modal */}
      {selectedRow && (
        <RowDetailModal
          row={selectedRow}
          dbId={db.id}
          onClose={() => setSelectedRow(null)}
          onUpdate={(dbId, rowId, updates) => {
            updateDatabaseRow(dbId, rowId, updates);
            setSelectedRow((prev) => ({ ...prev, cells: { ...prev.cells, ...updates } }));
          }}
          onDelete={deleteDatabaseRow}
        />
      )}
    </div>
  );
};
