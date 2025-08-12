export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');

    // Remove all Supabase-related keys in localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        try { localStorage.removeItem(key); } catch {}
      }
    });

    // Remove from sessionStorage if present
    try {
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          try { sessionStorage.removeItem(key); } catch {}
        }
      });
    } catch {}
  } catch {}
};
