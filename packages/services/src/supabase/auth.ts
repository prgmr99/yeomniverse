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
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Server Component context - setAll can be ignored
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
