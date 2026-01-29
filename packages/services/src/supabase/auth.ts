import {
  createBrowserClient as createSupabaseBrowserClient,
  createServerClient as createSupabaseServerClient,
} from '@supabase/ssr';
import { cookies } from 'next/headers';

// Browser client for client components
export function createBrowserAuthClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Server client for server components and route handlers
export async function createServerAuthClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component context
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Server Component context
          }
        },
      },
    },
  );
}

// Helper to get current user session
export async function getSession() {
  const supabase = await createServerAuthClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
}

// Helper to get current user
export async function getUser() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}
