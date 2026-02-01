import { WelcomeEmail } from '@hyo/services/email';
import { getResendClient } from '@hyo/services/resend';
import { createServerClient } from '@hyo/services/supabase';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
});

interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            validation.error.issues[0]?.message ||
            '입력값이 올바르지 않습니다.',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    const supabase = createServerClient();

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (!existing.is_active) {
        await supabase
          .from('subscribers')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        return NextResponse.json({
          success: true,
          message: '구독이 다시 활성화되었습니다!',
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: '이미 구독 중인 이메일입니다.',
          code: 'ALREADY_SUBSCRIBED',
        },
        { status: 409 },
      );
    }

    const { data: newSubscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert({ email: normalizedEmail })
      .select()
      .single();

    if (insertError || !newSubscriber) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          code: 'DATABASE_ERROR',
        },
        { status: 500 },
      );
    }

    try {
      const resend = getResendClient();
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || 'FinBrief <noreply@finbrief.io>';

      console.log('📧 Attempting to send welcome email...');
      console.log('From:', fromEmail);
      console.log('To:', normalizedEmail);

      const result = await resend.emails.send({
        from: fromEmail,
        to: normalizedEmail,
        subject: '환영합니다! FinBrief 구독이 시작되었습니다',
        react: WelcomeEmail({
          unsubscribeToken: newSubscriber.unsubscribe_token,
        }),
      });

      console.log('✅ Email sent successfully:', result);

      await supabase
        .from('subscribers')
        .update({ welcome_email_sent: true })
        .eq('id', newSubscriber.id);
    } catch (emailError) {
      console.error('❌ Welcome email failed:', emailError);
      console.error('Error details:', JSON.stringify(emailError, null, 2));
    }

    return NextResponse.json({
      success: true,
      message: '구독이 완료되었습니다! 환영 이메일을 확인해주세요.',
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}
