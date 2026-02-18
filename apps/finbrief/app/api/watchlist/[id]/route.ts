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
        { error: 'Authentication required.' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get user's subscriber record
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
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
        { error: 'An error occurred while deleting from watchlist.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist.',
    });
  } catch (error) {
    console.error('Watchlist DELETE error:', error);
    return NextResponse.json(
      { error: 'A server error occurred.' },
      { status: 500 },
    );
  }
}
