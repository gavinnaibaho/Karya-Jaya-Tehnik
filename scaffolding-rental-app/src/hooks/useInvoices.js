import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock data with complete details
const mockInvoices = [
    {
        id: '1',
        invoice_number: 'INV-2025-001',
        invoice_date: '2025-01-25',
        due_date: '2025-02-25',
        order_id: 'ORD-2025-003',
        order_number: 'ORD-2025-003',
        project_name: 'Apartemen Green Hills',
        customer: {
            name: 'PT Konstruksi Nusantara',
            address: 'Jl. Industri Raya No. 45, Bekasi',
            phone: '021-88776655',
            pic: 'Dewi Sartika'
        },
        rental_period: {
            start_date: '2025-01-05',
            end_date: '2025-01-25',
            days: 20
        },
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 80, price_per_day: 5000, subtotal: 8000000 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', qty: 160, price_per_day: 3000, subtotal: 9600000 },
            { code: 'PL-200', name: 'Platform 2m', qty: 20, price_per_day: 15000, subtotal: 6000000 },
        ],
        subtotal: 23600000,
        ppn: 2360000,
        total: 25960000,
        paid_amount: 0,
        deposit_used: 0,
        deposit_available: 30000000,
        status: 'Belum Bayar',
        payments: [],
        notes: 'Pembayaran paling lambat 30 hari setelah invoice diterbitkan.'
    },
    {
        id: '2',
        invoice_number: 'INV-2025-002',
        invoice_date: '2025-01-20',
        due_date: '2025-02-20',
        order_id: 'ORD-2025-001',
        order_number: 'ORD-2025-001',
        project_name: 'Proyek Mall Central',
        customer: {
            name: 'PT Maju Jaya',
            address: 'Jl. Sudirman No. 123, Jakarta Pusat',
            phone: '021-55443322',
            pic: 'Budi Hartono'
        },
        rental_period: {
            start_date: '2025-01-15',
            end_date: '2025-01-20',
            days: 5
        },
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 50, price_per_day: 5000, subtotal: 1250000 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', qty: 100, price_per_day: 3000, subtotal: 1500000 },
        ],
        subtotal: 2750000,
        ppn: 275000,
        total: 3025000,
        paid_amount: 0,
        deposit_used: 0,
        deposit_available: 25000000,
        status: 'Belum Bayar',
        payments: [],
        notes: ''
    },
    {
        id: '3',
        invoice_number: 'INV-2025-003',
        invoice_date: '2025-01-15',
        due_date: '2025-02-15',
        order_id: 'ORD-2025-002',
        order_number: 'ORD-2025-002',
        project_name: 'Gedung Kantor ABC',
        customer: {
            name: 'CV Bangun Sejahtera',
            address: 'Jl. Raya Serpong No. 88, Tangerang',
            phone: '021-77889900',
            pic: 'Andi Wijaya'
        },
        rental_period: {
            start_date: '2025-01-01',
            end_date: '2025-01-15',
            days: 14
        },
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 30, price_per_day: 5000, subtotal: 2100000 },
            { code: 'JB-60', name: 'Jack Base 60cm', qty: 30, price_per_day: 4000, subtotal: 1680000 },
        ],
        subtotal: 3780000,
        ppn: 378000,
        total: 4158000,
        paid_amount: 4158000,
        deposit_used: 0,
        deposit_available: 15000000,
        status: 'Lunas',
        payments: [
            { id: 'PAY-001', date: '2025-01-16', amount: 4158000, method: 'Transfer Bank', reference: 'BCA-123456' }
        ],
        notes: 'Lunas - Terima kasih.'
    },
]

export function useInvoices() {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchInvoices()
    }, [])

    const fetchInvoices = async () => {
        setLoading(true)
        try {
            if (isSupabaseConfigured()) {
                const { data, error: fetchError } = await supabase
                    .from('invoices')
                    .select(`
            *,
            order:orders(id, order_number, project_name, customer:customers(id, name))
          `)
                    .order('created_at', { ascending: false })

                // If error or no data, fallback to mock
                if (fetchError || !data || data.length === 0) {
                    console.log('Using mock invoice data (Supabase has no data)')
                    setInvoices(mockInvoices)
                } else {
                    setInvoices(data)
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 300))
                setInvoices(mockInvoices)
            }
        } catch (err) {
            console.log('Error fetching invoices, using mock data:', err.message)
            setInvoices(mockInvoices)
        } finally {
            setLoading(false)
        }
    }

    const createInvoice = async (invoiceData) => {
        if (!isSupabaseConfigured()) {
            const newInvoice = {
                id: String(invoices.length + 1),
                invoice_number: `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`,
                ...invoiceData,
                status: 'Draft',
            }
            setInvoices([newInvoice, ...invoices])
            return { data: newInvoice, error: null }
        }

        // Generate invoice number based on settings
        const { data: settings } = await supabase.from('settings').select('invoice_prefix').single()
        const prefix = settings?.invoice_prefix || 'INV'
        const year = new Date().getFullYear()

        // Get next number
        const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true })
        const invoiceNumber = `${prefix}-${year}-${String((count || 0) + 1).padStart(3, '0')}`

        const { data, error } = await supabase
            .from('invoices')
            .insert([{ ...invoiceData, invoice_number: invoiceNumber }])
            .select()
            .single()

        if (!error && data) {
            setInvoices([data, ...invoices])
        }
        return { data, error }
    }

    const recordPayment = async (invoiceId, paymentData) => {
        if (!isSupabaseConfigured()) {
            setInvoices(invoices.map(inv => {
                if (inv.id === invoiceId) {
                    const newPaidAmount = inv.paid_amount + paymentData.amount
                    return {
                        ...inv,
                        paid_amount: newPaidAmount,
                        status: newPaidAmount >= inv.total ? 'Lunas' : 'Belum Bayar'
                    }
                }
                return inv
            }))
            return { error: null }
        }

        // Create payment record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                invoice_id: invoiceId,
                ...paymentData,
                payment_number: `PAY-${Date.now()}`
            }])

        if (paymentError) return { error: paymentError }

        // Update invoice
        const invoice = invoices.find(i => i.id === invoiceId)
        const newPaidAmount = (invoice?.paid_amount || 0) + paymentData.amount

        const { error: updateError } = await supabase
            .from('invoices')
            .update({
                paid_amount: newPaidAmount,
                status: newPaidAmount >= (invoice?.total || 0) ? 'Lunas' : 'Belum Bayar'
            })
            .eq('id', invoiceId)

        if (!updateError) {
            fetchInvoices()
        }
        return { error: updateError }
    }

    const getSummary = () => {
        const total = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
        const paid = invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0)
        const outstanding = total - paid
        const overdue = invoices.filter(inv =>
            new Date(inv.due_date) < new Date() && inv.status !== 'Lunas'
        ).length

        return { total, paid, outstanding, overdue }
    }

    return {
        invoices,
        loading,
        error,
        fetchInvoices,
        createInvoice,
        recordPayment,
        getSummary,
    }
}
