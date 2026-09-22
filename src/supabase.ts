import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mthoghfbhehwiwuxpikq.supabase.co';
const supabasePublishableKey = 'sb_publishable_Ns1-A6G2X5W-Oez_dFNuyg_wVrb22n8';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
