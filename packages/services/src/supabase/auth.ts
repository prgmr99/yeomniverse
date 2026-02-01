import {
	createBrowserClient as createSupabaseBrowserClient,
	createServerClient as createSupabaseServerClient,
} from "@supabase/ssr";
import { cookies } from "next/headers";

// Browser client for client components
export function createBrowserAuthClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
}

interface CookieOptions {
	path?: string;
	domain?: string;
	maxAge?: number;
	expires?: Date;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
}

// Server client for server components and route handlers
export async function createServerAuthClient() {
	const cookieStore = await cookies();

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				try {
					cookieStore.set({ name, value, ...options });
				} catch {
					// Server Component context
				}
			},
			remove(name: string, options: CookieOptions) {
				try {
					cookieStore.set({ name, value: "", ...options });
				} catch {
					// Server Component context
				}
			},
		},
	});
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
