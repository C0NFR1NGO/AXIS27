import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!supabase);
  const profileInFlight = useRef(null);

  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  }, []);

  const ensureProfile = useCallback(async (sessionUser) => {
    if (!supabase || !sessionUser) return null;

    if (profileInFlight.current) return profileInFlight.current;

    const promise = (async () => {
      let prof = await fetchProfile(sessionUser.id);

      if (!prof) {
        const meta = sessionUser.user_metadata || {};
        const fullName = meta.full_name || meta.name || '';
        const avatarUrl = meta.avatar_url || meta.picture || '';

        let axisId = null;
        try {
          const { data } = await supabase.rpc('claim_axis_id');
          axisId = data;
        } catch {
          axisId = null;
        }

        try {
          const { data, error } = await supabase
            .from('profiles')
            .upsert({
              id: sessionUser.id,
              axis_id: axisId,
              full_name: fullName,
              email: sessionUser.email || '',
              avatar_url: avatarUrl,
            }, { onConflict: 'id' })
            .select()
            .maybeSingle();
          if (error) throw error;
          prof = data;
        } catch {
          prof = {
            id: sessionUser.id,
            axis_id: axisId,
            full_name: fullName,
            email: sessionUser.email || '',
            avatar_url: avatarUrl,
          };
        }
      }

      return prof;
    })();

    profileInFlight.current = promise;
    const result = await promise;
    profileInFlight.current = null;
    return result;
  }, [fetchProfile]);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const prof = await ensureProfile(session.user);
        setProfile(prof);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const prof = await ensureProfile(session.user);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [ensureProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const retryAxisId = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      const { data: axisId } = await supabase.rpc('claim_axis_id');
      if (!axisId) return;
      const { data } = await supabase
        .from('profiles')
        .update({ axis_id: axisId })
        .eq('id', user.id)
        .select()
        .maybeSingle();
      if (data) setProfile(data);
    } catch {
      // silently fail
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, retryAxisId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
