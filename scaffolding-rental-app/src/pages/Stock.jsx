import { useState } from 'react'
import { Plus, AlertTriangle, Package } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, StatusBadge, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, Select } from '../components/ui'

const mockStock = [
    { id: 1, code: 'MF-170', name: 'Main Frame 1.7m x 1.5m', category: 'Main Frame', total: 500, available: 280, rented: 220, status: 'active' },
    { id: 2, code: 'CB-150', name: 'Cross Brace 1.5m', category: 'Cross Brace', total: 800, available: 450, rented: 350, status: 'active' },
    { id: 3, code: 'JB-60', name: 'Jack Base Adjustable 60cm', category: 'Jack Base', total: 300, available: 50, rented: 250, status: 'active' },
    { id: 4, code: 'UH-40', name: 'U-Head 40cm', category: 'U-Head', total: 250, available: 100, rented: 150, status: 'active' },
    { id: 5, code: 'JP-10', name: 'Joint Pin 10cm', category: 'Joint Pin', total: 1000, available: 20, rented: 980, status: 'active' },
]

export default function Stock() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)

    const filteredStock = mockStock.filter(item =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const lowStockItems = mockStock.filter(item => item.available <= 50)
    const totalItems = mockStock.reduce((sum, i) => sum + i.total, 0)
    const totalAvailable = mockStock.reduce((sum, i) => sum + i.available, 0)
    const totalRented = mockStock.reduce((sum, i) => sum + i.rented, 0)

    return (
        <Layout title="Stok Barang" subtitle="Kelola inventaris scaffolding">
            <div className="space-y-6">
                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-amber-800">Stok Hampir Habis!</p>
                            <p className="text-sm text-amber-700">
                                {lowStockItems.length} item memiliki stok tersedia kurang dari 50 unit:
                                {lowStockItems.map(i => ` ${i.code}`).join(',')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="grid grid-cols-4 gap-4">
                    <Card className="border-2 border-blue-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Inventaris</p>
                        <p className="text-2xl font-bold text-gray-900">{totalItems.toLocaleString()} unit</p>
                    </Card>
                    <Card className="border-2 border-green-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tersedia</p>
                        <p className="text-2xl font-bold text-green-600">{totalAvailable.toLocaleString()} unit</p>
                    </Card>
                    <Card className="border-2 border-orange-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Disewakan</p>
                        <p className="text-2xl font-bold text-orange-600">{totalRented.toLocaleString()} unit</p>
                    </Card>
                    <Card className="border-2 border-red-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Stok Rendah</p>
                        <p className="text-2xl font-bold text-red-600">{lowStockItems.length} item</p>
                    </Card>
                </div>

                <Card>
                    <div className="flex items-center justify-between">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Cari kode atau nama item..."
                            className="w-80"
                        />
                        <Button icon={Plus} onClick={() => setShowModal(true)}>
                            Tambah Item
                        </Button>
                    </div>
                </Card>

                <Card padding={false}>
                    <Table>
                        <TableHeader>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama Item</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead align="right">Total</TableHead>
                            <TableHead align="right">Tersedia</TableHead>
                            <TableHead align="right">Disewakan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableHeader>
                        <TableBody>
                            {filteredStock.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium text-gray-900">{item.code}</TableCell>
                                    <TableCell className="text-gray-900">{item.name}</TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right" className="text-gray-900">{item.total}</TableCell>
                                    <TableCell align="right" className={`font-medium ${item.available <= 50 ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.available}
                                    </TableCell>
                                    <TableCell align="right" className="text-orange-600">{item.rented}</TableCell>
                                    <TableCell><StatusBadge status={item.status} /></TableCell>
                                    <TableCell>
                                        <button className="text-red-600 hover:text-red-700 font-medium text-sm mr-3">Edit</button>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Riwayat</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Item Baru">
                    <ModalBody className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Kode Item" required placeholder="MF-XXX" />
                            <Select
                                label="Kategori"
                                required
                                options={[
                                    { value: 'Main Frame', label: 'Main Frame' },
                                    { value: 'Cross Brace', label: 'Cross Brace' },
                                    { value: 'Jack Base', label: 'Jack Base' },
                                    { value: 'U-Head', label: 'U-Head' },
                                    { value: 'Joint Pin', label: 'Joint Pin' },
                                ]}
                            />
                        </div>
                        <Input label="Nama Item" required placeholder="Nama lengkap item..." />
                        <Input label="Jumlah Stok Awal" type="number" required placeholder="0" />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button onClick={() => { alert('Item berhasil ditambahkan!'); setShowModal(false); }}>Simpan</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}
