import { createClient } from "@supabase/supabase-js";


const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseURL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
if (!supabaseApiKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
if (!supabaseServiceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");


export const supabase = createClient(supabaseURL, supabaseApiKey);

export const supabaseAdmin = createClient(supabaseURL,supabaseServiceKey)