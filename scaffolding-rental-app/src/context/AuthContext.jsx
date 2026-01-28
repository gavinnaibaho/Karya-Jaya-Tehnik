import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            // Mock user for development
            setUser({ id: 'mock-user', email: 'owner@karyajaya.com' })
            setProfile({ full_name: 'Owner', role: 'admin' })
            setLoading(false)
            return
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        setProfile(data)
    }

    const signIn = async (email, password) => {
        if (!isSupabaseConfigured()) {
            // Mock sign in
            setUser({ id: 'mock-user', email })
            setProfile({ full_name: 'Owner', role: 'admin' })
            return { error: null }
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error }
    }

    const signOut = async () => {
        if (!isSupabaseConfigured()) {
            setUser(null)
            setProfile(null)
            return
        }

        await supabase.auth.signOut()
    }

    const value = {
        user,
        profile,
        loading,
        signIn,
        signOut,
        isAdmin: profile?.role === 'admin',
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}
