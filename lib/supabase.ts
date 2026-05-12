import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseBrowser = () => createClient(url, anon);
export const supabaseAdmin = () => createClient(url, serviceRole, { auth: { persistSession: false } });
