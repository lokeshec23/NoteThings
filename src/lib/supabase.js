import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== AUTHENTICATION ====================

// Sign in with Google OAuth via Supabase
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Google sign in error:', err);
    throw err;
  }
};

// Sign in anonymously for server-authenticated guest session
export const signInAnonymously = async () => {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.user;
  } catch (err) {
    console.warn('Supabase anonymous sign-in not enabled:', err.message);
    return null;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('Sign out error:', err);
    throw err;
  }
};

// Get current session/user
export const getInitialUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session?.user || null;
  } catch (err) {
    return null;
  }
};

// Subscribe to auth state changes
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });
  return subscription;
};

// Fetch pages from Supabase for current authenticated user
export const fetchCloudPages = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return null;

    const { data, error } = await supabase
      .from('notion_pages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetch pages warning:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      icon: row.icon,
      cover: row.cover,
      parentId: row.parent_id,
      isFavorite: row.is_favorite,
      inTrash: row.in_trash,
      createdAt: new Date(row.created_at).getTime(),
      updatedAt: new Date(row.updated_at).getTime(),
      blocks: row.blocks || []
    }));
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
};

// Upsert page to Supabase with user_id binding (IDOR protection)
export const upsertCloudPage = async (page) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return; // Only persist to cloud if user is legitimately authenticated

    const { error } = await supabase.from('notion_pages').upsert(
      {
        id: page.id,
        user_id: session.user.id,
        title: page.title,
        icon: page.icon,
        cover: page.cover,
        parent_id: page.parentId,
        is_favorite: page.isFavorite,
        in_trash: page.inTrash,
        blocks: page.blocks,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase upsert page error:', error.message);
  } catch (err) {
    console.error('Supabase upsert error:', err);
  }
};

// Delete page from Supabase with user_id verification
export const deleteCloudPage = async (pageId) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from('notion_pages')
      .delete()
      .eq('id', pageId)
      .eq('user_id', session.user.id);
    if (error) console.warn('Supabase delete page error:', error.message);
  } catch (err) {
    console.error('Supabase delete error:', err);
  }
};

// Fetch databases from Supabase for current authenticated user
export const fetchCloudDatabases = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return null;

    const { data, error } = await supabase
      .from('notion_databases')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.warn('Supabase fetch databases warning:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;

    const dbMap = {};
    data.forEach((row) => {
      dbMap[row.id] = {
        id: row.id,
        title: row.title,
        activeView: row.active_view,
        properties: row.properties || [],
        views: row.views || [],
        rows: row.rows || []
      };
    });
    return dbMap;
  } catch (err) {
    console.error('Supabase fetch databases error:', err);
    return null;
  }
};

// Upsert database to Supabase with user_id binding (IDOR protection)
export const upsertCloudDatabase = async (db) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase.from('notion_databases').upsert(
      {
        id: db.id,
        user_id: session.user.id,
        title: db.title,
        active_view: db.activeView,
        properties: db.properties,
        views: db.views,
        rows: db.rows,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );
    if (error) console.warn('Supabase upsert database error:', error.message);
  } catch (err) {
    console.error('Supabase upsert database error:', err);
  }
};

// Delete database from Supabase with user_id verification
export const deleteCloudDatabase = async (dbId) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from('notion_databases')
      .delete()
      .eq('id', dbId)
      .eq('user_id', session.user.id);
    if (error) console.warn('Supabase delete database error:', error.message);
  } catch (err) {
    console.error('Supabase delete database error:', err);
  }
};
