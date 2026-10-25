import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Search,
  Sparkles,
  Plus,
  Trash2,
  LayoutTemplate,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Star,
  Sun,
  Moon,
  Copy,
  Download,
  Upload,
  PanelLeftClose
} from 'lucide-react';
import './Sidebar.css';

const PageTreeItem = ({ page, level = 0 }) => {
  const {
    pages,
    currentPageId,
    selectPage,
    addPage,
    deletePage,
    toggleFavorite,
    duplicatePage
  } = useWorkspace();

  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const childPages = pages.filter((p) => p.parentId === page.id && !p.inTrash);
  const hasChildren = childPages.length > 0;
  const isActive = currentPageId === page.id;

  const handleAddSubPage = (e) => {
    e.stopPropagation();
    addPage(page.id, 'Untitled Subpage', '📄');
    setExpanded(true);
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="subpage-container">
      <div
        className={`page-tree-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${8 + level * 14}px` }}
        onClick={() => selectPage(page.id)}
      >
        <button
          className="page-expand-btn"
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        <span className="page-icon">{page.icon || '📄'}</span>
        <span className="page-title">{page.title || 'Untitled'}</span>

        <div className="page-actions-hover">
          <button
            className="page-action-btn"
            title="Add subpage"
            onClick={handleAddSubPage}
          >
            <Plus size={13} />
          </button>
          <button
            className="page-action-btn"
            title="Page options"
            onClick={handleToggleMenu}
          >
            <MoreHorizontal size={13} />
          </button>
        </div>

        {menuOpen && (
          <div
            className="dropdown-menu animate-popover"
            style={{
              position: 'absolute',
              right: '8px',
              top: '24px',
              backgroundColor: 'var(--bg-floating)',
              boxShadow: 'var(--shadow-floating)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              padding: '4px',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              minWidth: '140px'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px', padding: '4px 6px' }}
              onClick={() => {
                toggleFavorite(page.id);
                setMenuOpen(false);
              }}
            >
              <Star size={12} color={page.isFavorite ? 'gold' : 'currentColor'} />
              {page.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            </button>
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px', padding: '4px 6px' }}
              onClick={() => {
                duplicatePage(page.id);
                setMenuOpen(false);
              }}
            >
              <Copy size={12} />
              Duplicate
            </button>
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px', padding: '4px 6px', color: 'var(--accent-red)' }}
              onClick={() => {
                deletePage(page.id);
                setMenuOpen(false);
              }}
            >
              <Trash2 size={12} />
              Delete Page
            </button>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="subpages-list">
          {childPages.map((child) => (
            <PageTreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const {
    pages,
    currentPageId,
    cloudStatus,
    user,
    setAuthModalOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    setSearchModalOpen,
    setAiAssistantOpen,
    setTemplatesModalOpen,
    setTrashModalOpen,
    addPage,
    selectPage,
    theme,
    toggleTheme,
    exportWorkspaceJSON,
    importWorkspaceJSON
  } = useWorkspace();

  const rootPages = pages.filter((p) => p.parentId === null && !p.inTrash);
  const favoritePages = pages.filter((p) => p.isFavorite && !p.inTrash);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          importWorkspaceJSON(event.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <aside className={`sidebar-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Workspace Header */}
      <div className="sidebar-header">
        <div
          className="workspace-switcher"
          title="Account & Workspace settings"
          onClick={() => setAuthModalOpen(true)}
        >
          <div className="workspace-avatar">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="user"
                style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }}
              />
            ) : (
              'NT'
            )}
          </div>
          <span className="workspace-name">
            {user ? (user.user_metadata?.full_name || user.email?.split('@')[0]) : 'NoteThings Workspace'}
          </span>
          <span
            className="workspace-plan"
            style={{
              backgroundColor: cloudStatus === 'connected' ? 'var(--accent-green-bg)' : 'var(--accent-purple-bg)',
              color: cloudStatus === 'connected' ? 'var(--accent-green)' : 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ● {cloudStatus === 'connected' ? 'SUPABASE' : 'SYNCING'}
          </span>
        </div>
        <button
          className="section-add-btn"
          title="Close sidebar"
          onClick={() => setSidebarCollapsed(true)}
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Quick Nav Actions */}
      <div className="sidebar-actions">
        {/* Google Auth Status / Button */}
        {user ? (
          <div
            className="sidebar-action-item"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              marginBottom: '4px',
              padding: '6px 8px'
            }}
            onClick={() => setAuthModalOpen(true)}
            title="Manage Google account"
          >
            <img
              src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          </div>
        ) : (
          <button
            className="sidebar-action-item"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              marginBottom: '6px',
              boxShadow: 'var(--shadow-sm)'
            }}
            onClick={() => setAuthModalOpen(true)}
            title="Sign in with Google"
          >
            <svg width="15" height="15" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        )}

        <button
          className="sidebar-action-item"
          onClick={() => setSearchModalOpen(true)}
          title="Search all pages (Ctrl+K)"
        >
          <Search size={14} />
          <span>Search</span>
          <span className="shortcut-hint">Ctrl K</span>
        </button>

        <button
          className="sidebar-action-item ai-btn"
          onClick={() => setAiAssistantOpen(true)}
          title="NoteThings AI Connected Assistant"
        >
          <Sparkles size={14} />
          <span>NoteThings AI</span>
          <span className="badge badge-purple" style={{ marginLeft: 'auto', fontSize: '9px' }}>2.0</span>
        </button>

        <button
          className="sidebar-action-item"
          onClick={() => setTemplatesModalOpen(true)}
        >
          <LayoutTemplate size={14} />
          <span>Templates</span>
        </button>

        <button
          className="sidebar-action-item"
          onClick={() => setTrashModalOpen(true)}
        >
          <Trash2 size={14} />
          <span>Trash</span>
        </button>

        <button
          className="sidebar-action-item"
          onClick={toggleTheme}
          title="Toggle light/dark theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Page Tree Section */}
      <div className="sidebar-section">
        {/* Favorites Sub-section */}
        {favoritePages.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div className="sidebar-section-title">
              <span>Favorites</span>
            </div>
            {favoritePages.map((page) => (
              <div
                key={'fav-' + page.id}
                className={`page-tree-item ${currentPageId === page.id ? 'active' : ''}`}
                style={{ paddingLeft: '8px' }}
                onClick={() => selectPage(page.id)}
              >
                <span className="page-icon">{page.icon || '📄'}</span>
                <span className="page-title">{page.title || 'Untitled'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Private / Workspace Pages */}
        <div className="sidebar-section-title">
          <span>Private Pages</span>
          <button
            className="section-add-btn"
            title="Add a page"
            onClick={() => addPage(null, 'Untitled Page', '📄')}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="pages-tree-list">
          {rootPages.map((page) => (
            <PageTreeItem key={page.id} page={page} level={0} />
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button
          className="new-page-btn"
          onClick={() => addPage(null, 'Untitled Page', '📄')}
        >
          <Plus size={15} />
          <span>New Page</span>
        </button>

        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <button
            className="sidebar-action-item"
            style={{ fontSize: '11px', padding: '4px 6px', flex: 1 }}
            onClick={exportWorkspaceJSON}
            title="Backup full workspace to JSON"
          >
            <Download size={12} />
            <span>Export</span>
          </button>
          <button
            className="sidebar-action-item"
            style={{ fontSize: '11px', padding: '4px 6px', flex: 1 }}
            onClick={handleImportClick}
            title="Import workspace JSON backup"
          >
            <Upload size={12} />
            <span>Import</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
