import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || '입력값이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );

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
        { error: '로그인 링크 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '로그인 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
