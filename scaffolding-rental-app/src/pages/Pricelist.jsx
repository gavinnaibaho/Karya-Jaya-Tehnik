import { useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw, Package, AlertTriangle } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, Select, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, StatusBadge } from '../components/ui'
import { formatCurrency } from '../lib/utils'
import { useProducts } from '../hooks/useProducts'
import toast from 'react-hot-toast'

export default function Pricelist() {
    const { products, loading, createProduct, updateProduct, fetchProducts } = useProducts()
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showStockModal, setShowStockModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productToDelete, setProductToDelete] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: '',
        unit: 'Unit',
        price_daily: 0,
        price_weekly: 0,
        price_monthly: 0,
        stock_total: 0,
        stock_available: 0
    })

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

    const filteredProducts = products.filter(item => {
        const matchSearch = item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCategory = !categoryFilter || item.category === categoryFilter
        return matchSearch && matchCategory
    })

    // Stock calculations
    const totalItems = products.reduce((sum, i) => sum + (i.stock_total || 0), 0)
    const totalAvailable = products.reduce((sum, i) => sum + (i.stock_available || 0), 0)
    const totalRented = totalItems - totalAvailable
    const lowStockItems = products.filter(item => (item.stock_available || 0) <= 50)

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                code: product.code || '',
                name: product.name || '',
                category: product.category || '',
                unit: product.unit || 'Unit',
                price_daily: product.price_daily || 0,
                price_weekly: product.price_weekly || 0,
                price_monthly: product.price_monthly || 0,
                stock_total: product.stock_total || 0,
                stock_available: product.stock_available || 0
            })
        } else {
            setEditingProduct(null)
            setFormData({
                code: '', name: '', category: '', unit: 'Unit',
                price_daily: 0, price_weekly: 0, price_monthly: 0,
                stock_total: 0, stock_available: 0
            })
        }
        setShowModal(true)
    }

    const handleSubmit = async () => {
        if (!formData.code || !formData.name) {
            toast.error('Kode dan Nama item wajib diisi!')
            return
        }

        if (editingProduct) {
            const { error } = await updateProduct(editingProduct.id, formData)
            if (error) {
                toast.error('Gagal update item')
            } else {
                toast.success('Item berhasil diupdate!')
            }
        } else {
            const { error } = await createProduct(formData)
            if (error) {
                toast.error('Gagal menambah item')
            } else {
                toast.success('Item berhasil ditambahkan!')
            }
        }
        setShowModal(false)
    }

    const handleDelete = async () => {
        if (!productToDelete) return

        const { error } = await updateProduct(productToDelete.id, { status: 'inactive' })
        if (error) {
            toast.error('Gagal menghapus item')
        } else {
            toast.success('Item berhasil dihapus!')
            fetchProducts()
        }
        setShowDeleteModal(false)
        setProductToDelete(null)
    }

    return (
        <Layout title="Pricelist" subtitle="Daftar harga sewa scaffolding">
            <div className="space-y-6">
                {/* Filters */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari kode atau nama item..."
                                className="w-full sm:w-64"
                            />
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Kategori' },
                                    ...categories.map(c => ({ value: c, label: c }))
                                ]}
                                className="w-full sm:w-40"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" icon={Package} onClick={() => setShowStockModal(true)}>
                                Stok Barang
                            </Button>
                            <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchProducts}>
                                Refresh
                            </Button>
                            <Button icon={Plus} onClick={() => handleOpenModal()}>
                                Tambah Item
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Products Table */}
                <Card padding={false}>
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-gray-200">
                                {filteredProducts.map((item) => (
                                    <div key={item.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="text-xs font-mono text-gray-500">{item.code}</span>
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleOpenModal(item)} className="text-blue-600">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { setProductToDelete(item); setShowDeleteModal(true); }} className="text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                                            <div>
                                                <p className="text-gray-500">Harian</p>
                                                <p className="font-medium text-red-600">{formatCurrency(item.price_daily)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Mingguan</p>
                                                <p className="font-medium">{formatCurrency(item.price_weekly)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Stok</p>
                                                <p className="font-medium">{item.stock_available}/{item.stock_total}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden sm:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Item</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead align="right">Harga Harian</TableHead>
                                        <TableHead align="right">Harga Mingguan</TableHead>
                                        <TableHead align="right">Harga Bulanan</TableHead>
                                        <TableHead align="center">Stok</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-mono text-gray-900">{item.code}</TableCell>
                                                <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                                <TableCell>
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="right" className="text-red-600 font-medium">
                                                    {formatCurrency(item.price_daily)}
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(item.price_weekly)}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.price_monthly)}</TableCell>
                                                <TableCell align="center">
                                                    <span className={`font-medium ${item.stock_available <= 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {item.stock_available}
                                                    </span>
                                                    <span className="text-gray-400">/{item.stock_total}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-700">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => { setProductToDelete(item); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Item' : 'Tambah Item Baru'} size="md">
                    <ModalBody className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Kode Item"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="MF-XXX"
                            />
                            <Select
                                label="Kategori"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                options={[
                                    { value: '', label: 'Pilih Kategori' },
                                    { value: 'Main Frame', label: 'Main Frame' },
                                    { value: 'Cross Brace', label: 'Cross Brace' },
                                    { value: 'Jack Base', label: 'Jack Base' },
                                    { value: 'U-Head', label: 'U-Head' },
                                    { value: 'Joint Pin', label: 'Joint Pin' },
                                    { value: 'Ledger', label: 'Ledger' },
                                    { value: 'Platform', label: 'Platform' },
                                ]}
                            />
                        </div>
                        <Input
                            label="Nama Item"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama lengkap item..."
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Harga/Hari"
                                type="number"
                                value={formData.price_daily}
                                onChange={(e) => setFormData({ ...formData, price_daily: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Harga/Minggu"
                                type="number"
                                value={formData.price_weekly}
                                onChange={(e) => setFormData({ ...formData, price_weekly: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Harga/Bulan"
                                type="number"
                                value={formData.price_monthly}
                                onChange={(e) => setFormData({ ...formData, price_monthly: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Total Stok"
                                type="number"
                                value={formData.stock_total}
                                onChange={(e) => setFormData({ ...formData, stock_total: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Stok Tersedia"
                                type="number"
                                value={formData.stock_available}
                                onChange={(e) => setFormData({ ...formData, stock_available: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button onClick={handleSubmit}>{editingProduct ? 'Simpan Perubahan' : 'Tambah Item'}</Button>
                    </ModalFooter>
                </Modal>

                {/* Delete Modal */}
                <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Konfirmasi Hapus" size="sm">
                    <ModalBody>
                        <p className="text-gray-600">Apakah Anda yakin ingin menghapus <strong>{productToDelete?.name}</strong>?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Batal</Button>
                        <Button variant="danger" onClick={handleDelete}>Hapus</Button>
                    </ModalFooter>
                </Modal>

                {/* Stock Modal */}
                <Modal isOpen={showStockModal} onClose={() => setShowStockModal(false)} title="Stok Barang" size="lg">
                    <ModalBody>
                        <div className="space-y-6">
                            {/* Low Stock Alert */}
                            {lowStockItems.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-amber-800">Stok Hampir Habis!</p>
                                        <p className="text-sm text-amber-700">
                                            {lowStockItems.length} item memiliki stok tersedia kurang dari 50 unit
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Summary Cards */}
                            <div className="grid grid-cols-4 gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Total</p>
                                    <p className="text-lg font-bold text-gray-900">{totalItems.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Tersedia</p>
                                    <p className="text-lg font-bold text-green-600">{totalAvailable.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Disewakan</p>
                                    <p className="text-lg font-bold text-orange-600">{totalRented.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">Stok Rendah</p>
                                    <p className="text-lg font-bold text-red-600">{lowStockItems.length} item</p>
                                </div>
                            </div>

                            {/* Stock Table */}
                            <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="text-left p-3 font-medium text-gray-600">Kode</th>
                                            <th className="text-left p-3 font-medium text-gray-600">Nama Item</th>
                                            <th className="text-right p-3 font-medium text-gray-600">Total</th>
                                            <th className="text-right p-3 font-medium text-gray-600">Tersedia</th>
                                            <th className="text-right p-3 font-medium text-gray-600">Disewa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((item) => (
                                            <tr key={item.id} className={item.stock_available <= 50 ? 'bg-red-50' : ''}>
                                                <td className="p-3 font-mono text-gray-900">{item.code}</td>
                                                <td className="p-3 text-gray-900">{item.name}</td>
                                                <td className="p-3 text-right text-gray-900">{item.stock_total || 0}</td>
                                                <td className={`p-3 text-right font-medium ${item.stock_available <= 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {item.stock_available || 0}
                                                </td>
                                                <td className="p-3 text-right text-orange-600">
                                                    {(item.stock_total || 0) - (item.stock_available || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowStockModal(false)}>Tutup</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}

