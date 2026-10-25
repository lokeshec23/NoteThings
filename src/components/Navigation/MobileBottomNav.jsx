import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PanelLeft, Search, Plus, Sparkles, User } from 'lucide-react';
import './MobileBottomNav.css';

export const MobileBottomNav = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setSearchModalOpen,
    addPage,
    setAiAssistantOpen,
    user,
    setAuthModalOpen
  } = useWorkspace();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOpenSearch = () => {
    setSearchModalOpen(true);
  };

  const handleCreatePage = () => {
    addPage();
  };

  const handleOpenAI = () => {
    setAiAssistantOpen(true);
  };

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Pages / Sidebar Drawer */}
      <button
        className="mobile-nav-item"
        onClick={handleToggleSidebar}
        aria-label="Toggle pages menu"
      >
        <div className="mobile-nav-icon-wrapper">
          <PanelLeft size={20} />
        </div>
        <span className="mobile-nav-label">Pages</span>
      </button>

      {/* 2. Quick Search */}
      <button
        className="mobile-nav-item"
        onClick={handleOpenSearch}
        aria-label="Search workspace"
      >
        <div className="mobile-nav-icon-wrapper">
          <Search size={20} />
        </div>
        <span className="mobile-nav-label">Search</span>
      </button>

      {/* 3. Primary New Page Action (Center Floating Style) */}
      <button
        className="mobile-nav-item mobile-nav-add-btn"
        onClick={handleCreatePage}
        aria-label="Create new page"
      >
        <div className="mobile-nav-add-circle">
          <Plus size={22} color="#ffffff" strokeWidth={2.5} />
        </div>
        <span className="mobile-nav-label">New</span>
      </button>

      {/* 4. Notion AI Assistant */}
      <button
        className="mobile-nav-item mobile-nav-ai-item"
        onClick={handleOpenAI}
        aria-label="Open Notion AI"
      >
        <div className="mobile-nav-icon-wrapper ai-sparkle-icon">
          <Sparkles size={20} />
        </div>
        <span className="mobile-nav-label ai-label">AI</span>
      </button>

      {/* 5. Account / Login */}
      <button
        className="mobile-nav-item"
        onClick={handleOpenAuth}
        aria-label="Account Settings"
      >
        <div className="mobile-nav-icon-wrapper">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="mobile-nav-avatar"
            />
          ) : (
            <User size={20} />
          )}
        </div>
        <span className="mobile-nav-label">
          {user ? (user.isGuest ? 'Guest' : 'Account') : 'Log In'}
        </span>
      </button>
    </nav>
  );
};
