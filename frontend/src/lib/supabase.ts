import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Type for database schema (will be expanded as features are implemented)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          email: string;
          full_name: string;
          github_username: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'user_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      ai_tools: {
        Row: {
          tool_id: string;
          user_id: string;
          tool_name: string;
          provider: string;
          api_key_encrypted: string;
          status: 'connected' | 'disconnected' | 'error';
          connected_at: string;
          last_synced_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['ai_tools']['Row'], 'tool_id' | 'connected_at'>;
        Update: Partial<Database['public']['Tables']['ai_tools']['Insert']>;
      };
      challenges: {
        Row: {
          challenge_id: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'developing' | 'accomplished' | 'expert';
          category: string;
          estimated_time: number;
          skills_tested: string[];
          requirements: string[];
          starter_code: string | null;
          test_cases: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['challenges']['Row'], 'challenge_id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['challenges']['Insert']>;
      };
      aiq_assessments: {
        Row: {
          aiq_assessment_id: string;
          user_id: string;
          answers: number[];
          aiq_type: string;
          confidence_level: number;
          capabilities: Record<string, number>;
          completed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['aiq_assessments']['Row'], 'aiq_assessment_id' | 'completed_at'>;
        Update: Partial<Database['public']['Tables']['aiq_assessments']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

// Create Supabase client (only if not in mock mode)
let supabase: SupabaseClient<Database> | null = null;

if (!isMockMode && supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Get Supabase client
 * Returns null if in mock mode or if credentials are not configured
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (isMockMode) {
    console.warn('Running in MOCK MODE - Supabase client disabled');
    return null;
  }

  if (!supabase) {
    console.error('Supabase client not initialized. Check environment variables.');
    return null;
  }

  return supabase;
}

/**
 * Check if application is running in mock mode
 */
export function isMock(): boolean {
  return isMockMode;
}

/**
 * Get current user from Supabase Auth
 * Returns null in mock mode
 */
export async function getCurrentUser() {
  if (isMockMode) {
    // Mock user for development
    return {
      user_id: 'mock-user-1',
      email: 'mock@example.com',
      full_name: 'Mock User',
      github_username: 'mockuser',
      linkedin_url: null,
    };
  }

  const client = getSupabaseClient();
  if (!client) return null;

  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;

  // Fetch user profile from database
  const { data: profile } = await client
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
}

/**
 * Sign in with email and password
 * Returns mock success in mock mode
 */
export async function signIn(email: string, password: string) {
  if (isMockMode) {
    console.log('[MOCK] Sign in:', email);
    return {
      data: {
        user: {
          id: 'mock-user-1',
          email,
        },
        session: {
          access_token: 'mock-token',
        },
      },
      error: null,
    };
  }

  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  return await client.auth.signInWithPassword({ email, password });
}

/**
 * Sign out current user
 * Returns mock success in mock mode
 */
export async function signOut() {
  if (isMockMode) {
    console.log('[MOCK] Sign out');
    return { error: null };
  }

  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  return await client.auth.signOut();
}

/**
 * Sign up new user
 * Returns mock success in mock mode
 */
export async function signUp(email: string, password: string, fullName: string) {
  if (isMockMode) {
    console.log('[MOCK] Sign up:', email, fullName);
    return {
      data: {
        user: {
          id: 'mock-user-new',
          email,
        },
        session: null,
      },
      error: null,
    };
  }

  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not available');

  // Sign up with Supabase Auth
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) return { data, error };

  // Create user profile in database
  const { error: profileError } = await client
    .from('users')
    .insert({
      email,
      full_name: fullName,
      github_username: null,
      linkedin_url: null,
    });

  if (profileError) {
    console.error('Failed to create user profile:', profileError);
  }

  return { data, error };
}

// Export the client for direct usage (will be null in mock mode)
export default supabase;
