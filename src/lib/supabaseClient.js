// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hctewqiqnowoeuwxsnhy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdGV3cWlxbm93b2V1d3hzbmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDkzNzksImV4cCI6MjA2NTYyNTM3OX0.jBOgND_O1P42opvKhs3_skCJtZm_SLz5GNvX37y3a1k';

export const supabase = createClient(supabaseUrl, supabaseKey);
