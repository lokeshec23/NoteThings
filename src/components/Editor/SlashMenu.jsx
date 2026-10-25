import React, { useState, useEffect, useRef } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  ChevronRight,
  Code,
  Quote,
  Minus,
  Sparkles,
  Info,
  Table,
  Kanban
} from 'lucide-react';

const COMMANDS = [
  // NoteThings AI Actions
  {
    id: 'ai-ask',
    title: 'Ask NoteThings AI',
    desc: 'Generate, write, or query with AI',
    icon: <Sparkles size={16} color="var(--accent-purple)" />,
    category: 'NoteThings AI',
    action: { type: 'ai' }
  },
  {
    id: 'ai-summarize',
    title: 'Summarize',
    desc: 'Create an executive summary',
    icon: <Sparkles size={16} color="var(--accent-purple)" />,
    category: 'NoteThings AI',
    action: { type: 'ai-summarize' }
  },
  // Basic Blocks
  {
    id: 'cmd-text',
    title: 'Text',
    desc: 'Just start writing with plain text.',
    icon: <Type size={16} />,
    category: 'Basic Blocks',
    action: { type: 'text' }
  },
  {
    id: 'cmd-h1',
    title: 'Heading 1',
    desc: 'Big section heading.',
    icon: <Heading1 size={16} />,
    category: 'Basic Blocks',
    action: { type: 'h1' }
  },
  {
    id: 'cmd-h2',
    title: 'Heading 2',
    desc: 'Medium section heading.',
    icon: <Heading2 size={16} />,
    category: 'Basic Blocks',
    action: { type: 'h2' }
  },
  {
    id: 'cmd-h3',
    title: 'Heading 3',
    desc: 'Small section heading.',
    icon: <Heading3 size={16} />,
    category: 'Basic Blocks',
    action: { type: 'h3' }
  },
  {
    id: 'cmd-todo',
    title: 'To-do list',
    desc: 'Track tasks with a to-do list.',
    icon: <CheckSquare size={16} />,
    category: 'Basic Blocks',
    action: { type: 'todo' }
  },
  {
    id: 'cmd-bullet',
    title: 'Bulleted list',
    desc: 'Create a simple bulleted list.',
    icon: <List size={16} />,
    category: 'Basic Blocks',
    action: { type: 'bullet' }
  },
  {
    id: 'cmd-number',
    title: 'Numbered list',
    desc: 'Create a list with numbering.',
    icon: <ListOrdered size={16} />,
    category: 'Basic Blocks',
    action: { type: 'number' }
  },
  {
    id: 'cmd-toggle',
    title: 'Toggle list',
    desc: 'Toggles hide and show content inside.',
    icon: <ChevronRight size={16} />,
    category: 'Basic Blocks',
    action: { type: 'toggle', children: ['Sub-item in toggle'] }
  },
  {
    id: 'cmd-code',
    title: 'Code',
    desc: 'Capture a code snippet with syntax styling.',
    icon: <Code size={16} />,
    category: 'Basic Blocks',
    action: { type: 'code', language: 'javascript' }
  },
  {
    id: 'cmd-quote',
    title: 'Quote',
    desc: 'Capture a quote or citation.',
    icon: <Quote size={16} />,
    category: 'Basic Blocks',
    action: { type: 'quote' }
  },
  {
    id: 'cmd-callout',
    title: 'Callout',
    desc: 'Make writing stand out with an icon & tint.',
    icon: <Info size={16} />,
    category: 'Basic Blocks',
    action: { type: 'callout', color: 'blue', icon: '💡' }
  },
  {
    id: 'cmd-divider',
    title: 'Divider',
    desc: 'Visually divide blocks with a thin line.',
    icon: <Minus size={16} />,
    category: 'Basic Blocks',
    action: { type: 'divider' }
  },
  // Database Blocks
  {
    id: 'cmd-table',
    title: 'Table Database',
    desc: 'Organize data into rows and columns.',
    icon: <Table size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap' }
  },
  {
    id: 'cmd-board',
    title: 'Board Database',
    desc: 'Kanban view grouped by status.',
    icon: <Kanban size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap' }
  }
];

export const SlashMenu = ({ query = '', onSelect, onClose, position = { top: 0, left: 0 } }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  // Filter commands
  const cleanQuery = query.toLowerCase().replace('/', '').trim();
  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(cleanQuery) ||
      cmd.desc.toLowerCase().includes(cleanQuery) ||
      cmd.category.toLowerCase().includes(cleanQuery)
  );

  const activeIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          onSelect(filtered[activeIndex].action);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, activeIndex, onSelect, onClose]);

  if (filtered.length === 0) {
    return (
      <div className="slash-menu animate-popover" style={{ top: position.top, left: position.left }}>
        <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
          No matching commands
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu animate-popover"
      style={{ top: position.top, left: position.left }}
    >
      {filtered.map((cmd, idx) => {
        const showCategory = idx === 0 || filtered[idx - 1].category !== cmd.category;
        const isSelected = idx === activeIndex;

        return (
          <React.Fragment key={cmd.id}>
            {showCategory && <div className="slash-menu-group-title">{cmd.category}</div>}
            <div
              className={`slash-menu-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(cmd.action)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="slash-item-icon">{cmd.icon}</div>
              <div className="slash-item-text">
                <span className="slash-item-title">{cmd.title}</span>
                <span className="slash-item-desc">{cmd.desc}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
