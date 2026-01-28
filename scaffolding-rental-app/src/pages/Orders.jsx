import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, X, Eye, Printer, Calendar, Clock, History, Pencil, Trash2 } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, StatusBadge, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, DeleteConfirmModal } from '../components/ui'
import { OrderPrint } from '../components/print'
import { formatCurrencyShort, formatCurrency, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

const mockOrders = [
    {
        id: 'ORD-2025-001',
        customer: 'PT Maju Jaya',
        project: 'Proyek Mall Central',
        location: 'Jakarta Pusat',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        status: 'Aktif',
        deposit: 25000000,
        pic: 'Budi Hartono',
        phone: '081234567890',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 50, price: 5000 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', qty: 100, price: 3000 },
        ],
        extensions: [
            { date: '2025-02-10', previousEndDate: '2025-02-15', newEndDate: '2025-03-15', addedDays: 28, addedCost: 15400000 }
        ],
        invoices: [
            { id: 'INV-2025-001', date: '2025-01-15', amount: 17050000, type: 'Sewa Awal', status: 'Lunas' },
            { id: 'INV-2025-008', date: '2025-02-10', amount: 15400000, type: 'Perpanjangan', status: 'Pending' }
        ],
        payments: [
            { id: 'PAY-001', date: '2025-01-15', amount: 25000000, method: 'Transfer Bank', note: 'Deposit' },
            { id: 'PAY-002', date: '2025-01-20', amount: 17050000, method: 'Transfer Bank', note: 'Pembayaran INV-2025-001' }
        ]
    },
    {
        id: 'ORD-2025-002',
        customer: 'CV Bangun Sejahtera',
        project: 'Gedung Kantor ABC',
        location: 'Tangerang',
        startDate: '2025-01-20',
        endDate: '2025-02-20',
        status: 'Aktif',
        deposit: 15000000,
        pic: 'Andi Wijaya',
        phone: '081234567891',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 30, price: 5000 },
            { code: 'JB-60', name: 'Jack Base 60cm', qty: 30, price: 4000 },
        ],
        extensions: [],
        invoices: [],
        payments: [
            { id: 'PAY-003', date: '2025-01-20', amount: 15000000, method: 'Transfer Bank', note: 'Deposit' }
        ]
    },
    {
        id: 'ORD-2025-003',
        customer: 'PT Konstruksi Nusantara',
        project: 'Apartemen Green Hills',
        location: 'Bekasi',
        startDate: '2025-01-05',
        endDate: '2025-01-25',
        status: 'Selesai',
        deposit: 30000000,
        pic: 'Dewi Sartika',
        phone: '081234567892',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 80, price: 5000 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', qty: 160, price: 3000 },
            { code: 'PL-200', name: 'Platform 2m', qty: 20, price: 15000 },
        ],
        extensions: [],
        invoices: [
            { id: 'INV-2025-003', date: '2025-01-05', amount: 21000000, type: 'Sewa Penuh', status: 'Lunas' }
        ],
        payments: [
            { id: 'PAY-004', date: '2025-01-05', amount: 30000000, method: 'Transfer Bank', note: 'Deposit' },
            { id: 'PAY-005', date: '2025-01-25', amount: 21000000, method: 'Transfer Bank', note: 'Pelunasan' }
        ]
    },
    {
        id: 'ORD-2025-004',
        customer: 'PT Graha Indah',
        project: 'Hotel Permata',
        location: 'Depok',
        startDate: '2025-01-28',
        endDate: null,
        status: 'Draft',
        deposit: 0,
        pic: 'Rudi Setiawan',
        phone: '081234567893',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', qty: 40, price: 5000 },
        ],
        extensions: [],
        invoices: [],
        payments: []
    },
]

export default function Orders() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [showExtendModal, setShowExtendModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderToDelete, setOrderToDelete] = useState(null)
    const [newEndDate, setNewEndDate] = useState('')
    const printRef = useRef()

    // Load orders from localStorage and merge with mock data
    const [orders, setOrders] = useState(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        // Merge: localStorage orders first, then mock orders
        const allOrders = [...savedOrders, ...mockOrders]
        // Remove duplicates by id
        const uniqueOrders = allOrders.filter((order, index, self) =>
            index === self.findIndex(o => o.id === order.id)
        )
        return uniqueOrders
    })

    const statusFilter = searchParams.get('status')

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.project.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const clearFilter = () => {
        setSearchParams({})
    }

    const handleViewDetail = (order) => {
        setSelectedOrder(order)
        setShowDetailModal(true)
    }

    const openPrintPreview = (order) => {
        setSelectedOrder(order)
        setShowPrintModal(true)
    }

    const openDeleteConfirm = (order) => {
        setOrderToDelete(order)
        setShowDeleteModal(true)
    }

    const handleDelete = () => {
        if (orderToDelete) {
            toast.success(`Order ${orderToDelete.id} berhasil dihapus!`)
            setOrderToDelete(null)
        }
    }

    const openExtendModal = () => {
        if (selectedOrder?.endDate) {
            setNewEndDate(selectedOrder.endDate)
        }
        setShowExtendModal(true)
    }

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Rental-Order-${selectedOrder?.id || 'ORD'}`,
    })

    const getTotalOrderValue = (items) => {
        return items?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0
    }

    const calculateDaysDifference = (startDate, endDate) => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = end - start
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const calculateExtensionCost = () => {
        if (!selectedOrder?.endDate || !newEndDate) return { days: 0, cost: 0 }
        const additionalDays = calculateDaysDifference(selectedOrder.endDate, newEndDate)
        const dailyRate = getTotalOrderValue(selectedOrder.items)
        return {
            days: additionalDays > 0 ? additionalDays : 0,
            cost: additionalDays > 0 ? additionalDays * dailyRate : 0
        }
    }

    const handleExtendSubmit = () => {
        if (!newEndDate) {
            toast.error('Harap pilih tanggal selesai baru')
            return
        }

        const { days, cost } = calculateExtensionCost()

        if (days <= 0) {
            toast.error('Tanggal baru harus setelah tanggal selesai saat ini')
            return
        }

        // Create extension record
        const extension = {
            date: new Date().toISOString().split('T')[0],
            previousEndDate: selectedOrder.endDate,
            newEndDate: newEndDate,
            addedDays: days,
            addedCost: cost
        }

        // Update the order with new end date and extension record
        const updatedOrder = {
            ...selectedOrder,
            endDate: newEndDate,
            extensions: [...(selectedOrder.extensions || []), extension]
        }

        // Update orders state
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === selectedOrder.id ? updatedOrder : order
            )
        )

        // Update localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const updatedSavedOrders = savedOrders.map(order =>
            order.id === selectedOrder.id ? updatedOrder : order
        )
        // Add if not in localStorage
        if (!savedOrders.find(o => o.id === selectedOrder.id)) {
            updatedSavedOrders.push(updatedOrder)
        }
        localStorage.setItem('orders', JSON.stringify(updatedSavedOrders))

        // Update selected order for modal
        setSelectedOrder(updatedOrder)

        toast.success(`Perpanjangan berhasil! Tambahan ${days} hari dengan biaya ${formatCurrency(cost)}`)
        setShowExtendModal(false)
        setNewEndDate('')
    }

    const extensionInfo = calculateExtensionCost()

    return (
        <Layout title="Rental Order" subtitle="Kelola semua pesanan sewa scaffolding">
            <div className="space-y-6">
                {/* Toolbar */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari order, customer, proyek..."
                                className="w-80"
                            />
                            {statusFilter && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                    <span className="text-sm text-blue-700">Filter: <strong>{statusFilter}</strong></span>
                                    <button onClick={clearFilter} className="text-blue-600 hover:text-blue-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <Button icon={Plus} onClick={() => navigate('/orders/new')}>
                            Order Baru
                        </Button>
                    </div>
                </Card>

                {/* Orders Table */}
                <Card padding={false}>
                    <Table>
                        <TableHeader>
                            <TableHead>Order No</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Proyek</TableHead>
                            <TableHead>Mulai Sewa</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead align="right">Deposit</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    onClick={() => handleViewDetail(order)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <TableCell className="font-mono font-medium text-gray-900">{order.id}</TableCell>
                                    <TableCell className="text-gray-900">{order.customer}</TableCell>
                                    <TableCell className="text-gray-600">{order.project}</TableCell>
                                    <TableCell className="text-gray-900">{order.startDate}</TableCell>
                                    <TableCell><StatusBadge status={order.status} /></TableCell>
                                    <TableCell align="right" className="font-medium text-gray-900">
                                        {formatCurrencyShort(order.deposit)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => navigate(`/orders/${order.id}/edit`)}
                                                className="text-amber-600 hover:text-amber-700"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirm(order)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Detail Modal */}
                <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail Order ${selectedOrder?.id}`} size="lg">
                    <ModalBody>
                        {selectedOrder && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Customer</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <StatusBadge status={selectedOrder.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Proyek</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.project}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Lokasi</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Mulai</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.startDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Selesai</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.endDate || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">PIC</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.pic}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Telepon</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.phone}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Barang yang Di-order</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left p-3 font-medium text-gray-600">Kode</th>
                                                    <th className="text-left p-3 font-medium text-gray-600">Nama Barang</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Harga/Hari</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Subtotal/Hari</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="p-3 font-mono text-gray-900">{item.code}</td>
                                                        <td className="p-3 text-gray-900">{item.name}</td>
                                                        <td className="p-3 text-right text-gray-900">{item.qty}</td>
                                                        <td className="p-3 text-right text-gray-900">{formatCurrency(item.price)}</td>
                                                        <td className="p-3 text-right font-medium text-gray-900">{formatCurrency(item.qty * item.price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan="4" className="p-3 text-right font-medium text-gray-900">Total Sewa/Hari:</td>
                                                    <td className="p-3 text-right font-bold text-red-600">{formatCurrency(getTotalOrderValue(selectedOrder.items))}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Rental Periods Timeline */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <History className="w-4 h-4 mr-2 text-purple-600" />
                                        Riwayat Periode Sewa
                                    </h4>
                                    <div className="space-y-3">
                                        {/* Periode I - Original Period */}
                                        <div className="border border-blue-200 rounded-lg overflow-hidden">
                                            <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                                                <span className="font-semibold text-blue-700">Periode I</span>
                                                <span className="text-blue-500 text-sm ml-2">(Periode Awal)</span>
                                            </div>
                                            <div className="p-4 bg-white">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Tanggal Mulai - Tanggal Berakhir</p>
                                                        <p className="font-medium text-gray-900">
                                                            {formatDate(selectedOrder.startDate)} — {selectedOrder.extensions?.length > 0
                                                                ? formatDate(selectedOrder.extensions[0].previousEndDate)
                                                                : formatDate(selectedOrder.endDate)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 mb-1">Durasi</p>
                                                        <p className="font-medium text-blue-600">
                                                            {calculateDaysDifference(selectedOrder.startDate,
                                                                selectedOrder.extensions?.length > 0
                                                                    ? selectedOrder.extensions[0].previousEndDate
                                                                    : selectedOrder.endDate)} hari
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extended Periods */}
                                        {selectedOrder.extensions?.map((ext, idx) => (
                                            <div key={idx} className="border border-purple-200 rounded-lg overflow-hidden">
                                                <div className="bg-purple-50 px-4 py-2 border-b border-purple-200 flex justify-between items-center">
                                                    <div>
                                                        <span className="font-semibold text-purple-700">Periode {idx + 2}</span>
                                                        <span className="text-purple-500 text-sm ml-2">(Perpanjangan)</span>
                                                    </div>
                                                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                                        Diperpanjang {formatDate(ext.date)}
                                                    </span>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Tanggal Perpanjang - Tanggal Berakhir</p>
                                                            <p className="font-medium text-gray-900">
                                                                {formatDate(ext.previousEndDate)} — {formatDate(ext.newEndDate)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 mb-1">Tambahan</p>
                                                            <p className="font-medium text-purple-600">+{ext.addedDays} hari</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 mb-1">Biaya Tambahan</p>
                                                            <p className="font-bold text-green-600">{formatCurrency(ext.addedCost)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Total Summary - Only show if there are extensions */}
                                        {selectedOrder.extensions?.length > 0 && (
                                            <div className="bg-gray-100 rounded-lg p-4 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Periode Sewa</p>
                                                        <p className="font-bold text-gray-900">
                                                            {formatDate(selectedOrder.startDate)} — {formatDate(selectedOrder.endDate)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Total Durasi</p>
                                                        <p className="font-bold text-lg text-red-600">
                                                            {calculateDaysDifference(selectedOrder.startDate, selectedOrder.endDate)} hari
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500">Deposit</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedOrder.deposit)}</p>
                                </div>

                                {/* Invoice Section */}
                                {selectedOrder.invoices?.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                            Invoice
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedOrder.invoices.map((inv, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{inv.id}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(inv.date)} • {inv.type}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">{formatCurrency(inv.amount)}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${inv.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {inv.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Payment History Section */}
                                {selectedOrder.payments?.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            Riwayat Pembayaran
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedOrder.payments.map((pay, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{pay.id}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(pay.date)} • {pay.method}</p>
                                                        <p className="text-xs text-gray-600">{pay.note}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-green-600">{formatCurrency(pay.amount)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-200">
                                                <span className="text-sm font-medium text-gray-600">Total Pembayaran</span>
                                                <span className="font-bold text-lg text-green-700">
                                                    {formatCurrency(selectedOrder.payments.reduce((sum, p) => sum + p.amount, 0))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
                        {selectedOrder?.status === 'Aktif' && (
                            <Button variant="outline" icon={Calendar} onClick={openExtendModal}>
                                Perpanjang Periode
                            </Button>
                        )}
                        <Button icon={Printer} onClick={() => { setShowDetailModal(false); openPrintPreview(selectedOrder); }}>Cetak</Button>
                    </ModalFooter>
                </Modal>

                {/* Extend Period Modal */}
                <Modal isOpen={showExtendModal} onClose={() => setShowExtendModal(false)} title="Perpanjang Periode Sewa">
                    <ModalBody>
                        {selectedOrder && (
                            <div className="space-y-6">
                                {/* Current Period Info */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Periode Saat Ini</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Tanggal Mulai</p>
                                            <p className="font-medium text-gray-900">{formatDate(selectedOrder.startDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Tanggal Selesai</p>
                                            <p className="font-medium text-gray-900">{formatDate(selectedOrder.endDate) || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* New End Date */}
                                <div>
                                    <Input
                                        label="Tanggal Selesai Baru"
                                        type="date"
                                        required
                                        value={newEndDate}
                                        onChange={(e) => setNewEndDate(e.target.value)}
                                        min={selectedOrder.endDate}
                                    />
                                </div>

                                {/* Calculation Summary */}
                                {extensionInfo.days > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Perhitungan Perpanjangan
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tambahan Hari:</span>
                                                <span className="font-medium text-gray-900">{extensionInfo.days} hari</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Biaya per Hari:</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(getTotalOrderValue(selectedOrder.items))}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                                                <span className="font-medium text-blue-700">Estimasi Biaya Tambahan:</span>
                                                <span className="font-bold text-blue-700">{formatCurrency(extensionInfo.cost)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {newEndDate && extensionInfo.days <= 0 && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-700">
                                        ⚠️ Tanggal baru harus setelah tanggal selesai saat ini ({selectedOrder.endDate})
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowExtendModal(false)}>Batal</Button>
                        <Button
                            onClick={handleExtendSubmit}
                            disabled={extensionInfo.days <= 0}
                        >
                            Konfirmasi Perpanjangan
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Print Preview Modal */}
                <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title="Preview Rental Order" size="lg">
                    <ModalBody>
                        <div className="border rounded-lg overflow-hidden">
                            <OrderPrint
                                ref={printRef}
                                order={{
                                    orderNumber: selectedOrder?.id,
                                    customerName: selectedOrder?.customer,
                                    projectName: selectedOrder?.project,
                                    location: selectedOrder?.location,
                                    pic: selectedOrder?.pic,
                                    phone: selectedOrder?.phone,
                                    startDate: selectedOrder?.startDate,
                                    endDate: selectedOrder?.endDate,
                                    status: selectedOrder?.status,
                                    deposit: selectedOrder?.deposit,
                                    items: selectedOrder?.items || [],
                                }}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowPrintModal(false)}>Tutup</Button>
                        <Button icon={Printer} onClick={handlePrint}>Cetak / Download PDF</Button>
                    </ModalFooter>
                </Modal>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Hapus Order"
                    message="Apakah Anda yakin ingin menghapus order ini? Semua data terkait (surat jalan, invoice) juga akan terpengaruh."
                    itemName={orderToDelete?.id}
                />
            </div>
        </Layout>
    )
}
