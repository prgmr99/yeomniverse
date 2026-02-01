import { createServerClient } from '@hyo/services/supabase';
import { createServerAuthClient } from '@hyo/services/supabase/auth';
import { type NextRequest, NextResponse } from 'next/server';

interface SuccessResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  error: string;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const authSupabase = await createServerAuthClient();
    const {
      data: { user },
      error: authError,
    } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get user's subscriber record
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // Verify ownership and soft delete
    const { data: watchlist, error: updateError } = await supabase
      .from('watchlists')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', subscriber.id)
      .select()
      .single();

    if (updateError || !watchlist) {
      console.error('Delete error:', updateError);
      return NextResponse.json(
        { error: '관심 목록 삭제 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: '관심 목록에서 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Watchlist DELETE error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
