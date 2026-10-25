import React, { useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { Editor } from './components/Editor/Editor';
import { NotionAIAssistant } from './components/NotionAI/NotionAIAssistant';
import { SearchModal } from './components/Modals/SearchModal';
import { TemplatesModal } from './components/Modals/TemplatesModal';
import { TrashModal } from './components/Modals/TrashModal';
import { AuthModal } from './components/Modals/AuthModal';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from './lib/supabase';

const MainLayout = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    authModalOpen,
    setAuthModalOpen,
    searchModalOpen,
    setSearchModalOpen,
    templatesModalOpen,
    setTemplatesModalOpen,
    trashModalOpen,
    setTrashModalOpen,
    aiAssistantOpen,
    setAiAssistantOpen,
    setUser
  } = useWorkspace();

  // Listen for Native Deep Link (OAuth Redirect from Supabase / Google on Android)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let appUrlSub = null;
    CapApp.addListener('appUrlOpen', async (event) => {
      if (
        event.url &&
        (event.url.includes('login-callback') ||
          event.url.includes('access_token') ||
          event.url.includes('code='))
      ) {
        try {
          await Browser.close();
        } catch (_e) {}

        try {
          const cleanUrl = event.url.replace('#', '?');
          const urlObj = new URL(cleanUrl);
          const accessToken = urlObj.searchParams.get('access_token');
          const refreshToken = urlObj.searchParams.get('refresh_token');
          const code = urlObj.searchParams.get('code');

          if (accessToken && refreshToken) {
            const { data } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (data?.session?.user) {
              setUser(data.session.user);
              setAuthModalOpen(false);
            }
          } else if (code) {
            const { data } = await supabase.auth.exchangeCodeForSession(code);
            if (data?.session?.user) {
              setUser(data.session.user);
              setAuthModalOpen(false);
            }
          }
        } catch (err) {
          console.error('Failed to parse OAuth deep link:', err);
        }
      }
    }).then((sub) => {
      appUrlSub = sub;
    });

    return () => {
      if (appUrlSub) appUrlSub.remove();
    };
  }, [setUser, setAuthModalOpen]);

  // Android Hardware Back Button Navigation
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backButtonSub = null;
    CapApp.addListener('backButton', () => {
      if (authModalOpen) {
        setAuthModalOpen(false);
      } else if (searchModalOpen) {
        setSearchModalOpen(false);
      } else if (templatesModalOpen) {
        setTemplatesModalOpen(false);
      } else if (trashModalOpen) {
        setTrashModalOpen(false);
      } else if (aiAssistantOpen) {
        setAiAssistantOpen(false);
      } else if (!sidebarCollapsed) {
        setSidebarCollapsed(true);
      } else {
        CapApp.exitApp();
      }
    }).then((sub) => {
      backButtonSub = sub;
    });

    return () => {
      if (backButtonSub) backButtonSub.remove();
    };
  }, [
    authModalOpen,
    searchModalOpen,
    templatesModalOpen,
    trashModalOpen,
    aiAssistantOpen,
    sidebarCollapsed,
    setAuthModalOpen,
    setSearchModalOpen,
    setTemplatesModalOpen,
    setTrashModalOpen,
    setAiAssistantOpen,
    setSidebarCollapsed
  ]);

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

      {/* Mobile Thumb-Friendly Bottom Navigation Bar */}
      <MobileBottomNav />

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
