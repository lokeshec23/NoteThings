import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { signInWithGoogle, signInAnonymously } from '../../lib/supabase';
import { X, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, HardDrive } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, user, setUser, signOut } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setAuthModalOpen(false);
    };
    if (authModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      // On success, Supabase redirects to Google consent page
    } catch (err) {
      console.warn('OAuth trigger returned error:', err);
      setErrorMsg(
        err.message?.includes('provider is not enabled') || err.message?.includes('validation_failed')
          ? 'Google OAuth provider is not yet enabled in your Supabase project dashboard. Go to Authentication > Providers > Google to add your Google Client ID & Secret, or use Local Guest Mode below.'
          : err.message || 'Failed to initiate Google sign-in.'
      );
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const anonUser = await signInAnonymously();
      if (anonUser) {
        setUser(anonUser);
        setAuthModalOpen(false);
        setLoading(false);
        return;
      }
    } catch (_e) {
      // Continue to local guest fallback
    }

    // Explicit local guest mode - strictly local storage, never bypassing server checks
    const localGuest = {
      id: 'local-guest-' + Date.now(),
      isGuest: true,
      email: 'guest@notethings.local',
      user_metadata: {
        full_name: 'Guest Workspace (Offline)',
        avatar_url: null
      }
    };
    setUser(localGuest);
    setAuthModalOpen(false);
    setLoading(false);
  };

  const isGuestUser = user?.isGuest || user?.is_anonymous || user?.id?.startsWith('local-guest');

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px'
      }}
      onClick={() => setAuthModalOpen(false)}
    >
      <div
        className="animate-popover"
        style={{
          width: 'min(420px, calc(100vw - 24px))',
          maxWidth: 'calc(100vw - 24px)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-floating)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          padding: 'clamp(16px, 4vw, 24px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #191919 0%, #37352f 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              NT
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>NoteThings Account</span>
          </div>
          <button className="header-btn" onClick={() => setAuthModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {user ? (
          // Logged in state
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }}
              />
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: isGuestUser ? 'var(--accent-orange)' : 'var(--accent-blue)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700
                }}
              >
                {isGuestUser ? 'G' : 'U'}
              </div>
            )}
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.user_metadata?.full_name || (isGuestUser ? 'Guest Workspace' : 'Authenticated User')}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {user.email || 'offline-storage'}
              </div>
            </div>

            {isGuestUser ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-orange)', fontWeight: 600 }}>
                  <HardDrive size={15} />
                  <span>Local Guest Workspace (Offline)</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Your workspace is stored locally in this browser. To back up to Supabase Cloud and sync across devices, connect with Google.
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  <ShieldCheck size={14} color="var(--accent-blue)" />
                  <span>Connect Google Account for Cloud Sync</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: 500 }}>
                <CheckCircle2 size={14} />
                <span>Cloud Sync Active (Protected with RLS)</span>
              </div>
            )}

            <button
              className="sidebar-action-item"
              style={{
                justifyContent: 'center',
                color: 'var(--accent-red)',
                border: '1px solid var(--border-color)',
                marginTop: '8px',
                padding: '8px 16px'
              }}
              onClick={() => {
                signOut();
                setAuthModalOpen(false);
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          // Logged out / Sign-in state
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Log in to NoteThings
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Sync your pages, databases, and AI agent workflows seamlessly across devices.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent-red-bg)',
                  border: '1px solid rgba(224, 62, 62, 0.2)',
                  fontSize: '12px',
                  color: 'var(--accent-red)',
                  marginBottom: '16px',
                  lineHeight: 1.4
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Official Google Sign-in Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
            >
              {/* Google 4-color SVG Icon */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Offline Guest Option */}
            <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or offline</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            </div>

            <button
              onClick={handleGuestAccess}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px dashed var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Sparkles size={14} color="var(--accent-purple)" />
              <span>Continue in Local Guest Mode</span>
            </button>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
              By continuing, you agree to NoteThings Terms of Service and Privacy Policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
