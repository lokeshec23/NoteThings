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
  Kanban,
  ClipboardList,
  Calendar,
  LayoutGrid,
  ListTree,
  Image as ImageIcon,
  Bookmark as BookmarkIcon,
  Sigma,
  Wand2
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
    title: 'Summarize Page',
    desc: 'Generate an executive summary with AI',
    icon: <Wand2 size={16} color="var(--accent-purple)" />,
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
  // Advanced & Media Blocks
  {
    id: 'cmd-toc',
    title: 'Table of Contents',
    desc: 'Display an indented index of headings.',
    icon: <ListTree size={16} color="var(--accent-purple)" />,
    category: 'Advanced Blocks',
    action: { type: 'toc' }
  },
  {
    id: 'cmd-image',
    title: 'Image',
    desc: 'Upload or embed with a link.',
    icon: <ImageIcon size={16} color="var(--accent-blue)" />,
    category: 'Media & Embeds',
    action: { type: 'image' }
  },
  {
    id: 'cmd-bookmark',
    title: 'Web Bookmark',
    desc: 'Save a link with visual web card preview.',
    icon: <BookmarkIcon size={16} color="var(--accent-purple)" />,
    category: 'Media & Embeds',
    action: { type: 'bookmark' }
  },
  {
    id: 'cmd-math',
    title: 'Math Equation',
    desc: 'Display mathematical formula and TeX symbols.',
    icon: <Sigma size={16} color="var(--accent-green)" />,
    category: 'Advanced Blocks',
    action: { type: 'math' }
  },
  // Database Blocks
  {
    id: 'cmd-table',
    title: 'Table Database',
    desc: 'Organize data into rows and columns.',
    icon: <Table size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap', layout: 'table' }
  },
  {
    id: 'cmd-form',
    title: 'Form Database',
    desc: 'Form builder to collect and log responses into tables.',
    icon: <ClipboardList size={16} color="var(--accent-purple)" />,
    category: 'Database Views',
    action: { type: 'database', layout: 'form' }
  },
  {
    id: 'cmd-board',
    title: 'Board Database',
    desc: 'Kanban view grouped by status.',
    icon: <Kanban size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap', layout: 'board' }
  },
  {
    id: 'cmd-list',
    title: 'List Database',
    desc: 'Clean item list overview with tags.',
    icon: <List size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap', layout: 'list' }
  },
  {
    id: 'cmd-calendar',
    title: 'Calendar Database',
    desc: 'Monthly schedule view by target date.',
    icon: <Calendar size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap', layout: 'calendar' }
  },
  {
    id: 'cmd-gallery',
    title: 'Gallery Database',
    desc: 'Visual card showcase grid with cover images.',
    icon: <LayoutGrid size={16} />,
    category: 'Database Views',
    action: { type: 'database', databaseId: 'db-roadmap', layout: 'gallery' }
  }
];

export const SlashMenu = ({ query = '', onSelect, onClose, position = { top: 0, left: 0 } }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  // Filter commands
  const cleanQuery = query.toLowerCase().replace('/', '').trim();
  const filtered = COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(cleanQuery) ||
      c.desc.toLowerCase().includes(cleanQuery) ||
      c.category.toLowerCase().includes(cleanQuery)
  );

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].action);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, selectedIndex, onSelect, onClose]);

  // Group commands by category
  const categories = Array.from(new Set(filtered.map((c) => c.category)));

  if (filtered.length === 0) {
    return (
      <div className="slash-menu-container animate-popover" style={position} ref={menuRef}>
        <div className="slash-empty">No matching commands found</div>
      </div>
    );
  }

  return (
    <div className="slash-menu-container animate-popover" style={position} ref={menuRef}>
      <div className="slash-menu-scroll">
        {categories.map((category) => {
          const items = filtered.filter((c) => c.category === category);
          return (
            <div key={category} className="slash-category-group">
              <div className="slash-category-title">{category}</div>
              {items.map((cmd) => {
                const idx = filtered.indexOf(cmd);
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    className={`slash-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelect(cmd.action)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="slash-item-icon">{cmd.icon}</div>
                    <div className="slash-item-text">
                      <div className="slash-item-title">{cmd.title}</div>
                      <div className="slash-item-desc">{cmd.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
