import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  Check,
  Clipboard,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SlashMenu } from './SlashMenu';

export const BlockItem = ({
  block,
  index,
  pageId,
  onEnter,
  onBackspace,
  isFocused,
  renderDatabase
}) => {
  const {
    updateBlock,
    addBlock,
    deleteBlock,
    moveBlock,
    duplicatePage,
    setAiAssistantOpen
  } = useWorkspace();

  const [menuOpen, setMenuOpen] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [block.content]);

  // Focus management
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocused]);

  // Handle text input and markdown shortcuts
  const handleContentChange = (e) => {
    let val = e.target.value;
    // Cap content length per block to prevent payload inflation (50,000 characters)
    if (val && val.length > 50000) {
      val = val.slice(0, 50000);
    }

    // Check for Slash Command trigger
    if (val.startsWith('/')) {
      setSlashMenuOpen(true);
      setSlashQuery(val);
      updateBlock(pageId, block.id, { content: val });
      return;
    } else {
      if (slashMenuOpen) setSlashMenuOpen(false);
    }

    // Markdown shortcut detection at line start
    if (block.type === 'text') {
      if (val === '# ') {
        updateBlock(pageId, block.id, { type: 'h1', content: '' });
        return;
      }
      if (val === '## ') {
        updateBlock(pageId, block.id, { type: 'h2', content: '' });
        return;
      }
      if (val === '### ') {
        updateBlock(pageId, block.id, { type: 'h3', content: '' });
        return;
      }
      if (val === '- ' || val === '* ') {
        updateBlock(pageId, block.id, { type: 'bullet', content: '' });
        return;
      }
      if (val === '1. ') {
        updateBlock(pageId, block.id, { type: 'number', content: '' });
        return;
      }
      if (val === '[] ' || val === '[ ] ') {
        updateBlock(pageId, block.id, { type: 'todo', checked: false, content: '' });
        return;
      }
      if (val === '> ') {
        updateBlock(pageId, block.id, { type: 'quote', content: '' });
        return;
      }
      if (val === '---') {
        updateBlock(pageId, block.id, { type: 'divider', content: '' });
        addBlock(pageId, index, { type: 'text', content: '' });
        return;
      }
      if (val === '```') {
        updateBlock(pageId, block.id, { type: 'code', language: 'javascript', content: '' });
        return;
      }
    }

    updateBlock(pageId, block.id, { content: val });
  };

  const handleKeyDown = (e) => {
    if (slashMenuOpen) return; // SlashMenu manages its own Enter/Escape

    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'code') return; // In code block, Enter creates newline
      e.preventDefault();
      onEnter(index);
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      if (block.type !== 'text') {
        updateBlock(pageId, block.id, { type: 'text' });
      } else {
        onBackspace(index, block.id);
      }
    }
  };

  const handleSlashSelect = (action) => {
    setSlashMenuOpen(false);
    if (action.type === 'ai' || action.type === 'ai-summarize') {
      setAiAssistantOpen(true);
      updateBlock(pageId, block.id, { content: '' });
      return;
    }
    updateBlock(pageId, block.id, {
      type: action.type,
      content: '',
      color: action.color,
      icon: action.icon,
      language: action.language,
      databaseId: action.databaseId,
      children: action.children
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(block.content || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render specific block type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'h1':
        return (
          <div className="block-h1">
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Heading 1"
            />
          </div>
        );
      case 'h2':
        return (
          <div className="block-h2">
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Heading 2"
            />
          </div>
        );
      case 'h3':
        return (
          <div className="block-h3">
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Heading 3"
            />
          </div>
        );
      case 'todo':
        return (
          <div className="block-todo">
            <div
              className={`todo-checkbox ${block.checked ? 'checked' : ''}`}
              onClick={() => updateBlock(pageId, block.id, { checked: !block.checked })}
            >
              {block.checked && <Check size={11} strokeWidth={3} />}
            </div>
            <textarea
              ref={textareaRef}
              rows={1}
              className={`block-input ${block.checked ? 'strikethrough' : ''}`}
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
            />
          </div>
        );
      case 'bullet':
        return (
          <div className="block-bullet">
            <span className="bullet-dot">•</span>
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="List item"
            />
          </div>
        );
      case 'number':
        return (
          <div className="block-number">
            <span className="number-prefix">{index + 1}.</span>
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="List item"
            />
          </div>
        );
      case 'quote':
        return (
          <div className="block-quote">
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Empty quote"
            />
          </div>
        );
      case 'callout':
        return (
          <div className={`block-callout ${block.color || 'blue'}`}>
            <span className="callout-icon">{block.icon || '💡'}</span>
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input"
              value={block.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Type something in this callout..."
            />
          </div>
        );
      case 'code':
        return (
          <div className="block-code">
            <div className="code-header">
              <span>{block.language || 'javascript'}</span>
              <button
                onClick={handleCopyCode}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}
              >
                {copiedCode ? <Check size={12} color="var(--accent-green)" /> : <Clipboard size={12} />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={block.content || ''}
              onChange={handleContentChange}
              placeholder="// Write code here..."
            />
          </div>
        );
      case 'toggle':
        return (
          <div className="block-toggle">
            <div className="toggle-header" onClick={() => updateBlock(pageId, block.id, { collapsed: !block.collapsed })}>
              <span className={`toggle-triangle ${!block.collapsed ? 'open' : ''}`}>
                <ChevronRight size={14} />
              </span>
              <textarea
                ref={textareaRef}
                rows={1}
                className="block-input"
                style={{ fontWeight: 500 }}
                value={block.content || ''}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder="Toggle heading"
              />
            </div>
            {!block.collapsed && block.children && (
              <div className="toggle-children">
                {block.children.map((childText, cIdx) => (
                  <div key={cIdx} className="toggle-child-item">
                    • {childText}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'divider':
        return <div className="block-divider" />;
      case 'database':
        return renderDatabase ? renderDatabase(block.databaseId) : null;
      default:
        return (
          <textarea
            ref={textareaRef}
            rows={1}
            className="block-input"
            value={block.content || ''}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands..."
          />
        );
    }
  };

  return (
    <div className="block-row">
      {/* Hover Controls: + & ⠿ */}
      <div className="block-controls">
        <button
          className="block-control-btn"
          title="Click to add a block below"
          onClick={() => addBlock(pageId, index, { type: 'text', content: '' })}
        >
          <Plus size={13} />
        </button>
        <button
          className="block-control-btn"
          title="Drag to move, click for options"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <GripVertical size={13} />
        </button>

        {/* Block Options Menu */}
        {menuOpen && (
          <div
            className="dropdown-menu animate-popover"
            style={{
              position: 'absolute',
              left: '24px',
              top: '0',
              backgroundColor: 'var(--bg-floating)',
              boxShadow: 'var(--shadow-floating)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              padding: '6px',
              zIndex: 100,
              minWidth: '150px'
            }}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px' }}
              onClick={() => {
                if (index > 0) moveBlock(pageId, index, index - 1);
                setMenuOpen(false);
              }}
            >
              <ArrowUp size={12} />
              Move Up
            </button>
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px' }}
              onClick={() => {
                moveBlock(pageId, index, index + 1);
                setMenuOpen(false);
              }}
            >
              <ArrowDown size={12} />
              Move Down
            </button>
            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px', color: 'var(--accent-red)' }}
              onClick={() => {
                deleteBlock(pageId, block.id);
                setMenuOpen(false);
              }}
            >
              <Trash2 size={12} />
              Delete Block
            </button>
          </div>
        )}
      </div>

      {/* Main Block Content */}
      <div className="block-content-area">{renderBlockContent()}</div>

      {/* Slash Command Autocomplete Popover */}
      {slashMenuOpen && (
        <SlashMenu
          query={slashQuery}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenuOpen(false)}
          position={{ top: '34px', left: '0' }}
        />
      )}
    </div>
  );
};
