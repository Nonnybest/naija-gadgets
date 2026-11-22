import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://chrismond.duckdns.org';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const naira = (n) => '₦' + Number(n || 0).toLocaleString('en-NG');
export const ZONES = { 'Lagos': 2500, 'South-West and Abuja': 3500, 'Rest of Nigeria': 4500, 'Pickup point': 0 };
