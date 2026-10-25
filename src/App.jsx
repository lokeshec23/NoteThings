import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { Editor } from './components/Editor/Editor';
import { NotionAIAssistant } from './components/NotionAI/NotionAIAssistant';
import { SearchModal } from './components/Modals/SearchModal';
import { TemplatesModal } from './components/Modals/TemplatesModal';
import { TrashModal } from './components/Modals/TrashModal';
import { AuthModal } from './components/Modals/AuthModal';

const MainLayout = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useWorkspace();

  return (
    <div className="app-container">
      {/* Mobile Backdrop when Sidebar Drawer is Open */}
      {!sidebarCollapsed && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarCollapsed(true)}
          aria-label="Close sidebar"
        />
      )}

      <Sidebar />

      <main className="main-content-layout">
        <Header />
        <Editor />
      </main>

      {/* Notion AI Drawer */}
      <NotionAIAssistant />

      {/* Modals */}
      <SearchModal />
      <TemplatesModal />
      <TrashModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <MainLayout />
    </WorkspaceProvider>
  );
}
