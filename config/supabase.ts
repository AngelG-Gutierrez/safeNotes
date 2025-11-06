import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgjyeekwsbrvpjiizgun.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanllZWt3c2JydnBqaWl6Z3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTc4MzMsImV4cCI6MjA3NzE5MzgzM30.yJoC3fiIw4HFiJ04amZUeddn-WjOh7QPYaQwTt7lOSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})