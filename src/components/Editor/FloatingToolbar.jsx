import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Palette,
  ChevronDown
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

const TEXT_COLORS = [
  { name: 'Default', value: 'default', color: 'var(--text-primary)' },
  { name: 'Gray', value: 'color-gray', color: '#787774' },
  { name: 'Brown', value: 'color-brown', color: '#9f6b53' },
  { name: 'Orange', value: 'color-orange', color: '#d9730d' },
  { name: 'Yellow', value: 'color-yellow', color: '#cb912f' },
  { name: 'Green', value: 'color-green', color: '#448361' },
  { name: 'Blue', value: 'color-blue', color: '#2383e2' },
  { name: 'Purple', value: 'color-purple', color: '#9065b0' },
  { name: 'Pink', value: 'color-pink', color: '#c14c8a' },
  { name: 'Red', value: 'color-red', color: '#e03e3e' }
];

const BG_HIGHLIGHTS = [
  { name: 'Default Background', value: 'default', bg: 'transparent' },
  { name: 'Gray background', value: 'bg-tint-gray', bg: '#f1f1ef' },
  { name: 'Brown background', value: 'bg-tint-brown', bg: '#f4eeee' },
  { name: 'Orange background', value: 'bg-tint-orange', bg: '#fbecdd' },
  { name: 'Yellow background', value: 'bg-tint-yellow', bg: '#fbf3db' },
  { name: 'Green background', value: 'bg-tint-green', bg: '#edf3ec' },
  { name: 'Blue background', value: 'bg-tint-blue', bg: '#e7f3f8' },
  { name: 'Purple background', value: 'bg-tint-purple', bg: '#f6f0fc' },
  { name: 'Pink background', value: 'bg-tint-pink', bg: '#faf1f5' },
  { name: 'Red background', value: 'bg-tint-red', bg: '#fdebec' }
];

export const FloatingToolbar = () => {
  const { setAiAssistantOpen } = useWorkspace();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        if (!colorMenuOpen) {
          setVisible(false);
        }
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        if (!colorMenuOpen) {
          setVisible(false);
        }
        return;
      }

      // Check if selection is inside an editor block
      const anchorNode = selection.anchorNode;
      const editorBlocks = document.querySelector('.blocks-container');
      if (!editorBlocks || !editorBlocks.contains(anchorNode)) {
        setVisible(false);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const top = Math.max(10, rect.top - 48 + window.scrollY);
          const left = Math.max(10, Math.min(window.innerWidth - 380, rect.left + rect.width / 2 - 160));
          setPosition({ top, left });
          setVisible(true);
        }
      } catch {
        // Selection range query fallback
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [colorMenuOpen]);

  // Wrap or format selected text inside active textarea
  const formatSelection = (prefix, suffix = prefix) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      const val = activeEl.value;
      const selected = val.substring(start, end);
      const replacement = `${prefix}${selected}${suffix}`;
      
      activeEl.setRangeText(replacement, start, end, 'select');
      const event = new Event('input', { bubbles: true });
      activeEl.dispatchEvent(event);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://notion.so):');
    if (url) {
      formatSelection('[', `](${url})`);
    }
  };

  const handleColorSelect = (colorClass) => {
    formatSelection(`<span class="${colorClass}">`, `</span>`);
    setColorMenuOpen(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      className="floating-toolbar animate-popover"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {/* Ask AI Pill */}
      <button
        className="ft-btn ft-ai-btn"
        onClick={() => setAiAssistantOpen(true)}
        title="Ask NoteThings AI about this text"
      >
        <Sparkles size={13} color="var(--accent-purple)" />
        <span>Ask AI</span>
      </button>

      <div className="ft-divider" />

      {/* Formatting Tools */}
      <button
        className="ft-btn"
        onClick={() => formatSelection('**')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={13} />
      </button>
      <button
        className="ft-btn"
        onClick={() => formatSelection('*')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={13} />
      </button>
      <button
        className="ft-btn"
        onClick={() => formatSelection('~~')}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </button>
      <button
        className="ft-btn"
        onClick={() => formatSelection('`')}
        title="Inline Code"
      >
        <Code size={13} />
      </button>
      <button
        className="ft-btn"
        onClick={handleLink}
        title="Add Link"
      >
        <Link size={13} />
      </button>

      <div className="ft-divider" />

      {/* Color & Highlight Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          className="ft-btn"
          onClick={() => setColorMenuOpen((prev) => !prev)}
          title="Color & Highlight"
        >
          <Palette size={13} />
          <ChevronDown size={10} />
        </button>

        {colorMenuOpen && (
          <div
            className="ft-color-menu animate-popover"
            onMouseLeave={() => setColorMenuOpen(false)}
          >
            <div className="ft-color-heading">Color</div>
            {TEXT_COLORS.map((c) => (
              <button
                key={c.name}
                className="ft-color-item"
                onClick={() => handleColorSelect(c.value)}
              >
                <span className="ft-color-circle" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
              </button>
            ))}

            <div className="ft-color-heading" style={{ marginTop: '8px' }}>Background</div>
            {BG_HIGHLIGHTS.map((bg) => (
              <button
                key={bg.name}
                className="ft-color-item"
                onClick={() => handleColorSelect(bg.value)}
              >
                <span className="ft-color-rect" style={{ backgroundColor: bg.bg, border: '1px solid var(--border-color)' }} />
                <span>{bg.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
