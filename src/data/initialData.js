// Initial seed workspace data for Notion AI clone
// Showcases full block types, nested hierarchies, and multi-view databases

export const INITIAL_PAGES = [
  {
    id: 'page-welcome',
    title: 'Welcome to NoteThings',
    icon: '✨',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    parentId: null,
    isFavorite: true,
    inTrash: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000,
    blocks: [
      {
        id: 'b-1',
        type: 'callout',
        color: 'purple',
        icon: '🤖',
        content: 'Welcome to **NoteThings Connected Workspace**! Type `/` anywhere to insert blocks, highlight text to format, or press `Ctrl + K` to search across all your pages.'
      },
      {
        id: 'b-2',
        type: 'h1',
        content: 'The AI workspace that works for you'
      },
      {
        id: 'b-toc',
        type: 'toc',
        content: ''
      },
      {
        id: 'b-3',
        type: 'text',
        content: 'NoteThings treats every piece of information as an autonomous **Block**. Paragraphs, headings, code snippets, checklists, and even embedded databases can be edited, reorganized, and converted dynamically.'
      },
      {
        id: 'b-4',
        type: 'h2',
        content: '⚡ Quick Start Checklist'
      },
      {
        id: 'b-5',
        type: 'todo',
        checked: true,
        content: 'Explore the universal block editor with slash commands (`/`)'
      },
      {
        id: 'b-6',
        type: 'todo',
        checked: true,
        content: 'Test the floating formatting toolbar (Bold, Italic, Code, Color highlights)'
      },
      {
        id: 'b-7',
        type: 'todo',
        checked: false,
        content: 'Switch between Table, Kanban Board, List, Gallery, and Calendar database views'
      },
      {
        id: 'b-8',
        type: 'todo',
        checked: false,
        content: 'Launch the NoteThings AI Assistant in the top right to ask questions or summarize'
      },
      {
        id: 'b-9',
        type: 'h2',
        content: '💡 Tips & Keyboard Shortcuts'
      },
      {
        id: 'b-10',
        type: 'toggle',
        content: 'Click to expand keyboard shortcuts and markdown tricks',
        collapsed: false,
        children: [
          'Type `# ` for Heading 1, `## ` for Heading 2, `### ` for Heading 3',
          'Type `- ` or `* ` for bulleted list items',
          'Type `1. ` for numbered lists',
          'Type `[] ` for interactive checkboxes',
          'Type `> ` for block quotes, and `---` for horizontal dividers',
          'Press `Enter` on any block to create a new block below',
          'Press `Backspace` on an empty block to convert or remove it'
        ]
      },
      {
        id: 'b-11',
        type: 'quote',
        content: '"Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra'
      },
      {
        id: 'b-media-heading',
        type: 'h2',
        content: '🖼️ Media, Bookmarks & Math Equations'
      },
      {
        id: 'b-bookmark-1',
        type: 'bookmark',
        url: 'https://notion.so',
        title: 'Notion – Connected Workspace',
        desc: 'A new tool that blends your everyday work apps into one. It is the all-in-one workspace for you and your team.'
      },
      {
        id: 'b-image-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: 'Design aesthetics inspired by modern minimalist architecture.'
      },
      {
        id: 'b-math-1',
        type: 'math',
        content: 'E = mc^2 \\quad \\text{and} \\quad f(x) = \\int_{-\\infty}^\\infty e^{-x^2} dx'
      },
      {
        id: 'b-12',
        type: 'h2',
        content: '💻 Universal Block JSON Architecture'
      },
      {
        id: 'b-13',
        type: 'code',
        language: 'json',
        content: `{\n  "id": "block-101",\n  "type": "text",\n  "properties": {\n    "title": [["Every element is a polymorphic block."]]\n  },\n  "parent_id": "page-welcome",\n  "format": { "block_color": "blue_background" }\n}`
      },
      {
        id: 'b-14',
        type: 'divider',
        content: ''
      },
      {
        id: 'b-15',
        type: 'callout',
        color: 'blue',
        icon: '🚀',
        content: 'Ready to build? Click **+ New Page** in the sidebar or explore the **Product Roadmap 2026** database below.'
      }
    ]
  },
  {
    id: 'page-roadmap',
    title: 'Product Roadmap 2026',
    icon: '🎯',
    cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
    parentId: null,
    isFavorite: true,
    inTrash: false,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 7200000,
    blocks: [
      {
        id: 'rm-1',
        type: 'callout',
        color: 'orange',
        icon: '📌',
        content: 'Live multi-view database powering our Q1-Q4 product deliverables. Switch between **Table**, **Kanban Board**, **List**, **Gallery**, and **Calendar** views above the grid.'
      },
      {
        id: 'rm-2',
        type: 'database',
        databaseId: 'db-roadmap',
        content: 'Product Roadmap 2026'
      }
    ]
  },
  {
    id: 'page-eng-wiki',
    title: 'Engineering Wiki',
    icon: '📚',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    parentId: null,
    isFavorite: false,
    inTrash: false,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 14400000,
    blocks: [
      {
        id: 'ew-1',
        type: 'h1',
        content: 'Engineering Knowledge Base & Standards'
      },
      {
        id: 'ew-2',
        type: 'text',
        content: 'Central documentation repository for system architectures, deployment playbooks, and coding conventions.'
      },
      {
        id: 'ew-3',
        type: 'callout',
        color: 'green',
        icon: '🛡️',
        content: 'All architectural decision records (ADRs) must be reviewed by lead engineers before initiating sprint tasks.'
      },
      {
        id: 'ew-4',
        type: 'h2',
        content: 'Core Systems Overview'
      },
      {
        id: 'ew-5',
        type: 'bullet',
        content: '**Transaction Sync Gateway**: Optimistic offline mutation queues flushing via `saveTransactions`'
      },
      {
        id: 'ew-6',
        type: 'bullet',
        content: '**Polymorphic Database Engine**: High-performance in-memory projection with multi-indexing'
      },
      {
        id: 'ew-7',
        type: 'bullet',
        content: '**Semantic AI Vector Retrieval**: Pinecone vector indexes for semantic Q&A and auto-tagging'
      }
    ]
  },
  {
    id: 'page-block-model',
    title: 'Universal Block Data Model',
    icon: '🧩',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    parentId: 'page-eng-wiki',
    isFavorite: false,
    inTrash: false,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 28800000,
    blocks: [
      {
        id: 'bm-1',
        type: 'h1',
        content: 'Block Hierarchy Specification'
      },
      {
        id: 'bm-2',
        type: 'text',
        content: 'In NoteThings, every entity in the workspace inherits from the base Block specification. Pages are container blocks whose `content` array contains pointers to child block UUIDs.'
      },
      {
        id: 'bm-3',
        type: 'code',
        language: 'javascript',
        content: `// Polymorphic Block Interface\ninterface Block {\n  id: string;\n  type: 'text' | 'h1' | 'h2' | 'h3' | 'todo' | 'code' | 'quote' | 'callout' | 'database';\n  content: string;\n  properties?: Record<string, any>;\n  checked?: boolean;\n  color?: string;\n  icon?: string;\n  children?: string[];\n}`
      }
    ]
  },
  {
    id: 'page-meeting-notes',
    title: 'Weekly Sprint & AI Sync',
    icon: '📝',
    cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    parentId: null,
    isFavorite: false,
    inTrash: false,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 1800000,
    blocks: [
      {
        id: 'mn-1',
        type: 'h1',
        content: 'Weekly Engineering & Product Alignment'
      },
      {
        id: 'mn-2',
        type: 'callout',
        color: 'yellow',
        icon: '📅',
        content: 'Weekly sync every Monday at 10:00 AM UTC. Please review action items ahead of time.'
      },
      {
        id: 'mn-3',
        type: 'h2',
        content: 'Key Decisions & Action Items'
      },
      {
        id: 'mn-4',
        type: 'todo',
        checked: true,
        content: 'Deploy the new Slash Command menu with fuzzy search'
      },
      {
        id: 'mn-5',
        type: 'todo',
        checked: true,
        content: 'Integrate Pinecone vector store for workspace-wide semantic search'
      },
      {
        id: 'mn-6',
        type: 'todo',
        checked: false,
        content: 'Complete Dark Mode contrast verification for database pill badges'
      }
    ]
  }
];

export const INITIAL_DATABASES = {
  'db-roadmap': {
    id: 'db-roadmap',
    title: 'Product Roadmap 2026',
    activeView: 'table',
    properties: [
      { id: 'prop-title', name: 'Task / Feature', type: 'title' },
      { id: 'prop-status', name: 'Status', type: 'status', options: ['Not Started', 'In Progress', 'Under Review', 'Done'] },
      { id: 'prop-priority', name: 'Priority', type: 'select', options: ['Urgent', 'High', 'Medium', 'Low'] },
      { id: 'prop-assignee', name: 'Assignee', type: 'text' },
      { id: 'prop-date', name: 'Target Date', type: 'date' },
      { id: 'prop-tag', name: 'Domain', type: 'select', options: ['AI & Core', 'Frontend', 'Database Engine', 'Sync & Cloud'] }
    ],
    views: [
      { id: 'view-table', name: 'Table', type: 'table' },
      { id: 'view-board', name: 'Board', type: 'board' },
      { id: 'view-list', name: 'List', type: 'list' },
      { id: 'view-gallery', name: 'Gallery', type: 'gallery' },
      { id: 'view-calendar', name: 'Calendar', type: 'calendar' }
    ],
    rows: [
      {
        id: 'row-1',
        cells: {
          'prop-title': 'NoteThings AI Autonomous Agents Architecture',
          'prop-status': 'Done',
          'prop-priority': 'Urgent',
          'prop-assignee': 'Alex Rivera',
          'prop-date': '2026-10-28',
          'prop-tag': 'AI & Core'
        },
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'row-2',
        cells: {
          'prop-title': 'Universal Polymorphic Block Canvas Engine',
          'prop-status': 'Done',
          'prop-priority': 'High',
          'prop-assignee': 'Sophia Chen',
          'prop-date': '2026-10-31',
          'prop-tag': 'Frontend'
        },
        cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'row-3',
        cells: {
          'prop-title': 'Real-time Multi-View Database Projection',
          'prop-status': 'In Progress',
          'prop-priority': 'Urgent',
          'prop-assignee': 'Marcus Vance',
          'prop-date': '2026-11-05',
          'prop-tag': 'Database Engine'
        },
        cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'row-4',
        cells: {
          'prop-title': 'Pinecone Hybrid Semantic Vector Search RAG',
          'prop-status': 'In Progress',
          'prop-priority': 'High',
          'prop-assignee': 'Elena Rostova',
          'prop-date': '2026-11-12',
          'prop-tag': 'AI & Core'
        },
        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'row-5',
        cells: {
          'prop-title': 'Offline Transaction Queue & CRDT Reconciliation',
          'prop-status': 'Under Review',
          'prop-priority': 'Medium',
          'prop-assignee': 'Liam O\'Connor',
          'prop-date': '2026-11-18',
          'prop-tag': 'Sync & Cloud'
        },
        cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'row-6',
        cells: {
          'prop-title': 'Enterprise Audit Logs & Granular Permission Gates',
          'prop-status': 'Not Started',
          'prop-priority': 'Low',
          'prop-assignee': 'Priya Patel',
          'prop-date': '2026-11-25',
          'prop-tag': 'Sync & Cloud'
        },
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
};

export const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
];

export const PRESET_ICONS = [
  '✨', '🚀', '🎯', '📚', '💡', '📝', '⚡', '🤖',
  '🧩', '🛡️', '📅', '🔥', '⚙️', '📊', '🎨', '💼',
  '🌟', '🔍', '🌿', '☕', '💎', '📌', '🏆', '💻'
];

export const TEMPLATES = [
  {
    id: 'tmpl-sprint',
    title: 'Sprint Planning & Backlog',
    icon: '🏃‍♂️',
    category: 'Engineering',
    description: 'Track 2-week agile sprints, user stories, blockers, and team velocity.',
    blocks: [
      { id: 't-1', type: 'h1', content: 'Sprint 42: Execution & Velocity' },
      { id: 't-2', type: 'callout', color: 'blue', icon: '🎯', content: 'Sprint Goal: Finalize the AI Agent pipeline and multi-view database filters.' },
      { id: 't-3', type: 'h2', content: 'Sprint Backlog' },
      { id: 't-4', type: 'todo', checked: false, content: 'Implement Drag-and-drop card movement on Board view' },
      { id: 't-5', type: 'todo', checked: false, content: 'Add Pinecone vector search similarity thresholds' },
      { id: 't-6', type: 'todo', checked: false, content: 'Format export markdown headers and links' }
    ]
  },
  {
    id: 'tmpl-wiki',
    title: 'Team Knowledge Base',
    icon: '📖',
    category: 'Company',
    description: 'Onboarding guides, company culture, team directory, and technical docs.',
    blocks: [
      { id: 't-1', type: 'h1', content: 'Welcome to the Team!' },
      { id: 't-2', type: 'callout', color: 'purple', icon: '👋', content: 'Start here! Everything you need to get up and running during your first week.' },
      { id: 't-3', type: 'h2', content: 'First Week Milestones' },
      { id: 't-4', type: 'todo', checked: false, content: 'Set up development workspace & repository' },
      { id: 't-5', type: 'todo', checked: false, content: 'Read the Architecture Dossier and Block Spec' },
      { id: 't-6', type: 'todo', checked: false, content: 'Schedule 1-on-1 intro chats with team leads' }
    ]
  },
  {
    id: 'tmpl-okr',
    title: 'Company OKRs & Goals',
    icon: '🏆',
    category: 'Management',
    description: 'Quarterly Objectives and Key Results framework with progress tracking.',
    blocks: [
      { id: 't-1', type: 'h1', content: 'Q4 Strategic OKRs' },
      { id: 't-2', type: 'callout', color: 'green', icon: '📈', content: 'Objective: Accelerate product market fit with autonomous workspace intelligence.' },
      { id: 't-3', type: 'h2', content: 'Key Results' },
      { id: 't-4', type: 'bullet', content: 'KR 1: Increase daily active users by 35% through AI workflows' },
      { id: 't-5', type: 'bullet', content: 'KR 2: Maintain 99.99% sync uptime across regional clusters' },
      { id: 't-6', type: 'bullet', content: 'KR 3: Achieve sub-50ms editor block interaction latencies' }
    ]
  }
];
