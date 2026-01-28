import { useState, useEffect, useMemo } from 'react'

/**
 * Hook untuk menghasilkan action items otomatis berdasarkan data orders, deliveries, returns, dan invoices.
 * Logic otomatis menentukan next action berdasarkan status dan kondisi tertentu.
 */

// Mock data - nantinya akan diganti dengan data dari Supabase
const mockOrders = [
    { id: 'ORD-2025-001', customer: 'PT Maju Jaya', status: 'Aktif', startDate: '2025-01-15', hasDelivery: true, hasReturn: false, hasInvoice: false },
    { id: 'ORD-2025-002', customer: 'CV Bangun Sejahtera', status: 'Aktif', startDate: '2025-01-20', hasDelivery: true, hasReturn: false, hasInvoice: false },
    { id: 'ORD-2025-003', customer: 'PT Konstruksi Nusantara', status: 'Selesai', startDate: '2025-01-05', hasDelivery: true, hasReturn: true, hasInvoice: true },
    { id: 'ORD-2025-004', customer: 'PT Graha Indah', status: 'Draft', startDate: '2025-01-28', hasDelivery: false, hasReturn: false, hasInvoice: false },
]

const mockDeliveries = [
    { id: 'SJK-2025-001', orderId: 'ORD-2025-001', customer: 'PT Maju Jaya', status: 'Selesai', date: '2025-01-15' },
    { id: 'SJK-2025-002', orderId: 'ORD-2025-002', customer: 'CV Bangun Sejahtera', status: 'Pending', date: '2025-01-20' },
]

const mockReturns = [
    { id: 'SJR-2025-001', orderId: 'ORD-2025-003', customer: 'PT Konstruksi Nusantara', status: 'Selesai', date: '2025-01-25' },
]

const mockInvoices = [
    { id: 'INV-2025-001', orderId: 'ORD-2025-003', customer: 'PT Mega Proyek', status: 'Belum Bayar', total: 75000000, dueDate: '2025-02-25' },
    { id: 'INV-2025-002', orderId: 'ORD-2025-001', customer: 'PT Konstruksi Bangunan', status: 'Belum Bayar', total: 125000000, dueDate: '2025-02-20' },
    { id: 'INV-2025-003', orderId: 'ORD-2025-002', customer: 'CV Jaya Abadi', status: 'Lunas', total: 45000000, dueDate: '2025-02-15' },
]

/**
 * Menentukan next action berdasarkan tipe dan kondisi item
 */
const determineNextAction = (type, item) => {
    switch (type) {
        case 'order':
            if (item.status === 'Draft') {
                return 'Buat SJ Kirim'
            }
            if (item.status === 'Aktif' && !item.hasReturn) {
                return 'Buat SJ Retur'
            }
            if (item.status === 'Aktif' && item.hasReturn && !item.hasInvoice) {
                return 'Buat Invoice'
            }
            if (item.status === 'Selesai') {
                return 'Arsipkan'
            }
            return 'Cek Detail'

        case 'delivery':
            if (item.status === 'Pending') {
                return 'Kirim Barang'
            }
            return 'Selesai'

        case 'return':
            if (item.status === 'Pending') {
                return 'Terima Retur'
            }
            return 'Cek Kondisi'

        case 'invoice':
            if (item.status === 'Belum Bayar') {
                const dueDate = new Date(item.dueDate)
                const today = new Date()
                if (dueDate < today) {
                    return 'Follow Up (Jatuh Tempo)'
                }
                return 'Kirim Tagihan'
            }
            return 'Selesai'

        default:
            return 'Cek Detail'
    }
}

/**
 * Menentukan prioritas action (lower = more urgent)
 */
const getPriority = (type, item) => {
    // Invoice jatuh tempo = highest priority
    if (type === 'invoice' && item.status === 'Belum Bayar') {
        const dueDate = new Date(item.dueDate)
        const today = new Date()
        if (dueDate < today) return 1
        return 3
    }
    // SJ Pending = high priority
    if (type === 'delivery' && item.status === 'Pending') return 2
    if (type === 'return' && item.status === 'Pending') return 2
    // Order Draft = medium priority
    if (type === 'order' && item.status === 'Draft') return 4
    // Order Aktif = lower priority
    if (type === 'order' && item.status === 'Aktif') return 5
    // Order Selesai = lowest
    return 6
}

export function useActionItems() {
    const [loading, setLoading] = useState(true)

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300)
        return () => clearTimeout(timer)
    }, [])

    // Generate action items from all data sources
    const actionItems = useMemo(() => {
        const items = []

        // Process Orders
        mockOrders.forEach(order => {
            // Only add orders that need action (not completed with invoice)
            if (order.status === 'Draft' || order.status === 'Aktif') {
                items.push({
                    id: order.id,
                    type: 'order',
                    customer: order.customer,
                    status: order.status,
                    category: order.status === 'Draft' ? 'Order Draft' : 'Order Aktif',
                    nextAction: determineNextAction('order', order),
                    priority: getPriority('order', order),
                    date: order.startDate,
                })
            }
        })

        // Process Deliveries (only pending)
        mockDeliveries.forEach(delivery => {
            if (delivery.status === 'Pending') {
                items.push({
                    id: delivery.id,
                    type: 'sj',
                    customer: delivery.customer,
                    status: delivery.status,
                    category: 'SJ Pending',
                    nextAction: determineNextAction('delivery', delivery),
                    priority: getPriority('delivery', delivery),
                    date: delivery.date,
                })
            }
        })

        // Process Returns (only pending)
        mockReturns.forEach(ret => {
            if (ret.status === 'Pending') {
                items.push({
                    id: ret.id,
                    type: 'return',
                    customer: ret.customer,
                    status: ret.status,
                    category: 'Retur Pending',
                    nextAction: determineNextAction('return', ret),
                    priority: getPriority('return', ret),
                    date: ret.date,
                })
            }
        })

        // Process Invoices (only unpaid)
        mockInvoices.forEach(invoice => {
            if (invoice.status === 'Belum Bayar') {
                items.push({
                    id: invoice.id,
                    type: 'invoice',
                    customer: invoice.customer,
                    status: invoice.status,
                    category: 'Invoice Belum Bayar',
                    nextAction: determineNextAction('invoice', invoice),
                    priority: getPriority('invoice', invoice),
                    date: invoice.dueDate,
                })
            }
        })

        // Sort by priority (lower = more urgent)
        return items.sort((a, b) => a.priority - b.priority)
    }, [])

    // Get counts by category
    const counts = useMemo(() => ({
        orderAktif: actionItems.filter(i => i.category === 'Order Aktif').length,
        orderDraft: actionItems.filter(i => i.category === 'Order Draft').length,
        sjPending: actionItems.filter(i => i.category === 'SJ Pending').length,
        returPending: actionItems.filter(i => i.category === 'Retur Pending').length,
        invoiceBelumBayar: actionItems.filter(i => i.category === 'Invoice Belum Bayar').length,
    }), [actionItems])

    // Filter items by category
    const filterByCategory = (category) => {
        if (!category) return actionItems
        return actionItems.filter(item => item.category === category)
    }

    return {
        actionItems,
        counts,
        filterByCategory,
        loading,
    }
}
