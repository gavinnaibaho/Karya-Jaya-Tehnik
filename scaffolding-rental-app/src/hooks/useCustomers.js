import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock data
const mockCustomers = [
    { id: '1', name: 'PT Konstruksi Bangunan', address: 'Jl. Raya Kebayoran No. 45, Jakarta Selatan', phone: '021-7654321', email: 'info@konstruksi.com', pic_name: 'Budi Santoso' },
    { id: '2', name: 'CV Jaya Abadi', address: 'Jl. Pemuda No. 100, Jakarta Timur', phone: '021-8765432', email: 'admin@jayaabadi.com', pic_name: 'Andi Wijaya' },
    { id: '3', name: 'PT Mega Proyek', address: 'BSD City, Tangerang Selatan', phone: '021-5551234', email: 'project@megaproyek.com', pic_name: 'Dewi Kartika' },
]

export function useCustomers() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        setLoading(true)
        try {
            if (isSupabaseConfigured()) {
                const { data, error: fetchError } = await supabase
                    .from('customers')
                    .select('*')
                    .order('name')

                if (fetchError) throw fetchError
                setCustomers(data || [])
            } else {
                await new Promise(resolve => setTimeout(resolve, 300))
                setCustomers(mockCustomers)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const createCustomer = async (customerData) => {
        if (!isSupabaseConfigured()) {
            const newCustomer = {
                id: String(customers.length + 1),
                ...customerData,
                status: 'active',
                created_at: new Date().toISOString()
            }
            setCustomers([...customers, newCustomer])
            return { data: newCustomer, error: null }
        }

        const { data, error } = await supabase
            .from('customers')
            .insert([{ ...customerData, status: 'active' }])
            .select()
            .single()

        if (!error && data) {
            setCustomers([...customers, data])
        }
        return { data, error }
    }

    const updateCustomer = async (id, updates) => {
        if (!isSupabaseConfigured()) {
            setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c))
            return { data: { id, ...updates }, error: null }
        }

        const { data, error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (!error && data) {
            setCustomers(customers.map(c => c.id === id ? data : c))
        }
        return { data, error }
    }

    const deleteCustomer = async (id) => {
        if (!isSupabaseConfigured()) {
            setCustomers(customers.filter(c => c.id !== id))
            return { error: null }
        }

        const { error } = await supabase
            .from('customers')
            .update({ status: 'inactive' })
            .eq('id', id)

        if (!error) {
            setCustomers(customers.filter(c => c.id !== id))
        }
        return { error }
    }

    return {
        customers,
        loading,
        error,
        fetchCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    }
}
