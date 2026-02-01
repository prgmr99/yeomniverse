import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (code && supabaseUrl && supabaseAnonKey) {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Link auth user to subscriber record if exists
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const { createServerClient: createAdminClient } = await import(
          '@hyo/services/supabase'
        );
        const adminSupabase = createAdminClient();

        await adminSupabase
          .from('subscribers')
          .update({ auth_user_id: user.id })
          .eq('email', user.email.toLowerCase());
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
