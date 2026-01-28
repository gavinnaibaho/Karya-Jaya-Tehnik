import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, FileText, Receipt, DollarSign, X, Clock } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, StatCard, Button, StatusBadge, Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/ui'
import { useActionItems } from '../hooks/useActionItems'

export default function Dashboard() {
    const navigate = useNavigate()
    const { actionItems, counts, filterByCategory, loading } = useActionItems()
    const [activeFilter, setActiveFilter] = useState(null)

    // Get filtered items based on active filter
    const filteredItems = filterByCategory(activeFilter)

    const handleCardClick = (category) => {
        setActiveFilter(activeFilter === category ? null : category)
    }

    const clearFilter = () => {
        setActiveFilter(null)
    }

    const getNavigationPath = (item) => {
        if (item.type === 'order') return `/orders`
        if (item.type === 'sj') return `/deliveries`
        if (item.type === 'return') return `/returns`
        if (item.type === 'invoice') return `/invoices`
        return '/'
    }

    // Get priority badge color
    const getPriorityColor = (priority) => {
        if (priority <= 2) return 'bg-red-100 text-red-700'
        if (priority <= 4) return 'bg-yellow-100 text-yellow-700'
        return 'bg-gray-100 text-gray-600'
    }

    return (
        <Layout title="Dashboard" subtitle="Overview manajemen persewaan scaffolding">
            <div className="space-y-6 lg:space-y-8">
                {/* Summary Cards - Clickable to filter */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <div className={`rounded-xl ${activeFilter === 'Order Aktif' ? 'ring-2 ring-blue-500' : ''}`}>
                        <StatCard
                            title="Order Aktif"
                            value={counts.orderAktif}
                            subtitle="Sedang disewakan"
                            icon={Package}
                            color="blue"
                            onClick={() => handleCardClick('Order Aktif')}
                        />
                    </div>
                    <div className={`rounded-xl ${activeFilter === 'SJ Pending' ? 'ring-2 ring-orange-500' : ''}`}>
                        <StatCard
                            title="SJ Pending"
                            value={counts.sjPending}
                            subtitle="Menunggu proses"
                            icon={FileText}
                            color="orange"
                            onClick={() => handleCardClick('SJ Pending')}
                        />
                    </div>
                    <div className={`rounded-xl ${activeFilter === 'Order Draft' ? 'ring-2 ring-purple-500' : ''}`}>
                        <StatCard
                            title="Order Draft"
                            value={counts.orderDraft}
                            subtitle="Belum diproses"
                            icon={Receipt}
                            color="purple"
                            onClick={() => handleCardClick('Order Draft')}
                        />
                    </div>
                    <div className={`rounded-xl ${activeFilter === 'Invoice Belum Bayar' ? 'ring-2 ring-red-500' : ''}`}>
                        <StatCard
                            title="Invoice Belum Bayar"
                            value={counts.invoiceBelumBayar}
                            subtitle="Perlu ditagih"
                            icon={DollarSign}
                            color="red"
                            onClick={() => handleCardClick('Invoice Belum Bayar')}
                        />
                    </div>
                </div>

                {/* Action Items Table */}
                <Card padding={false}>
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-gray-900">Butuh Tindakan</h2>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                        {actionItems.length} item
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                                    {activeFilter ? `Menampilkan: ${activeFilter}` : 'Diurutkan berdasarkan prioritas (otomatis)'}
                                </p>
                            </div>
                            {activeFilter && (
                                <button
                                    onClick={clearFilter}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Hapus Filter</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : (
                        <>
                            {/* Mobile card view */}
                            <div className="sm:hidden divide-y divide-gray-200">
                                {filteredItems.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p>Tidak ada tindakan yang diperlukan</p>
                                    </div>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <div key={idx} className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono font-medium text-gray-900">{item.id}</span>
                                                <StatusBadge status={item.status} />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{item.customer}</p>
                                            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                                                    {item.nextAction}
                                                </span>
                                                <Button size="sm" onClick={() => navigate(getNavigationPath(item))}>Proses</Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Desktop table view */}
                            <div className="hidden sm:block">
                                <Table>
                                    <TableHeader>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Next Action</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                                    <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                                    <p>Tidak ada tindakan yang diperlukan</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredItems.map((item, idx) => (
                                                <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{item.id}</td>
                                                    <td className="px-6 py-4 text-gray-900">{item.customer}</td>
                                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(item.priority)}`}>
                                                            {item.nextAction}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button size="sm" onClick={() => navigate(getNavigationPath(item))}>Proses</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </Card>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white text-sm">
                    <p className="font-medium mb-1">💡 Sistem Otomatis</p>
                    <p className="text-blue-100">
                        Tabel di atas diurutkan berdasarkan prioritas. Item dengan warna merah = urgent, kuning = perlu perhatian.
                    </p>
                </div>
            </div>
        </Layout>
    )
}
