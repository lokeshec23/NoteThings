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
  return (
    <div className="app-container">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <Header />
        <Editor />
      </div>

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
