// 测试 Supabase 连接
// 运行: npx tsx test-db-connection

// 或: node test-db-connection.js

import { createClient } from '@supabase/supabase-js'

import { supabase } from './lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    
    // 测试连接
    const { data, error } = await client.from('selection_case').select('id').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return
    }
    
    console.log('Supabase connection successful!')
    console.log('Test query result:', data);
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testConnection();
