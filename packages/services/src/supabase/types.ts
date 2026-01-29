export interface Database {
  public: {
    Tables: {
      subscribers: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          welcome_email_sent: boolean;
          unsubscribe_token: string;
          auth_user_id: string | null;
          plan_id: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          welcome_email_sent?: boolean;
          unsubscribe_token?: string;
          auth_user_id?: string | null;
          plan_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          welcome_email_sent?: boolean;
          unsubscribe_token?: string;
          auth_user_id?: string | null;
          plan_id?: string | null;
        };
      };
      plans: {
        Row: {
          id: string;
          name: 'free' | 'basic' | 'pro';
          display_name: string;
          price_monthly: number;
          max_watchlist: number;
          features: PlanFeatures;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: 'free' | 'basic' | 'pro';
          display_name: string;
          price_monthly: number;
          max_watchlist: number;
          features: PlanFeatures;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: 'free' | 'basic' | 'pro';
          display_name?: string;
          price_monthly?: number;
          max_watchlist?: number;
          features?: PlanFeatures;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          ls_subscription_id: string | null;
          ls_customer_id: string | null;
          ls_variant_id: string | null;
          status: 'active' | 'cancelled' | 'past_due' | 'paused';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          grace_period_start: string | null;
          retry_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          ls_variant_id?: string | null;
          status?: 'active' | 'cancelled' | 'past_due' | 'paused';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          grace_period_start?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          ls_variant_id?: string | null;
          status?: 'active' | 'cancelled' | 'past_due' | 'paused';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          grace_period_start?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          name: string;
          market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ';
          is_active: boolean;
          alert_enabled: boolean;
          alert_price_above: number | null;
          alert_price_below: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          name: string;
          market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ';
          is_active?: boolean;
          alert_enabled?: boolean;
          alert_price_above?: number | null;
          alert_price_below?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          name?: string;
          market?: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ';
          is_active?: boolean;
          alert_enabled?: boolean;
          alert_price_above?: number | null;
          alert_price_below?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stock_analyses: {
        Row: {
          id: string;
          symbol: string;
          analysis_date: string;
          price: number;
          change_percent: number | null;
          volume: number | null;
          rsi: number | null;
          macd: number | null;
          macd_signal: number | null;
          sma_5: number | null;
          sma_20: number | null;
          sma_60: number | null;
          bollinger_upper: number | null;
          bollinger_lower: number | null;
          ai_signal: 'buy' | 'hold' | 'sell' | null;
          ai_strength: number | null;
          ai_summary: string | null;
          ai_analysis: string | null;
          ai_key_points: string[] | null;
          related_news: RelatedNews[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          symbol: string;
          analysis_date: string;
          price: number;
          change_percent?: number | null;
          volume?: number | null;
          rsi?: number | null;
          macd?: number | null;
          macd_signal?: number | null;
          sma_5?: number | null;
          sma_20?: number | null;
          sma_60?: number | null;
          bollinger_upper?: number | null;
          bollinger_lower?: number | null;
          ai_signal?: 'buy' | 'hold' | 'sell' | null;
          ai_strength?: number | null;
          ai_summary?: string | null;
          ai_analysis?: string | null;
          ai_key_points?: string[] | null;
          related_news?: RelatedNews[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          symbol?: string;
          analysis_date?: string;
          price?: number;
          change_percent?: number | null;
          volume?: number | null;
          rsi?: number | null;
          macd?: number | null;
          macd_signal?: number | null;
          sma_5?: number | null;
          sma_20?: number | null;
          sma_60?: number | null;
          bollinger_upper?: number | null;
          bollinger_lower?: number | null;
          ai_signal?: 'buy' | 'hold' | 'sell' | null;
          ai_strength?: number | null;
          ai_summary?: string | null;
          ai_analysis?: string | null;
          ai_key_points?: string[] | null;
          related_news?: RelatedNews[] | null;
          created_at?: string;
        };
      };
      payment_logs: {
        Row: {
          id: string;
          subscription_id: string | null;
          ls_order_id: string | null;
          ls_invoice_id: string | null;
          amount: number;
          currency: string;
          status: 'success' | 'failed' | 'refunded';
          webhook_payload: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id?: string | null;
          ls_order_id?: string | null;
          ls_invoice_id?: string | null;
          amount: number;
          currency?: string;
          status: 'success' | 'failed' | 'refunded';
          webhook_payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subscription_id?: string | null;
          ls_order_id?: string | null;
          ls_invoice_id?: string | null;
          amount?: number;
          currency?: string;
          status?: 'success' | 'failed' | 'refunded';
          webhook_payload?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
    };
  };
}

export interface PlanFeatures {
  daily_briefing: boolean;
  technical_analysis: boolean;
  deep_analysis: boolean;
  stock_analysis?: boolean;
  price_alerts?: boolean;
}

export interface RelatedNews {
  title: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export type Subscriber = Database['public']['Tables']['subscribers']['Row'];
export type Plan = Database['public']['Tables']['plans']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Watchlist = Database['public']['Tables']['watchlists']['Row'];
export type StockAnalysis = Database['public']['Tables']['stock_analyses']['Row'];
export type PaymentLog = Database['public']['Tables']['payment_logs']['Row'];
