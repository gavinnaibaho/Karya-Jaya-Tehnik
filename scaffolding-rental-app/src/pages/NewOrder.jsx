import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Package, Users, Truck } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, Input, Select, Textarea } from '../components/ui'
import { formatCurrency } from '../lib/utils'
import { useProducts } from '../hooks/useProducts'
import { useCustomers } from '../hooks/useCustomers'
import toast from 'react-hot-toast'

export default function NewOrder() {
    const navigate = useNavigate()
    const { products } = useProducts()
    const { customers, loading: customersLoading } = useCustomers()

    const [formData, setFormData] = useState({
        customer: '',
        pic: '',
        phone: '',
        project: '',
        location: '',
        startDate: '',
        endDate: '',
        deposit: '',
        notes: '',
        // Delivery fields
        deliveryDate: '',
        driver: '',
        vehicle: ''
    })

    const [orderItems, setOrderItems] = useState([
        { productId: '', qty: 1 }
    ])

    // Get available products for dropdown
    const availableProducts = products.filter(p => p.stock_available > 0)

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Auto-fill PIC and phone when customer is selected
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

    const getProductById = (id) => {
        return products.find(p => p.id === id || p.code === id)
    }

    const calculateTotalPerDay = () => {
        return orderItems.reduce((sum, item) => {
            const product = getProductById(item.productId)
            if (product) {
                return sum + (product.price_daily * item.qty)
            }
            return sum
        }, 0)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.customer || !formData.project || !formData.startDate) {
            toast.error('Harap lengkapi data Customer, Proyek, dan Tanggal Mulai')
            return
        }

        if (!formData.deliveryDate) {
            toast.error('Harap isi Tanggal Kirim')
            return
        }

        if (orderItems.some(item => !item.productId || item.qty < 1)) {
            toast.error('Harap pilih barang dan jumlah yang valid')
            return
        }

        // Generate order ID and SJ ID
        const orderId = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        const sjId = `SJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`

        // Create order object
        const newOrder = {
            id: orderId,
            customer: formData.customer,
            pic: formData.pic,
            phone: formData.phone,
            project: formData.project,
            location: formData.location,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            deposit: parseFloat(formData.deposit) || 0,
            notes: formData.notes,
            status: 'Aktif',
            items: orderItems.map(item => {
                const product = getProductById(item.productId)
                return {
                    code: product?.code,
                    name: product?.name,
                    qty: item.qty,
                    price: product?.price_daily || 0
                }
            }),
            createdAt: new Date().toISOString(),
            // Delivery info embedded
            delivery: {
                id: sjId,
                date: formData.deliveryDate,
                driver: formData.driver || '-',
                vehicle: formData.vehicle || '-',
                status: new Date(formData.deliveryDate) <= new Date() ? 'Terkirim' : 'Dijadwalkan'
            }
        }

        // Save to localStorage for persistence
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        existingOrders.unshift(newOrder)
        localStorage.setItem('orders', JSON.stringify(existingOrders))

        console.log('New Order Created:', newOrder)
        console.log('Auto-generated SJ Kirim:', newOrder.delivery)
        toast.success(`Order ${orderId} berhasil dibuat!\nSJ Kirim ${sjId} otomatis dibuat.`)
        navigate('/orders')
    }

    return (
        <Layout title="Buat Order Baru" subtitle="Form pembuatan pesanan sewa scaffolding">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        icon={ArrowLeft}
                        onClick={() => navigate('/orders')}
                    >
                        Kembali
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
                                Pilih Customer <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={formData.customerId || ''}
                                onChange={(e) => handleFormChange('customerId', e.target.value)}
                            >
                                <option value="">-- Pilih Customer --</option>
                                {customersLoading ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Pilih customer yang sudah terdaftar atau{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/customers')}
                                    className="text-red-600 hover:underline"
                                >
                                    tambah customer baru
                                </button>
                            </p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Proyek</h3>
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

                {/* Delivery Information */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2 text-orange-500" />
                        Informasi Pengiriman
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Tanggal Kirim"
                            type="date"
                            required
                            value={formData.deliveryDate}
                            onChange={(e) => handleFormChange('deliveryDate', e.target.value)}
                        />
                        <Input
                            label="Driver"
                            value={formData.driver}
                            onChange={(e) => handleFormChange('driver', e.target.value)}
                            placeholder="Nama driver"
                        />
                        <Input
                            label="Kendaraan"
                            value={formData.vehicle}
                            onChange={(e) => handleFormChange('vehicle', e.target.value)}
                            placeholder="No. Polisi / Jenis kendaraan"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Surat Jalan Kirim akan otomatis dibuat berdasarkan tanggal kirim yang dipilih.
                    </p>
                </Card>

                {/* Order Items */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Barang yang Disewa</h3>
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
                            const selectedProduct = getProductById(item.productId)
                            return (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="md:col-span-5">
                                        <label className="md:hidden text-xs text-gray-500 mb-1 block">Pilih Barang</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                        >
                                            <option value="">-- Pilih Barang --</option>
                                            {availableProducts.map(product => (
                                                <option key={product.id || product.code} value={product.id || product.code}>
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

                {/* Submit Button */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">Siap untuk menyimpan?</h3>
                            <p className="text-sm text-gray-600">Order dan Surat Jalan Kirim akan otomatis dibuat</p>
                        </div>
                        <Button type="submit" icon={Save} className="px-8">
                            Simpan Order
                        </Button>
                    </div>
                </Card>
            </form>
        </Layout>
    )
}
