import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            validation.error.issues[0]?.message ||
            'Invalid input.',
        },
        { status: 400 },
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured.' },
        { status: 500 },
      );
    }

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic link send error:', error);
      return NextResponse.json(
        {
          error: 'Failed to send sign-in link. Please try again later.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'A sign-in link has been sent to your email. Please check your inbox.',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'A server error occurred.' },
      { status: 500 },
    );
  }
}
