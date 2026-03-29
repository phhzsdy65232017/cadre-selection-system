"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export type UserRole = 'super_admin' | 'region_admin' | 'normal_user'

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  region_id?: string
  region_name?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  isSuperAdmin: boolean
  isRegionAdmin: boolean
  canManageUsers: boolean
  canViewAllCases: boolean
  canViewRegionCases: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          regions:region_id (name)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        region_id: data.region_id,
        region_name: (data.regions as any)?.name
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('初始化认证失败:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // 1. 创建 Auth 用户（不传递 options.data 避免触发触发器）
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        console.error('Auth signUp error:', error)
        throw error
      }
      
      if (data.user) {
        console.log('User created:', data.user)
        
        // 2. 手动创建 profile 记录
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: 'normal_user' as UserRole,
              is_active: true
            })
          
          if (profileError) {
            console.error('Profile creation error:', profileError)
          } else {
            console.log('Profile created successfully')
          }
        } catch (profileError) {
          console.error('Profile creation error:', profileError)
        }
        
        // 3. 刷新 session 确保用户状态同步
        try {
          await supabase.auth.refreshSession()
          console.log('Session refreshed')
        } catch (refreshError) {
          console.error('Session refresh error:', refreshError)
        }
        
        // 4. 获取并设置 profile 数据
        try {
          const profileData = await fetchProfile(data.user.id)
          setProfile(profileData)
          console.log('Profile fetched:', profileData)
        } catch (profileError) {
          console.error('Profile fetch error:', profileError)
        }
      }
    } catch (error: any) {
      console.error('SignUp error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const isSuperAdmin = profile?.role === 'super_admin'
  const isRegionAdmin = profile?.role === 'region_admin'
  const canManageUsers = isSuperAdmin || isRegionAdmin
  const canViewAllCases = isSuperAdmin
  const canViewRegionCases = isRegionAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        isSuperAdmin,
        isRegionAdmin,
        canManageUsers,
        canViewAllCases,
        canViewRegionCases
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
