import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock data for when Supabase is not configured
const mockOrders = [
    {
        id: '1',
        order_number: 'ORD-2025-001',
        customer: { name: 'PT Konstruksi Bangunan' },
        project_name: 'Gedung Perkantoran CBD',
        project_location: 'Jl. Sudirman, Jakarta',
        start_date: '2025-01-10',
        status: 'Berjalan',
        deposit_amount: 50000000,
        deposit_paid: true,
    },
    {
        id: '2',
        order_number: 'ORD-2025-002',
        customer: { name: 'CV Jaya Abadi' },
        project_name: 'Renovasi Mall Timur',
        project_location: 'Jl. Pemuda, Jakarta Timur',
        start_date: '2025-01-15',
        status: 'Disetujui',
        deposit_amount: 30000000,
        deposit_paid: false,
    },
    {
        id: '3',
        order_number: 'ORD-2025-003',
        customer: { name: 'PT Mega Proyek' },
        project_name: 'Apartemen Green Valley',
        project_location: 'BSD City, Tangerang',
        start_date: '2025-01-05',
        status: 'Retur Selesai',
        deposit_amount: 80000000,
        deposit_paid: true,
    },
]

export function useOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)

        try {
            if (isSupabaseConfigured()) {
                const { data, error: fetchError } = await supabase
                    .from('orders')
                    .select(`
            *,
            customer:customers(id, name, phone, address)
          `)
                    .order('created_at', { ascending: false })

                if (fetchError) throw fetchError
                setOrders(data || [])
            } else {
                // Use mock data when Supabase is not configured
                await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
                setOrders(mockOrders)
            }
        } catch (err) {
            setError(err.message)
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    const getOrderById = async (id) => {
        if (!isSupabaseConfigured()) {
            return mockOrders.find(o => o.id === id || o.order_number === id) || null
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        customer:customers(id, name, phone, address),
        items:order_items(
          id, quantity, price_per_day, delivered_qty, returned_qty,
          product:products(id, code, name, unit)
        )
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching order:', error)
            return null
        }
        return data
    }

    const createOrder = async (orderData) => {
        if (!isSupabaseConfigured()) {
            const newOrder = {
                id: String(orders.length + 1),
                order_number: `ORD-2025-${String(orders.length + 1).padStart(3, '0')}`,
                ...orderData,
                status: 'Draft',
                created_at: new Date().toISOString(),
            }
            setOrders([newOrder, ...orders])
            return { data: newOrder, error: null }
        }

        // Generate order number
        const { data: orderNum } = await supabase.rpc('generate_order_number')

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                ...orderData,
                order_number: orderNum,
                status: 'Draft'
            }])
            .select(`*, customer:customers(id, name)`)
            .single()

        if (!error && data) {
            setOrders([data, ...orders])
        }
        return { data, error }
    }

    const updateOrder = async (id, updates) => {
        if (!isSupabaseConfigured()) {
            setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o))
            return { data: { id, ...updates }, error: null }
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select(`*, customer:customers(id, name)`)
            .single()

        if (!error && data) {
            setOrders(orders.map(o => o.id === id ? data : o))
        }
        return { data, error }
    }

    const deleteOrder = async (id) => {
        if (!isSupabaseConfigured()) {
            setOrders(orders.filter(o => o.id !== id))
            return { error: null }
        }

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (!error) {
            setOrders(orders.filter(o => o.id !== id))
        }
        return { error }
    }

    return {
        orders,
        loading,
        error,
        fetchOrders,
        getOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
    }
}
