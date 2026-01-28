import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Package, Users, Calendar } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, Input, Textarea, StatusBadge } from '../components/ui'
import { formatCurrency } from '../lib/utils'
import { useProducts } from '../hooks/useProducts'
import { useCustomers } from '../hooks/useCustomers'
import toast from 'react-hot-toast'

// Mock orders data (should come from hook in production)
const mockOrders = [
    {
        id: 'ORD-2025-001',
        customerId: '1',
        customer: 'PT Maju Jaya',
        project: 'Proyek Mall Central',
        location: 'Jakarta Pusat',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        status: 'Aktif',
        deposit: 25000000,
        pic: 'Budi Hartono',
        phone: '081234567890',
        notes: '',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 50, price: 5000 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', qty: 100, price: 3000 },
        ]
    },
    {
        id: 'ORD-2025-002',
        customerId: '2',
        customer: 'CV Bangun Sejahtera',
        project: 'Gedung Kantor ABC',
        location: 'Tangerang',
        startDate: '2025-01-20',
        endDate: '2025-02-20',
        status: 'Aktif',
        deposit: 15000000,
        pic: 'Andi Wijaya',
        phone: '081234567891',
        notes: '',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 30, price: 5000 },
            { code: 'JB-60', name: 'Jack Base 60cm', qty: 30, price: 4000 },
        ]
    }
]

export default function EditOrder() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { products } = useProducts()
    const { customers } = useCustomers()

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        id: '',
        customerId: '',
        customer: '',
        pic: '',
        phone: '',
        project: '',
        location: '',
        startDate: '',
        endDate: '',
        deposit: '',
        notes: '',
        status: ''
    })

    const [orderItems, setOrderItems] = useState([])

    // Load order data
    useEffect(() => {
        const order = mockOrders.find(o => o.id === id)
        if (order) {
            setFormData({
                id: order.id,
                customerId: order.customerId || '',
                customer: order.customer,
                pic: order.pic,
                phone: order.phone,
                project: order.project,
                location: order.location,
                startDate: order.startDate,
                endDate: order.endDate || '',
                deposit: order.deposit?.toString() || '',
                notes: order.notes || '',
                status: order.status
            })
            setOrderItems(order.items.map(item => ({
                code: item.code,
                productId: item.code,
                qty: item.qty
            })))
        } else {
            toast.error('Order tidak ditemukan')
            navigate('/orders')
        }
        setLoading(false)
    }, [id, navigate])

    const availableProducts = products.filter(p => p.stock_available > 0)

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        if (field === 'customerId' && value) {
            const selectedCustomer = customers.find(c => c.id === value)
            if (selectedCustomer) {
                setFormData(prev => ({
                    ...prev,
                    customerId: value,
                    customer: selectedCustomer.name,
                    pic: selectedCustomer.pic_name || '',
                    phone: selectedCustomer.pic_phone || selectedCustomer.phone || ''
                }))
            }
        }
    }

    const handleItemChange = (index, field, value) => {
        setOrderItems(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const addItem = () => {
        setOrderItems(prev => [...prev, { productId: '', qty: 1 }])
    }

    const removeItem = (index) => {
        if (orderItems.length > 1) {
            setOrderItems(prev => prev.filter((_, i) => i !== index))
        }
    }

    const getProductByCode = (code) => {
        return products.find(p => p.code === code || p.id === code)
    }

    const calculateTotalPerDay = () => {
        return orderItems.reduce((sum, item) => {
            const product = getProductByCode(item.productId || item.code)
            if (product) {
                return sum + (product.price_daily * item.qty)
            }
            return sum
        }, 0)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.project || !formData.startDate) {
            toast.error('Harap lengkapi data Proyek dan Tanggal Mulai')
            return
        }

        if (orderItems.some(item => (!item.productId && !item.code) || item.qty < 1)) {
            toast.error('Harap pilih barang dan jumlah yang valid')
            return
        }

        const updatedOrder = {
            ...formData,
            deposit: parseFloat(formData.deposit) || 0,
            items: orderItems.map(item => {
                const product = getProductByCode(item.productId || item.code)
                return {
                    code: product?.code || item.code,
                    name: product?.name || item.name,
                    qty: item.qty,
                    price: product?.price_daily || 0
                }
            }),
            updatedAt: new Date().toISOString()
        }

        console.log('Order Updated:', updatedOrder)
        toast.success(`Order ${formData.id} berhasil diupdate!`)
        navigate('/orders')
    }

    if (loading) {
        return (
            <Layout title="Edit Order" subtitle="Loading...">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout title={`Edit ${formData.id}`} subtitle="Ubah data pesanan sewa scaffolding">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            icon={ArrowLeft}
                            onClick={() => navigate('/orders')}
                        >
                            Kembali
                        </Button>
                        <StatusBadge status={formData.status} />
                    </div>
                    <Button type="submit" icon={Save}>
                        Simpan Perubahan
                    </Button>
                </div>

                {/* Customer Information */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-red-500" />
                        Informasi Customer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={formData.customerId}
                                onChange={(e) => handleFormChange('customerId', e.target.value)}
                            >
                                <option value="">-- Pilih Customer --</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="PIC (Person in Charge)"
                            value={formData.pic}
                            onChange={(e) => handleFormChange('pic', e.target.value)}
                            placeholder="Nama kontak person"
                        />
                        <Input
                            label="No. Telepon"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleFormChange('phone', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                        />
                    </div>
                </Card>

                {/* Project Information */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Informasi Proyek
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nama Proyek"
                            required
                            value={formData.project}
                            onChange={(e) => handleFormChange('project', e.target.value)}
                            placeholder="Proyek Mall Central"
                        />
                        <Input
                            label="Lokasi Proyek"
                            value={formData.location}
                            onChange={(e) => handleFormChange('location', e.target.value)}
                            placeholder="Jakarta Pusat"
                        />
                        <Input
                            label="Tanggal Mulai Sewa"
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => handleFormChange('startDate', e.target.value)}
                        />
                        <Input
                            label="Estimasi Tanggal Selesai"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleFormChange('endDate', e.target.value)}
                        />
                        <Input
                            label="Deposit"
                            type="number"
                            value={formData.deposit}
                            onChange={(e) => handleFormChange('deposit', e.target.value)}
                            placeholder="25000000"
                        />
                    </div>
                </Card>

                {/* Order Items */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-green-500" />
                            Barang yang Disewa
                        </h3>
                        <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem}>
                            Tambah Barang
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-gray-600">
                            <div className="col-span-5">Barang</div>
                            <div className="col-span-2 text-center">Stok</div>
                            <div className="col-span-2 text-center">Jumlah</div>
                            <div className="col-span-2 text-right">Harga/Hari</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Items */}
                        {orderItems.map((item, index) => {
                            const selectedProduct = getProductByCode(item.productId || item.code)
                            return (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="md:col-span-5">
                                        <label className="md:hidden text-xs text-gray-500 mb-1 block">Pilih Barang</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            value={item.productId || item.code || ''}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                        >
                                            <option value="">-- Pilih Barang --</option>
                                            {availableProducts.map(product => (
                                                <option key={product.id || product.code} value={product.code}>
                                                    {product.code} - {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 text-center">
                                        <label className="md:hidden text-xs text-gray-500 mb-1 block">Stok Tersedia</label>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-sm ${selectedProduct?.stock_available > 50
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            <Package className="w-3 h-3 mr-1" />
                                            {selectedProduct?.stock_available || 0}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="md:hidden text-xs text-gray-500 mb-1 block">Jumlah</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedProduct?.stock_available || 9999}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    <div className="md:col-span-2 text-right">
                                        <label className="md:hidden text-xs text-gray-500 mb-1 block">Harga/Hari</label>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(selectedProduct?.price_daily || 0)}
                                        </span>
                                    </div>
                                    <div className="md:col-span-1 text-right">
                                        {orderItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Total */}
                        <div className="flex justify-end pt-4 border-t">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Sewa per Hari</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatCurrency(calculateTotalPerDay())}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Notes */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Catatan</h3>
                    <Textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                        placeholder="Catatan tambahan untuk order ini..."
                    />
                </Card>

                {/* Submit Button (Mobile) */}
                <div className="md:hidden">
                    <Button type="submit" icon={Save} className="w-full">
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </Layout>
    )
}
