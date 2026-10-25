import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Sparkles,
  X,
  Send,
  FileText,
  CheckSquare,
  Lightbulb,
  Plus,
  Bot
} from 'lucide-react';
import './NotionAIAssistant.css';

export const NotionAIAssistant = () => {
  const {
    aiAssistantOpen,
    setAiAssistantOpen,
    currentPage,
    pages,
    databases,
    addBlock
  } = useWorkspace();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your **NoteThings AI Workspace Assistant**.\n\nI have full contextual awareness of your pages, database tasks, and engineering documentation. How can I help you today?'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (aiAssistantOpen) {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setAiAssistantOpen(false);
    };
    if (aiAssistantOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [messages, aiAssistantOpen, setAiAssistantOpen]);

  // Stream text character-by-character for realistic AI experience
  const streamResponse = (fullText) => {
    setIsStreaming(true);
    let currentIdx = 0;
    const streamMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, streamMessage]);

    const interval = setInterval(() => {
      currentIdx += 4;
      if (currentIdx >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
        setIsStreaming(false);
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: fullText.slice(0, currentIdx)
          };
          return updated;
        });
      }
    }, 18);
  };

  const handleSend = (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query || isStreaming) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    if (!textToSend) setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let responseText = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('summarize')) {
        responseText = `### Executive Summary: ${currentPage.title}\n\n` +
          `• **Core Focus**: This document covers "${currentPage.title}" with ${currentPage.blocks.length} organized content blocks.\n` +
          `• **Key Elements**: Contains interactive checklists, code architecture definitions, and strategic workflows.\n` +
          `• **Takeaway**: Ready for team alignment and sprint execution.`;
      } else if (qLower.includes('action item') || qLower.includes('todo')) {
        responseText = `### Action Items Identified for "${currentPage.title}":\n\n` +
          `[ ] Finalize the Universal Block Canvas rendering pipeline\n` +
          `[ ] Review CRDT transaction reconciliation rules\n` +
          `[ ] Verify Pinecone vector store semantic retrieval latency\n` +
          `[ ] Confirm status transitions in Kanban database view`;
      } else if (qLower.includes('brainstorm') || qLower.includes('idea')) {
        responseText = `### 💡 Strategic Brainstorming Ideas:\n\n` +
          `1. **AI Autonomous Agent Watchers**: Implement background workers that automatically summarize pull requests and assign tags.\n` +
          `2. **Bi-directional Backlink Graph**: Visual interactive graph view connecting related project pages.\n` +
          `3. **Formula 2.0 Calculation Engine**: Support rich multi-attribute formulas inside the Table Database view.\n` +
          `4. **Offline Mobile Sync Relay**: Edge worker synchronization using SQLite local caches.`;
      } else if (qLower.includes('roadmap') || qLower.includes('database') || qLower.includes('sprint')) {
        const db = databases['db-roadmap'];
        const completed = db.rows.filter((r) => r.cells['prop-status'] === 'Done').length;
        const inProgress = db.rows.filter((r) => r.cells['prop-status'] === 'In Progress').length;
        responseText = `### 📊 Product Roadmap Status (Q4 2026):\n\n` +
          `• **Total Deliverables**: ${db.rows.length} tracked features\n` +
          `• **Completed**: ${completed} tasks (${Math.round((completed / db.rows.length) * 100)}%)\n` +
          `• **In Flight**: ${inProgress} tasks actively in development\n` +
          `• **Immediate Priority**: *NoteThings AI Autonomous Agents Architecture* & *Universal Polymorphic Block Canvas Engine*.`;
      } else if (qLower.includes('translate')) {
        responseText = `### 🌐 Translated Content (Spanish):\n\n` +
          `**${currentPage.title}**\n\n` +
          `"El espacio de trabajo conectado que trabaja para usted. Capture contexto, encuentre respuestas y automatice tareas con inteligencia artificial integrada para su equipo."`;
      } else {
        // Universal workspace retrieval simulation
        const matchedPages = pages.filter((p) =>
          p.title.toLowerCase().includes(qLower) ||
          p.blocks.some((b) => (b.content || '').toLowerCase().includes(qLower))
        );

        if (matchedPages.length > 0) {
          responseText = `I searched your workspace and found relevant context in **${matchedPages.map((p) => p.title).join(', ')}**:\n\n` +
            `Based on your notes, ${matchedPages[0].title} directly addresses this topic. You can navigate to it from the sidebar or click its reference to inspect details.`;
        } else {
          responseText = `Based on your connected workspace context and best engineering practices, here is a structured breakdown:\n\n` +
            `1. **Architectural Cohesion**: Ensure all blocks adhere to the universal schema specification.\n` +
            `2. **State Decoupling**: Keep UI presentation decoupled from storage transaction queues.\n` +
            `3. **AI Integration**: Use vector embeddings in Pinecone for semantic retrieval over dense workspaces.\n\n` +
            `Would you like me to draft this into a new page or add it to "${currentPage.title}"?`;
        }
      }

      streamResponse(responseText);
    }, 400);
  };

  const handleInsertIntoPage = (text) => {
    const lastIdx = currentPage.blocks.length - 1;

    // Insert as callout or block
    addBlock(currentPage.id, lastIdx, {
      type: 'callout',
      color: 'purple',
      icon: '✨',
      content: `**NoteThings AI Generated:**\n${text}`
    });
  };

  if (!aiAssistantOpen) return null;

  return (
    <>
      <div
        className="ai-drawer-backdrop"
        onClick={() => setAiAssistantOpen(false)}
        aria-label="Close NoteThings AI drawer"
      />
      <aside className="ai-drawer-container animate-fade-in" aria-label="NoteThings AI Assistant">
      {/* Header */}
      <div className="ai-drawer-header">
        <div className="ai-header-title">
          <Sparkles size={16} color="var(--accent-purple)" />
          <span className="ai-sparkle-text">NoteThings AI</span>
          <span className="ai-badge">v2.0</span>
        </div>
        <button className="header-btn" onClick={() => setAiAssistantOpen(false)}>
          <X size={15} />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="ai-quick-tools">
        <span className="ai-tools-label">Current Page Tools</span>
        <div className="ai-tools-grid">
          <button
            className="ai-tool-chip"
            onClick={() => handleSend(`Summarize the page "${currentPage.title}"`)}
          >
            <FileText size={13} color="var(--accent-blue)" />
            <span>Summarize</span>
          </button>
          <button
            className="ai-tool-chip"
            onClick={() => handleSend('Extract action items from this document')}
          >
            <CheckSquare size={13} color="var(--accent-green)" />
            <span>Action items</span>
          </button>
          <button
            className="ai-tool-chip"
            onClick={() => handleSend('Brainstorm 4 creative strategic ideas')}
          >
            <Lightbulb size={13} color="var(--accent-yellow)" />
            <span>Brainstorm</span>
          </button>
          <button
            className="ai-tool-chip"
            onClick={() => handleSend('Summarize the Product Roadmap database status')}
          >
            <Bot size={13} color="var(--accent-purple)" />
            <span>Roadmap Q&A</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="ai-conversation-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message ${msg.role}`}>
            <div className={`ai-bubble ${msg.role}`}>
              {msg.content}
            </div>

            {msg.role === 'assistant' && idx > 0 && !isStreaming && (
              <div className="ai-actions-bar">
                <button
                  className="ai-action-btn-sm"
                  onClick={() => handleInsertIntoPage(msg.content)}
                  title="Insert AI content directly into current page"
                >
                  <Plus size={11} />
                  <span>Insert into page</span>
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>

      {/* Input Field Footer */}
      <div className="ai-input-footer">
        <div className="ai-input-wrapper">
          <textarea
            rows={2}
            className="ai-textarea"
            placeholder="Ask NoteThings AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <button
          className="ai-send-btn"
          disabled={!input.trim() || isStreaming}
          onClick={() => handleSend()}
        >
          <Send size={14} />
        </button>
      </div>
    </aside>
  </>
);
};
