import React, { useState } from 'react';
import {
  X,
  Table as TableIcon,
  Kanban,
  List as ListIcon,
  LayoutGrid,
  Calendar as CalendarIcon,
  Eye,
  Filter,
  ArrowUpDown,
  Layers,
  Palette,
  Link,
  GitBranch,
  Settings,
  Zap,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  Database,
  Lock,
  Unlock,
  ChevronRight,
  Info,
  Check,
  Trash2
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ViewSettingsDrawer = ({ db, onClose }) => {
  const {
    setDatabaseActiveView,
    togglePropertyVisibility,
    updateDatabaseSettings,
    deleteDatabaseProperty
  } = useWorkspace();

  const [activeSubmenu, setActiveSubmenu] = useState(null); // 'layout' | 'visibility' | 'filter' | 'sort' | 'group' | 'properties'
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewTitle, setViewTitle] = useState(db.title || 'Table view');

  const properties = db.properties || [];
  const hiddenProps = new Set(db.hiddenProperties || []);
  const visibleCount = properties.filter((p) => !hiddenProps.has(p.id)).length;
  const isLocked = !!db.isLocked;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTitleBlur = () => {
    updateDatabaseSettings(db.id, { title: viewTitle });
  };

  return (
    <div className="view-settings-drawer-backdrop" onClick={onClose}>
      <div
        className="view-settings-drawer animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="vs-header">
          <div className="vs-title">View settings</div>
          <button className="vs-close-btn" onClick={onClose} title="Close settings">
            <X size={16} />
          </button>
        </div>

        {/* View Name Field */}
        <div className="vs-name-box">
          <div className="vs-view-icon">
            <TableIcon size={14} />
          </div>
          <input
            type="text"
            className="vs-name-input"
            value={viewTitle}
            onChange={(e) => setViewTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="View name"
          />
          <div className="vs-info-icon" title="Custom name for this database view">
            <Info size={14} />
          </div>
        </div>

        {/* Settings Navigation List */}
        <div className="vs-menu-list">
          {/* Layout */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'layout' ? null : 'layout')}
          >
            <div className="vs-item-left">
              <TableIcon size={14} />
              <span>Layout</span>
            </div>
            <div className="vs-item-right">
              <span className="vs-item-value" style={{ textTransform: 'capitalize' }}>
                {db.activeView || 'Table'}
              </span>
              <ChevronRight size={14} className={activeSubmenu === 'layout' ? 'rotate-90' : ''} />
            </div>
          </div>

          {/* Layout Submenu */}
          {activeSubmenu === 'layout' && (
            <div className="vs-submenu-box">
              {[
                { id: 'table', label: 'Table', icon: <TableIcon size={13} /> },
                { id: 'board', label: 'Board', icon: <Kanban size={13} /> },
                { id: 'list', label: 'List', icon: <ListIcon size={13} /> },
                { id: 'gallery', label: 'Gallery', icon: <LayoutGrid size={13} /> },
                { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={13} /> }
              ].map((l) => (
                <button
                  key={l.id}
                  className={`vs-submenu-btn ${db.activeView === l.id ? 'active' : ''}`}
                  onClick={() => {
                    setDatabaseActiveView(db.id, l.id);
                  }}
                >
                  {l.icon}
                  <span>{l.label}</span>
                  {db.activeView === l.id && <Check size={13} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          )}

          {/* Property Visibility */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'visibility' ? null : 'visibility')}
          >
            <div className="vs-item-left">
              <Eye size={14} />
              <span>Property visibility</span>
            </div>
            <div className="vs-item-right">
              <span className="vs-item-value">{visibleCount}</span>
              <ChevronRight size={14} className={activeSubmenu === 'visibility' ? 'rotate-90' : ''} />
            </div>
          </div>

          {/* Property Visibility Submenu */}
          {activeSubmenu === 'visibility' && (
            <div className="vs-submenu-box">
              <div className="vs-prop-checklist">
                {properties.map((p) => {
                  const isVisible = !hiddenProps.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className="vs-prop-toggle-row"
                      onClick={() => togglePropertyVisibility(db.id, p.id)}
                    >
                      <span className="vs-prop-name">{p.name}</span>
                      <div className={`switch-pill ${isVisible ? 'on' : ''}`}>
                        <div className="switch-thumb" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'filter' ? null : 'filter')}
          >
            <div className="vs-item-left">
              <Filter size={14} />
              <span>Filter</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} className={activeSubmenu === 'filter' ? 'rotate-90' : ''} />
            </div>
          </div>

          {activeSubmenu === 'filter' && (
            <div className="vs-submenu-box">
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Use toolbar filters or quick toggle status/priority above the table grid.
              </div>
            </div>
          )}

          {/* Sort */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'sort' ? null : 'sort')}
          >
            <div className="vs-item-left">
              <ArrowUpDown size={14} />
              <span>Sort</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} className={activeSubmenu === 'sort' ? 'rotate-90' : ''} />
            </div>
          </div>

          {/* Group */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'group' ? null : 'group')}
          >
            <div className="vs-item-left">
              <Layers size={14} />
              <span>Group</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} className={activeSubmenu === 'group' ? 'rotate-90' : ''} />
            </div>
          </div>

          {/* Conditional Color */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <Palette size={14} />
              <span>Conditional color</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Copy Link to View */}
          <div className="vs-menu-item" onClick={handleCopyLink}>
            <div className="vs-item-left">
              <Link size={14} />
              <span>{copiedLink ? 'Link copied!' : 'Copy link to view'}</span>
            </div>
            {copiedLink && <Check size={14} color="var(--accent-green)" />}
          </div>
        </div>

        {/* Data Source Settings Section */}
        <div className="vs-section-title">Data source settings</div>

        <div className="vs-menu-list">
          {/* Source */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <GitBranch size={14} />
              <span>Source</span>
            </div>
            <div className="vs-item-right">
              <span className="vs-item-value">@{db.title || 'Roadmap'}</span>
            </div>
          </div>

          {/* Edit Properties */}
          <div
            className="vs-menu-item"
            onClick={() => setActiveSubmenu(activeSubmenu === 'properties' ? null : 'properties')}
          >
            <div className="vs-item-left">
              <Settings size={14} />
              <span>Edit properties</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} className={activeSubmenu === 'properties' ? 'rotate-90' : ''} />
            </div>
          </div>

          {/* Edit Properties Submenu */}
          {activeSubmenu === 'properties' && (
            <div className="vs-submenu-box">
              {properties.map((p) => (
                <div key={p.id} className="vs-property-edit-row">
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.type}</span>
                  {p.id !== 'prop-title' && (
                    <button
                      className="header-btn"
                      title="Delete property"
                      style={{ width: '22px', height: '22px', marginLeft: 'auto', color: 'var(--accent-red)' }}
                      onClick={() => deleteDatabaseProperty(db.id, p.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Automations */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <Zap size={14} color="var(--accent-yellow)" />
              <span>Automations</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* AI Autofill */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <Sparkles size={14} color="var(--accent-purple)" />
              <span>AI Autofill</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Turn into */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <RefreshCw size={14} />
              <span>Turn into</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* More settings */}
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <MoreHorizontal size={14} />
              <span>More settings</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        <div className="vs-divider" />

        {/* Section Footer Items */}
        <div className="vs-menu-list">
          <div className="vs-menu-item">
            <div className="vs-item-left">
              <Database size={14} />
              <span>Manage data sources</span>
            </div>
            <div className="vs-item-right">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Lock database */}
          <div
            className="vs-menu-item"
            onClick={() => updateDatabaseSettings(db.id, { isLocked: !isLocked })}
          >
            <div className="vs-item-left">
              {isLocked ? <Lock size={14} color="var(--accent-orange)" /> : <Unlock size={14} />}
              <span>Lock database</span>
            </div>
            <div className="vs-item-right">
              <div className={`switch-pill ${isLocked ? 'on' : ''}`}>
                <div className="switch-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
