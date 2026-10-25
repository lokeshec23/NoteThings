import React from 'react';
import {
  Sparkles,
  Table,
  ClipboardList,
  Kanban,
  List,
  Calendar,
  LayoutGrid,
  FileText,
  Download,
  BookOpen
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import './EmptyPageStarters.css';

export const EmptyPageStarters = ({ pageId, onFocusFirstBlock }) => {
  const {
    createDatabase,
    addBlock,
    updateBlock,
    currentPage,
    setAiAssistantOpen,
    setTemplatesModalOpen,
    importWorkspaceJSON
  } = useWorkspace();

  const handleStartBlank = () => {
    if (onFocusFirstBlock) onFocusFirstBlock();
  };

  const handleAddDatabase = (title, layout) => {
    const newDbId = createDatabase(title, layout);
    // Replace first empty block or add
    if (currentPage.blocks.length === 1 && !currentPage.blocks[0].content) {
      updateBlock(pageId, currentPage.blocks[0].id, {
        type: 'database',
        databaseId: newDbId
      });
    } else {
      addBlock(pageId, 0, {
        type: 'database',
        databaseId: newDbId
      });
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.md,.txt';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (file.name.endsWith('.json')) {
          importWorkspaceJSON(text);
        } else {
          // Add as markdown block
          addBlock(pageId, 0, { type: 'text', content: text });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="empty-page-starters-container animate-fade-in">
      <div className="empty-page-ai-hint" onClick={() => setAiAssistantOpen(true)}>
        <Sparkles size={14} color="var(--accent-purple)" />
        <span>Press <kbd>Space</kbd> for NoteThings AI, or <kbd>/</kbd> for commands</span>
      </div>

      <div className="starters-section-title">Start with a template or database</div>

      <div className="starters-grid">
        <button className="starter-card" onClick={handleStartBlank}>
          <div className="starter-icon" style={{ color: 'var(--text-secondary)' }}>
            <FileText size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Empty page</span>
            <span className="starter-desc">Start writing freely or press / for slash commands</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('Table database', 'table')}>
          <div className="starter-icon" style={{ color: 'var(--accent-blue)' }}>
            <Table size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Table</span>
            <span className="starter-desc">Structured grid with sorting, filters, and calculations</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('New form', 'form')}>
          <div className="starter-icon" style={{ color: 'var(--accent-purple)' }}>
            <ClipboardList size={18} />
          </div>
          <div className="starter-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="starter-title">Form</span>
              <span className="starter-badge">NEW</span>
            </div>
            <span className="starter-desc">Form builder to collect and log responses into tables</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('Board database', 'board')}>
          <div className="starter-icon" style={{ color: 'var(--accent-yellow)' }}>
            <Kanban size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Board</span>
            <span className="starter-desc">Kanban cards grouped by status and progress stages</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('List database', 'list')}>
          <div className="starter-icon" style={{ color: 'var(--accent-green)' }}>
            <List size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">List</span>
            <span className="starter-desc">Clean minimalist item list with tags and assignees</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('Calendar database', 'calendar')}>
          <div className="starter-icon" style={{ color: 'var(--accent-red)' }}>
            <Calendar size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Calendar</span>
            <span className="starter-desc">Monthly grid view scheduled by target deadline dates</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => handleAddDatabase('Gallery database', 'gallery')}>
          <div className="starter-icon" style={{ color: '#e06c75' }}>
            <LayoutGrid size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Gallery</span>
            <span className="starter-desc">Visual showcase cards with rich cover images</span>
          </div>
        </button>

        <button className="starter-card" onClick={() => setTemplatesModalOpen(true)}>
          <div className="starter-icon" style={{ color: 'var(--accent-blue)' }}>
            <BookOpen size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Templates</span>
            <span className="starter-desc">Sprint backlog, OKRs, team wiki, and engineering roadmaps</span>
          </div>
        </button>

        <button className="starter-card" onClick={handleImportFile}>
          <div className="starter-icon" style={{ color: 'var(--text-secondary)' }}>
            <Download size={18} />
          </div>
          <div className="starter-info">
            <span className="starter-title">Import</span>
            <span className="starter-desc">Import existing JSON workspace, Markdown, or text</span>
          </div>
        </button>
      </div>
    </div>
  );
};
