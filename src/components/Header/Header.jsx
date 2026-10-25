import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  PanelLeft,
  ChevronRight,
  Star,
  Sparkles,
  Share2,
  MoreHorizontal,
  FileDown,
  Trash2,
  Copy,
  Lock,
  Unlock
} from 'lucide-react';
import './Header.css';

export const Header = () => {
  const {
    pages,
    currentPage,
    user,
    setAuthModalOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    selectPage,
    toggleFavorite,
    setAiAssistantOpen,
    exportPageMarkdown,
    duplicatePage,
    deletePage,
    updatePage
  } = useWorkspace();

  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  if (!currentPage) return null;

  // Build breadcrumb hierarchy
  const breadcrumbs = [];
  let curr = currentPage;
  while (curr) {
    breadcrumbs.unshift(curr);
    curr = curr.parentId ? pages.find((p) => p.id === curr.parentId) : null;
  }

  // Calculate word and character count immutably
  const { wordCount, totalChars } = (currentPage.blocks || []).reduce(
    (acc, b) => {
      if (!b.content) return acc;
      const words = b.content.trim().split(/\s+/).filter(Boolean).length;
      return {
        wordCount: acc.wordCount + words,
        totalChars: acc.totalChars + b.content.length
      };
    },
    { wordCount: 0, totalChars: 0 }
  );
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const fontStyle = currentPage.fontStyle || 'default';
  const smallText = !!currentPage.smallText;
  const fullWidth = !!currentPage.fullWidth;
  const isLocked = !!currentPage.isLocked;

  return (
    <header className="header-container">
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="header-left">
        {sidebarCollapsed && (
          <button
            className="header-btn"
            title="Open sidebar"
            onClick={() => setSidebarCollapsed(false)}
          >
            <PanelLeft size={16} />
          </button>
        )}

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((page, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={page.id}>
                {index > 0 && <ChevronRight size={12} color="var(--text-muted)" className="breadcrumb-separator" />}
                <span
                  className={`breadcrumb-item ${isLast ? 'breadcrumb-current' : 'breadcrumb-parent'}`}
                  onClick={() => selectPage(page.id)}
                  title={page.title}
                >
                  <span className="breadcrumb-icon">{page.icon || '📄'}</span>
                  <span className="breadcrumb-title">{page.title || 'Untitled'}</span>
                </span>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="header-right">
        {/* User Account / Google Sign-In */}
        {user ? (
          <button
            className="header-pill-btn user-profile-pill"
            style={{ padding: '3px 8px', gap: '6px' }}
            onClick={() => setAuthModalOpen(true)}
            title={user.isGuest ? 'Local Guest Workspace (Offline)' : 'Google Account (Cloud Synced)'}
          >
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="user-avatar-img"
                style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="user-avatar-fallback"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: user.isGuest ? 'var(--accent-orange)' : 'var(--accent-blue)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700
                }}
              >
                {user.isGuest ? 'G' : 'U'}
              </div>
            )}
            <span className="user-name-label" style={{ fontSize: '12px', fontWeight: 500, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.isGuest ? 'Guest' : (user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0])}
            </span>
          </button>
        ) : (
          <button
            className="header-pill-btn signin-pill"
            style={{
              gap: '6px',
              border: '1px solid var(--border-color)',
              fontWeight: 500,
              fontSize: '12px'
            }}
            onClick={() => setAuthModalOpen(true)}
            title="Sign in with Google"
          >
            <svg width="13" height="13" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="signin-label">Log in</span>
          </button>
        )}

        {/* NoteThings AI Sparkle Button */}
        <button
          className="header-pill-btn ai-sparkle"
          onClick={() => setAiAssistantOpen(true)}
          title="Open NoteThings AI Assistant"
        >
          <Sparkles size={14} />
          <span className="ai-btn-label">Ask AI</span>
        </button>

        {/* Favorite Star */}
        <button
          className="header-btn"
          title={currentPage.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(currentPage.id)}
        >
          <Star
            size={16}
            color={currentPage.isFavorite ? '#eab308' : 'currentColor'}
            fill={currentPage.isFavorite ? '#eab308' : 'none'}
          />
        </button>

        {/* Share & Export */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-btn"
            title="Export / Share"
            onClick={() => setShareMenuOpen((prev) => !prev)}
          >
            <Share2 size={16} />
          </button>

          {shareMenuOpen && (
            <div
              className="dropdown-menu animate-popover"
              style={{
                position: 'absolute',
                right: '0',
                top: '32px',
                backgroundColor: 'var(--bg-floating)',
                boxShadow: 'var(--shadow-floating)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                padding: '6px',
                zIndex: 100,
                minWidth: '180px'
              }}
              onMouseLeave={() => setShareMenuOpen(false)}
            >
              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px' }}
                onClick={() => {
                  exportPageMarkdown(currentPage.id);
                  setShareMenuOpen(false);
                }}
              >
                <FileDown size={14} />
                <span>Export as Markdown</span>
              </button>
            </div>
          )}
        </div>

        {/* More Options (Notion Full Page Customization Menu) */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-btn"
            title="Page options"
            onClick={() => setOptionsMenuOpen((prev) => !prev)}
          >
            <MoreHorizontal size={16} />
          </button>

          {optionsMenuOpen && (
            <div
              className="dropdown-menu animate-popover page-more-menu"
              style={{
                position: 'absolute',
                right: '0',
                top: '32px',
                backgroundColor: 'var(--bg-floating)',
                boxShadow: 'var(--shadow-floating)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                padding: '8px',
                zIndex: 100,
                minWidth: '220px'
              }}
              onMouseLeave={() => setOptionsMenuOpen(false)}
            >
              {/* Style: Font Selector */}
              <div className="menu-section-header">Style</div>
              <div className="font-selector-row">
                <button
                  className={`font-style-btn ${fontStyle === 'default' ? 'active' : ''}`}
                  onClick={() => updatePage(currentPage.id, { fontStyle: 'default' })}
                >
                  <span className="font-sample sans">Ag</span>
                  <span className="font-label">Default</span>
                </button>
                <button
                  className={`font-style-btn ${fontStyle === 'serif' ? 'active' : ''}`}
                  onClick={() => updatePage(currentPage.id, { fontStyle: 'serif' })}
                >
                  <span className="font-sample serif">Ag</span>
                  <span className="font-label">Serif</span>
                </button>
                <button
                  className={`font-style-btn ${fontStyle === 'mono' ? 'active' : ''}`}
                  onClick={() => updatePage(currentPage.id, { fontStyle: 'mono' })}
                >
                  <span className="font-sample mono">Ag</span>
                  <span className="font-label">Mono</span>
                </button>
              </div>

              <div className="menu-divider" />

              {/* Layout Toggles */}
              <div
                className="menu-toggle-item"
                onClick={() => updatePage(currentPage.id, { smallText: !smallText })}
              >
                <span>Small text</span>
                <div className={`switch-pill ${smallText ? 'on' : ''}`}>
                  <div className="switch-thumb" />
                </div>
              </div>

              <div
                className="menu-toggle-item"
                onClick={() => updatePage(currentPage.id, { fullWidth: !fullWidth })}
              >
                <span>Full width</span>
                <div className={`switch-pill ${fullWidth ? 'on' : ''}`}>
                  <div className="switch-thumb" />
                </div>
              </div>

              <div
                className="menu-toggle-item"
                onClick={() => updatePage(currentPage.id, { isLocked: !isLocked })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isLocked ? <Lock size={12} color="var(--accent-orange)" /> : <Unlock size={12} />}
                  <span>Lock page</span>
                </div>
                <div className={`switch-pill ${isLocked ? 'on' : ''}`}>
                  <div className="switch-thumb" />
                </div>
              </div>

              <div className="menu-divider" />

              {/* Page Stats */}
              <div className="menu-stats-box">
                <div><strong>{wordCount}</strong> words • <strong>{totalChars}</strong> chars</div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>~{readingTime} min read • {currentPage.blocks.length} blocks</div>
              </div>

              <div className="menu-divider" />

              {/* Actions */}
              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px' }}
                onClick={() => {
                  exportPageMarkdown(currentPage.id);
                  setOptionsMenuOpen(false);
                }}
              >
                <FileDown size={13} />
                <span>Export as Markdown</span>
              </button>

              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px' }}
                onClick={() => {
                  duplicatePage(currentPage.id);
                  setOptionsMenuOpen(false);
                }}
              >
                <Copy size={13} />
                <span>Duplicate page</span>
              </button>

              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px', color: 'var(--accent-red)' }}
                onClick={() => {
                  deletePage(currentPage.id);
                  setOptionsMenuOpen(false);
                }}
              >
                <Trash2 size={13} />
                <span>Delete page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
