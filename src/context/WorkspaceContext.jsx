import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_PAGES, INITIAL_DATABASES, TEMPLATES } from '../data/initialData';
import {
  fetchCloudPages,
  upsertCloudPage,
  deleteCloudPage,
  fetchCloudDatabases,
  upsertCloudDatabase,
  getInitialUser,
  onAuthChange,
  signOutUser
} from '../lib/supabase';

const WorkspaceContext = createContext(null);

const STORAGE_KEY = 'notion_ai_workspace_v1';

export const WorkspaceProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Cloud sync status: 'connecting' | 'connected' | 'offline'
  const [cloudStatus, setCloudStatus] = useState('connecting');

  // Load initial data from localStorage if available
  const [pages, setPages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_pages');
      return saved ? JSON.parse(saved) : INITIAL_PAGES;
    } catch (e) {
      console.error('Failed to load pages from storage', e);
      return INITIAL_PAGES;
    }
  });

  const [databases, setDatabases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_databases');
      return saved ? JSON.parse(saved) : INITIAL_DATABASES;
    } catch (e) {
      console.error('Failed to load databases from storage', e);
      return INITIAL_DATABASES;
    }
  });

  const [currentPageId, setCurrentPageId] = useState('page-welcome');
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'database' | 'trash' | 'templates'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Theme state: defaults to dark or light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('notion_ai_theme') || 'light';
  });

  // Modal and drawer visibility states
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [trashModalOpen, setTrashModalOpen] = useState(false);

  // Auth session listener on mount
  useEffect(() => {
    getInitialUser().then((currentUser) => {
      if (currentUser) setUser(currentUser);
    });

    const subscription = onAuthChange((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync from Supabase when an authenticated user session is active
  useEffect(() => {
    const initCloud = async () => {
      // Only sync with Supabase when logged in with a real authenticated user
      if (!user || user.id?.startsWith('demo-')) {
        setCloudStatus('offline');
        return;
      }
      try {
        setCloudStatus('connecting');
        const [cloudP, cloudD] = await Promise.all([
          fetchCloudPages(),
          fetchCloudDatabases()
        ]);
        if (cloudP && cloudP.length > 0) {
          setPages(cloudP);
        }
        if (cloudD && Object.keys(cloudD).length > 0) {
          setDatabases(cloudD);
        }
        setCloudStatus('connected');
      } catch (err) {
        console.warn('Could not sync with Supabase cloud, falling back to local storage', err);
        setCloudStatus('offline');
      }
    };
    initCloud();
  }, [user]);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('notion_ai_theme', theme);
  }, [theme]);

  // Persist pages & auto-sync to Supabase for authenticated user
  const pagesSyncTimeoutRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_pages', JSON.stringify(pages));
    } catch (e) {
      console.error('Failed to save pages to localStorage', e);
    }

    if (cloudStatus === 'connected' && user && !user.id?.startsWith('demo-')) {
      if (pagesSyncTimeoutRef.current) clearTimeout(pagesSyncTimeoutRef.current);
      pagesSyncTimeoutRef.current = setTimeout(() => {
        pages.forEach((p) => upsertCloudPage(p));
      }, 1000);
    }
  }, [pages, cloudStatus, user]);

  // Persist databases & auto-sync to Supabase for authenticated user
  const dbSyncTimeoutRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_databases', JSON.stringify(databases));
    } catch (e) {
      console.error('Failed to save databases to localStorage', e);
    }

    if (cloudStatus === 'connected' && user && !user.id?.startsWith('demo-')) {
      if (dbSyncTimeoutRef.current) clearTimeout(dbSyncTimeoutRef.current);
      dbSyncTimeoutRef.current = setTimeout(() => {
        Object.values(databases).forEach((db) => upsertCloudDatabase(db));
      }, 1000);
    }
  }, [databases, cloudStatus, user]);

  // Keyboard shortcut listener for Ctrl+K (Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const selectPage = (id) => {
    setCurrentPageId(id);
    setCurrentView('editor');
  };

  const currentPage = pages.find((p) => p.id === currentPageId) || pages.find((p) => !p.inTrash) || pages[0];

  // Page Operations
  const addPage = (parentId = null, title = 'Untitled', icon = '📄') => {
    const newId = 'page-' + Date.now();
    const newPage = {
      id: newId,
      title: title || 'Untitled',
      icon: icon || '📄',
      cover: null,
      parentId,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: [
        {
          id: 'b-' + Date.now(),
          type: 'text',
          content: ''
        }
      ]
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newId);
    setCurrentView('editor');
    return newPage;
  };

  const updatePage = (id, updates) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, ...updates, updatedAt: Date.now() } : page))
    );
  };

  const deletePage = (id) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, inTrash: true, updatedAt: Date.now() } : page))
    );
    if (currentPageId === id) {
      const remaining = pages.filter((p) => p.id !== id && !p.inTrash);
      if (remaining.length > 0) {
        setCurrentPageId(remaining[0].id);
      }
    }
  };

  const restorePage = (id) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, inTrash: false, updatedAt: Date.now() } : page))
    );
    setCurrentPageId(id);
  };

  const permanentlyDeletePage = (id) => {
    setPages((prev) => prev.filter((page) => page.id !== id && page.parentId !== id));
    if (cloudStatus === 'connected' && user && !user.id?.startsWith('demo-')) {
      deleteCloudPage(id);
    }
  };

  const toggleFavorite = (id) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, isFavorite: !page.isFavorite } : page))
    );
  };

  const duplicatePage = (id) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const newId = 'page-' + Date.now();
    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      title: target.title + ' (Copy)',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      blocks: target.blocks.map((b) => ({ ...b, id: 'b-' + Math.random().toString(36).substr(2, 9) }))
    };
    setPages((prev) => [...prev, copy]);
    setCurrentPageId(newId);
  };

  // Block Operations
  const updateBlocks = (pageId, blocks) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, blocks, updatedAt: Date.now() } : p))
    );
  };

  const updateBlock = (pageId, blockId, updates) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        const newBlocks = p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b));
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  };

  const addBlock = (pageId, index, blockData = {}) => {
    const newBlock = {
      id: 'b-' + Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: '',
      ...blockData
    };
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        const newBlocks = [...p.blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
    return newBlock;
  };

  const deleteBlock = (pageId, blockId) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        if (p.blocks.length <= 1) {
          // Keep at least 1 empty text block
          return {
            ...p,
            blocks: [{ id: 'b-' + Date.now(), type: 'text', content: '' }],
            updatedAt: Date.now()
          };
        }
        return {
          ...p,
          blocks: p.blocks.filter((b) => b.id !== blockId),
          updatedAt: Date.now()
        };
      })
    );
  };

  const moveBlock = (pageId, fromIndex, toIndex) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        const newBlocks = [...p.blocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, moved);
        return { ...p, blocks: newBlocks, updatedAt: Date.now() };
      })
    );
  };

  // Database Operations
  const updateDatabaseRow = (dbId, rowId, cellUpdates) => {
    setDatabases((prev) => {
      const db = prev[dbId];
      if (!db) return prev;
      const updatedRows = db.rows.map((row) =>
        row.id === rowId ? { ...row, cells: { ...row.cells, ...cellUpdates } } : row
      );
      return { ...prev, [dbId]: { ...db, rows: updatedRows } };
    });
  };

  const addDatabaseRow = (dbId, initialCells = {}) => {
    setDatabases((prev) => {
      const db = prev[dbId];
      if (!db) return prev;
      const newRow = {
        id: 'row-' + Date.now(),
        cells: {
          'prop-title': 'New Item',
          'prop-status': 'Not Started',
          'prop-priority': 'Medium',
          'prop-date': new Date().toISOString().split('T')[0],
          ...initialCells
        }
      };
      return { ...prev, [dbId]: { ...db, rows: [...db.rows, newRow] } };
    });
  };

  const deleteDatabaseRow = (dbId, rowId) => {
    setDatabases((prev) => {
      const db = prev[dbId];
      if (!db) return prev;
      return { ...prev, [dbId]: { ...db, rows: db.rows.filter((r) => r.id !== rowId) } };
    });
  };

  const setDatabaseActiveView = (dbId, viewId) => {
    setDatabases((prev) => {
      const db = prev[dbId];
      if (!db) return prev;
      return { ...prev, [dbId]: { ...db, activeView: viewId } };
    });
  };

  const addDatabaseProperty = (dbId, propertyName, propertyType = 'text') => {
    setDatabases((prev) => {
      const db = prev[dbId];
      if (!db) return prev;
      const newProp = {
        id: 'prop-' + Date.now(),
        name: propertyName,
        type: propertyType,
        options: propertyType === 'select' ? ['Default'] : undefined
      };
      return { ...prev, [dbId]: { ...db, properties: [...db.properties, newProp] } };
    });
  };

  // Apply Template
  const applyTemplate = (templateId) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    const newPage = {
      id: 'page-' + Date.now(),
      title: tmpl.title,
      icon: tmpl.icon,
      cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
      parentId: null,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: tmpl.blocks.map((b) => ({ ...b, id: 'b-' + Math.random().toString(36).substr(2, 9) }))
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    setTemplatesModalOpen(false);
  };

  // Export Workspace to JSON
  const exportWorkspaceJSON = () => {
    const data = {
      pages,
      databases,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notethings_workspace_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export current page to Markdown
  const exportPageMarkdown = (pageId) => {
    const target = pages.find((p) => p.id === pageId);
    if (!target) return;
    let md = `# ${target.icon || ''} ${target.title}\n\n`;
    target.blocks.forEach((b) => {
      switch (b.type) {
        case 'h1': md += `# ${b.content}\n\n`; break;
        case 'h2': md += `## ${b.content}\n\n`; break;
        case 'h3': md += `### ${b.content}\n\n`; break;
        case 'todo': md += `- [${b.checked ? 'x' : ' '}] ${b.content}\n`; break;
        case 'bullet': md += `- ${b.content}\n`; break;
        case 'number': md += `1. ${b.content}\n`; break;
        case 'quote': md += `> ${b.content}\n\n`; break;
        case 'code': md += `\`\`\`${b.language || ''}\n${b.content}\n\`\`\`\n\n`; break;
        case 'divider': md += `---\n\n`; break;
        case 'callout': md += `> **${b.icon || '📌'} Note:** ${b.content}\n\n`; break;
        default: md += `${b.content}\n\n`; break;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${target.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Workspace
  const importWorkspaceJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.pages && Array.isArray(parsed.pages)) {
        setPages(parsed.pages);
      }
      if (parsed.databases) {
        setDatabases(parsed.databases);
      }
      alert('Workspace successfully imported!');
    } catch (e) {
      alert('Invalid workspace JSON file.');
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        pages,
        databases,
        currentPage,
        currentPageId,
        currentView,
        cloudStatus,
        user,
        setUser,
        authModalOpen,
        setAuthModalOpen,
        signOut: async () => {
          try {
            await signOutUser();
          } catch (e) {
            console.warn('Sign out warning:', e);
          }
          setUser(null);
        },
        theme,
        sidebarCollapsed,
        searchModalOpen,
        aiAssistantOpen,
        templatesModalOpen,
        trashModalOpen,
        setSidebarCollapsed,
        setSearchModalOpen,
        setAiAssistantOpen,
        setTemplatesModalOpen,
        setTrashModalOpen,
        selectPage,
        addPage,
        updatePage,
        deletePage,
        restorePage,
        permanentlyDeletePage,
        toggleFavorite,
        duplicatePage,
        updateBlocks,
        updateBlock,
        addBlock,
        deleteBlock,
        moveBlock,
        updateDatabaseRow,
        addDatabaseRow,
        deleteDatabaseRow,
        setDatabaseActiveView,
        addDatabaseProperty,
        toggleTheme,
        applyTemplate,
        exportWorkspaceJSON,
        exportPageMarkdown,
        importWorkspaceJSON
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
};
