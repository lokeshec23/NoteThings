import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronRight,
  Check,
  Clipboard,
  ArrowUp,
  ArrowDown,
  Copy,
  RefreshCw,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Type,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Info,
  ListTree,
  Image as ImageIcon,
  Bookmark as BookmarkIcon,
  Sigma,
  ExternalLink
} from 'lucide-react';
import { SlashMenu } from './SlashMenu';

const TURN_INTO_OPTIONS = [
  { type: 'text', label: 'Text', icon: <Type size={13} /> },
  { type: 'h1', label: 'Heading 1', icon: <Heading1 size={13} /> },
  { type: 'h2', label: 'Heading 2', icon: <Heading2 size={13} /> },
  { type: 'h3', label: 'Heading 3', icon: <Heading3 size={13} /> },
  { type: 'todo', label: 'To-do list', icon: <CheckSquare size={13} /> },
  { type: 'bullet', label: 'Bulleted list', icon: <List size={13} /> },
  { type: 'number', label: 'Numbered list', icon: <ListOrdered size={13} /> },
  { type: 'toggle', label: 'Toggle list', icon: <ChevronRight size={13} /> },
  { type: 'quote', label: 'Quote', icon: <Quote size={13} /> },
  { type: 'callout', label: 'Callout', icon: <Info size={13} /> },
  { type: 'code', label: 'Code', icon: <CodeIcon size={13} /> },
  { type: 'toc', label: 'Table of Contents', icon: <ListTree size={13} /> },
  { type: 'math', label: 'Math Equation', icon: <Sigma size={13} /> },
  { type: 'bookmark', label: 'Web Bookmark', icon: <BookmarkIcon size={13} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={13} /> }
];

const COLOR_OPTIONS = [
  { label: 'Default', value: '', color: 'var(--text-primary)' },
  { label: 'Gray', value: 'color-gray', color: '#787774' },
  { label: 'Brown', value: 'color-brown', color: '#9f6b53' },
  { label: 'Orange', value: 'color-orange', color: '#d9730d' },
  { label: 'Yellow', value: 'color-yellow', color: '#cb912f' },
  { label: 'Green', value: 'color-green', color: '#448361' },
  { label: 'Blue', value: 'color-blue', color: '#2383e2' },
  { label: 'Purple', value: 'color-purple', color: '#9065b0' },
  { label: 'Pink', value: 'color-pink', color: '#c14c8a' },
  { label: 'Red', value: 'color-red', color: '#e03e3e' }
];

const BG_OPTIONS = [
  { label: 'Default Background', value: '', bg: 'transparent' },
  { label: 'Gray background', value: 'bg-tint-gray', bg: '#f1f1ef' },
  { label: 'Brown background', value: 'bg-tint-brown', bg: '#f4eeee' },
  { label: 'Orange background', value: 'bg-tint-orange', bg: '#fbecdd' },
  { label: 'Yellow background', value: 'bg-tint-yellow', bg: '#fbf3db' },
  { label: 'Green background', value: 'bg-tint-green', bg: '#edf3ec' },
  { label: 'Blue background', value: 'bg-tint-blue', bg: '#e7f3f8' },
  { label: 'Purple background', value: 'bg-tint-purple', bg: '#f6f0fc' },
  { label: 'Pink background', value: 'bg-tint-pink', bg: '#faf1f5' },
  { label: 'Red background', value: 'bg-tint-red', bg: '#fdebec' }
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
];

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
    currentPage,
    updateBlock,
    addBlock,
    deleteBlock,
    moveBlock,
    turnIntoBlock,
    duplicateBlock,
    setBlockColor,
    createDatabase,
    setAiAssistantOpen
  } = useWorkspace();

  const [menuOpen, setMenuOpen] = useState(false);
  const [turnIntoOpen, setTurnIntoOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [bookmarkInputUrl, setBookmarkInputUrl] = useState('');
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
    if (slashMenuOpen) return;

    if (e.key === ' ' && block.content === '' && block.type === 'text') {
      e.preventDefault();
      setAiAssistantOpen(true);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'code' || block.type === 'math') return;
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
    let targetDbId = action.databaseId;
    if (action.type === 'database' && !targetDbId) {
      targetDbId = createDatabase(action.layout === 'form' ? 'New form' : 'New database', action.layout || 'table');
    }
    updateBlock(pageId, block.id, {
      type: action.type,
      content: '',
      color: action.color,
      icon: action.icon,
      language: action.language,
      databaseId: targetDbId,
      children: action.children,
      url: action.url
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(block.content || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Jump smoothly to heading
  const scrollToHeading = (targetId) => {
    const el = document.getElementById(`block-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Render specific block type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'h1':
        return (
          <div className="block-h1" id={`block-${block.id}`}>
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
          <div className="block-h2" id={`block-${block.id}`}>
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
          <div className="block-h3" id={`block-${block.id}`}>
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
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{block.language || 'javascript'}</span>
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
      case 'toc': {
        // Table of contents automatically gathered from page headings
        const headings = (currentPage?.blocks || []).filter(
          (b) => (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') && b.content?.trim()
        );
        return (
          <div className="block-toc">
            <div className="toc-header">
              <ListTree size={14} color="var(--accent-purple)" />
              <span>Table of Contents</span>
            </div>
            {headings.length === 0 ? (
              <div className="toc-empty">No headings found on this page. Add Heading 1, 2, or 3 blocks to populate this index.</div>
            ) : (
              <div className="toc-list">
                {headings.map((h) => {
                  const indent = h.type === 'h1' ? 0 : h.type === 'h2' ? 14 : 28;
                  return (
                    <div
                      key={h.id}
                      className="toc-item"
                      style={{ paddingLeft: `${indent}px` }}
                      onClick={() => scrollToHeading(h.id)}
                    >
                      <span className="toc-item-text">{h.content}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 'image':
        return (
          <div className="block-image-embed">
            {block.url ? (
              <div className="image-embed-preview">
                <img src={block.url} alt={block.caption || 'Embedded image'} className="embedded-img" />
                <div className="image-embed-footer">
                  <input
                    type="text"
                    className="image-caption-input"
                    value={block.caption || ''}
                    placeholder="Write a caption..."
                    onChange={(e) => updateBlock(pageId, block.id, { caption: e.target.value })}
                  />
                  <button
                    className="image-change-btn"
                    onClick={() => updateBlock(pageId, block.id, { url: '' })}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-embed-uploader">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ImageIcon size={16} color="var(--accent-blue)" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Embed Image</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="image-url-input"
                    placeholder="Paste an image URL..."
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                    onClick={() => {
                      if (imageInputUrl) {
                        updateBlock(pageId, block.id, { url: imageInputUrl });
                      }
                    }}
                  >
                    Embed
                  </button>
                </div>
                <div className="image-presets-row">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Or choose preset:</span>
                  {PRESET_IMAGES.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      className="preset-thumb-btn"
                      onClick={() => updateBlock(pageId, block.id, { url: preset })}
                    >
                      <img src={preset} alt={`preset-${pIdx}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'bookmark':
        return (
          <div className="block-bookmark">
            {block.url ? (
              <a
                href={block.url}
                target="_blank"
                rel="noreferrer"
                className="bookmark-card"
              >
                <div className="bookmark-info">
                  <div className="bookmark-title">{block.title || block.url}</div>
                  <div className="bookmark-desc">{block.desc || 'Click to open external link in new tab.'}</div>
                  <div className="bookmark-url">
                    <ExternalLink size={11} />
                    <span>{block.url}</span>
                  </div>
                </div>
                <div className="bookmark-icon-wrap">
                  <BookmarkIcon size={24} color="var(--text-muted)" />
                </div>
              </a>
            ) : (
              <div className="bookmark-uploader">
                <BookmarkIcon size={16} color="var(--accent-purple)" />
                <input
                  type="text"
                  className="image-url-input"
                  placeholder="Paste a link to bookmark (e.g. https://notion.so)..."
                  value={bookmarkInputUrl}
                  onChange={(e) => setBookmarkInputUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && bookmarkInputUrl) {
                      updateBlock(pageId, block.id, {
                        url: bookmarkInputUrl,
                        title: bookmarkInputUrl.replace(/^https?:\/\//, '').split('/')[0],
                        desc: 'External Web Link'
                      });
                    }
                  }}
                />
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                  onClick={() => {
                    if (bookmarkInputUrl) {
                      updateBlock(pageId, block.id, {
                        url: bookmarkInputUrl,
                        title: bookmarkInputUrl.replace(/^https?:\/\//, '').split('/')[0],
                        desc: 'External Web Link'
                      });
                    }
                  }}
                >
                  Create
                </button>
              </div>
            )}
          </div>
        );
      case 'math':
        return (
          <div className="block-math">
            <div className="math-header">
              <Sigma size={13} color="var(--accent-purple)" />
              <span>Math Equation (TeX)</span>
            </div>
            <textarea
              ref={textareaRef}
              rows={1}
              className="block-input math-input"
              value={block.content || ''}
              onChange={handleContentChange}
              placeholder="e.g. f(x) = \int_{-\infty}^\infty e^{-x^2} dx"
            />
            {block.content && (
              <div className="math-preview">
                <span className="math-preview-label">Preview:</span>
                <span className="math-rendered">{block.content}</span>
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
            placeholder="Press 'space' for AI, '/' for commands..."
          />
        );
    }
  };

  const blockClass = [
    'block-content-area',
    block.color || '',
    block.bgColor || ''
  ].filter(Boolean).join(' ');

  return (
    <div className="block-row" id={`block-${block.id}`}>
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
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setTurnIntoOpen(false);
            setColorMenuOpen(false);
          }}
        >
          <GripVertical size={13} />
        </button>

        {/* Block Options Context Menu */}
        {menuOpen && (
          <div
            className="dropdown-menu animate-popover block-options-menu"
            style={{
              position: 'absolute',
              left: '26px',
              top: '0',
              zIndex: 999
            }}
            onMouseLeave={() => {
              setMenuOpen(false);
              setTurnIntoOpen(false);
              setColorMenuOpen(false);
            }}
          >
            {/* Turn Into Submenu */}
            <div style={{ position: 'relative' }}>
              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px', justifyContent: 'space-between' }}
                onClick={() => {
                  setTurnIntoOpen((p) => !p);
                  setColorMenuOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={12} />
                  <span>Turn into</span>
                </div>
                <ChevronRight size={12} />
              </button>

              {turnIntoOpen && (
                <div className="dropdown-submenu animate-popover">
                  {TURN_INTO_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      className="sidebar-action-item"
                      style={{ fontSize: '12px' }}
                      onClick={() => {
                        turnIntoBlock(pageId, block.id, opt.type);
                        setTurnIntoOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color & Highlight Submenu */}
            <div style={{ position: 'relative' }}>
              <button
                className="sidebar-action-item"
                style={{ fontSize: '12px', justifyContent: 'space-between' }}
                onClick={() => {
                  setColorMenuOpen((p) => !p);
                  setTurnIntoOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Palette size={12} />
                  <span>Color</span>
                </div>
                <ChevronRight size={12} />
              </button>

              {colorMenuOpen && (
                <div className="dropdown-submenu animate-popover" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  <div className="ft-color-heading">Text Color</div>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.label}
                      className="sidebar-action-item"
                      style={{ fontSize: '12px' }}
                      onClick={() => {
                        setBlockColor(pageId, block.id, c.value, false);
                        setColorMenuOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="ft-color-circle" style={{ backgroundColor: c.color }} />
                      <span>{c.label}</span>
                    </button>
                  ))}

                  <div className="ft-color-heading" style={{ marginTop: '6px' }}>Background</div>
                  {BG_OPTIONS.map((bg) => (
                    <button
                      key={bg.label}
                      className="sidebar-action-item"
                      style={{ fontSize: '12px' }}
                      onClick={() => {
                        setBlockColor(pageId, block.id, bg.value, true);
                        setColorMenuOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="ft-color-rect" style={{ backgroundColor: bg.bg, border: '1px solid var(--border-color)' }} />
                      <span>{bg.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="sidebar-action-item"
              style={{ fontSize: '12px' }}
              onClick={() => {
                duplicateBlock(pageId, block.id);
                setMenuOpen(false);
              }}
            >
              <Copy size={12} />
              Duplicate
            </button>

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

            <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

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
      <div className={blockClass}>{renderBlockContent()}</div>

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
