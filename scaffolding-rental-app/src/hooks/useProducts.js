import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock data
const mockProducts = [
    { id: '1', code: 'MF-170', name: 'Main Frame 1.7m x 1.5m', category: 'Main Frame', unit: 'Unit', price_daily: 15000, price_weekly: 90000, price_monthly: 300000, stock_total: 500, stock_available: 280 },
    { id: '2', code: 'CB-150', name: 'Cross Brace 1.5m', category: 'Cross Brace', unit: 'Unit', price_daily: 8000, price_weekly: 48000, price_monthly: 160000, stock_total: 800, stock_available: 450 },
    { id: '3', code: 'JB-60', name: 'Jack Base Adjustable 60cm', category: 'Jack Base', unit: 'Unit', price_daily: 5000, price_weekly: 30000, price_monthly: 100000, stock_total: 300, stock_available: 50 },
    { id: '4', code: 'UH-40', name: 'U-Head 40cm', category: 'U-Head', unit: 'Unit', price_daily: 6000, price_weekly: 36000, price_monthly: 120000, stock_total: 250, stock_available: 100 },
    { id: '5', code: 'JP-10', name: 'Joint Pin 10cm', category: 'Joint Pin', unit: 'Unit', price_daily: 2000, price_weekly: 12000, price_monthly: 40000, stock_total: 1000, stock_available: 20 },
]

export function useProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            if (isSupabaseConfigured()) {
                const { data, error: fetchError } = await supabase
                    .from('products')
                    .select('*')
                    .order('code')

                if (fetchError) throw fetchError
                setProducts(data || [])
            } else {
                await new Promise(resolve => setTimeout(resolve, 300))
                setProducts(mockProducts)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const createProduct = async (productData) => {
        if (!isSupabaseConfigured()) {
            const newProduct = { id: String(products.length + 1), ...productData }
            setProducts([...products, newProduct])
            return { data: newProduct, error: null }
        }

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single()

        if (!error && data) {
            setProducts([...products, data])
        }
        return { data, error }
    }

    const updateProduct = async (id, updates) => {
        if (!isSupabaseConfigured()) {
            setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p))
            return { data: { id, ...updates }, error: null }
        }

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (!error && data) {
            setProducts(products.map(p => p.id === id ? data : p))
        }
        return { data, error }
    }

    const updateStock = async (productId, quantityChange, movementType, referenceType = null, referenceId = null) => {
        if (!isSupabaseConfigured()) {
            setProducts(products.map(p => {
                if (p.id === productId) {
                    return { ...p, stock_available: p.stock_available + quantityChange }
                }
                return p
            }))
            return { error: null }
        }

        // Get current stock
        const product = products.find(p => p.id === productId)
        if (!product) return { error: 'Product not found' }

        const newAvailable = product.stock_available + quantityChange

        // Update product stock
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock_available: newAvailable })
            .eq('id', productId)

        if (updateError) return { error: updateError }

        // Record stock movement
        await supabase
            .from('stock_movements')
            .insert([{
                product_id: productId,
                movement_type: movementType,
                quantity: Math.abs(quantityChange),
                reference_type: referenceType,
                reference_id: referenceId,
            }])

        // Update local state
        setProducts(products.map(p => p.id === productId ? { ...p, stock_available: newAvailable } : p))

        return { error: null }
    }

    const getLowStockProducts = () => {
        return products.filter(p => p.stock_available <= 50)
    }

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        updateStock,
        getLowStockProducts,
    }
}
