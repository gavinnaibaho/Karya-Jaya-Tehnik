import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Printer, X, Eye } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, StatusBadge, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, Select, Textarea } from '../components/ui'
import { ReturnNotePrint } from '../components/print'

const mockReturns = [
    {
        id: 'SJR-2025-001',
        date: '2025-01-25',
        orderId: 'ORD-2025-003',
        customer: 'PT Konstruksi Nusantara',
        project: 'Apartemen Green Hills',
        receiver: 'Wahyu',
        status: 'Selesai',
        condition: 'Baik',
        items: [
            { name: 'Main Frame 1.7m', qty: 80, condition: 'Baik' },
            { name: 'Cross Brace 1.5m', qty: 160, condition: 'Baik' }
        ]
    },
    {
        id: 'SJR-2025-002',
        date: '2025-01-26',
        orderId: 'ORD-2025-001',
        customer: 'PT Maju Jaya',
        project: 'Proyek Mall Central',
        receiver: 'Budi',
        status: 'Pending',
        condition: 'Baik',
        items: [
            { name: 'Main Frame 1.7m', qty: 50, condition: 'Baik' },
            { name: 'Cross Brace 1.5m', qty: 100, condition: 'Rusak Ringan' }
        ]
    },
]

export default function Returns() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [selectedReturn, setSelectedReturn] = useState(null)
    const [formData, setFormData] = useState({ orderId: '', receiver: '', notes: '' })
    const [returnItems, setReturnItems] = useState([])
    const printRef = useRef()

    const statusFilter = searchParams.get('status')

    const filteredReturns = mockReturns.filter(r => {
        const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.customer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || r.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const clearFilter = () => {
        setSearchParams({})
    }

    const handleReturnItemChange = (index, field, value) => {
        setReturnItems(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const handleSubmit = () => {
        const totalReturn = returnItems.reduce((sum, item) => sum + (item.returnQty || 0), 0)
        if (totalReturn === 0) {
            alert('Harap masukkan jumlah barang yang diretur!')
            return
        }
        alert(`SJ Retur berhasil dibuat! ${totalReturn} unit barang akan diretur.`)
        setShowModal(false)
        setFormData({ orderId: '', receiver: '', notes: '' })
        setReturnItems([])
    }

    const handleViewDetail = (ret) => {
        setSelectedReturn(ret)
        setShowDetailModal(true)
    }

    const openPrintPreview = (ret) => {
        setSelectedReturn(ret)
        setShowPrintModal(true)
    }

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Surat-Jalan-Retur-${selectedReturn?.id || 'SJR'}`,
    })

    return (
        <Layout title="Surat Jalan Retur" subtitle="Kelola pengembalian barang dari customer">
            <div className="space-y-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari surat jalan retur..."
                                className="w-80"
                            />
                            {statusFilter && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                                    <span className="text-sm text-purple-700">Filter: <strong>{statusFilter}</strong></span>
                                    <button onClick={clearFilter} className="text-purple-600 hover:text-purple-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <Button icon={Plus} onClick={() => setShowModal(true)}>
                            Buat SJ Retur
                        </Button>
                    </div>
                </Card>

                <Card padding={false}>
                    <Table>
                        <TableHeader>
                            <TableHead>No. SJR</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Penerima</TableHead>
                            <TableHead>Status</TableHead>
                        </TableHeader>
                        <TableBody>
                            {filteredReturns.map((ret) => (
                                <TableRow
                                    key={ret.id}
                                    onClick={() => handleViewDetail(ret)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <TableCell className="font-mono font-medium text-gray-900">{ret.id}</TableCell>
                                    <TableCell className="text-gray-900">{ret.date}</TableCell>
                                    <TableCell className="text-blue-600 font-medium">{ret.orderId}</TableCell>
                                    <TableCell className="text-gray-900">{ret.customer}</TableCell>
                                    <TableCell className="text-gray-600">{ret.receiver}</TableCell>
                                    <TableCell><StatusBadge status={ret.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Create Partial Return Modal */}
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Buat Surat Jalan Retur" size="lg">
                    <ModalBody className="space-y-4">
                        <Select
                            label="Pilih Order"
                            required
                            value={formData.orderId}
                            onChange={(e) => {
                                const orderId = e.target.value
                                setFormData({ ...formData, orderId })
                                // Simulate loading items from order
                                if (orderId === 'ORD-2025-001') {
                                    setReturnItems([
                                        { code: 'MF-170', name: 'Main Frame 1.7m', rentedQty: 50, returnQty: 0, condition: 'Baik' },
                                        { code: 'CB-150', name: 'Cross Brace 1.5m', rentedQty: 100, returnQty: 0, condition: 'Baik' },
                                    ])
                                } else if (orderId === 'ORD-2025-002') {
                                    setReturnItems([
                                        { code: 'MF-170', name: 'Main Frame 1.7m', rentedQty: 30, returnQty: 0, condition: 'Baik' },
                                        { code: 'JB-60', name: 'Jack Base 60cm', rentedQty: 30, returnQty: 0, condition: 'Baik' },
                                    ])
                                } else {
                                    setReturnItems([])
                                }
                            }}
                            options={[
                                { value: 'ORD-2025-001', label: 'ORD-2025-001 - PT Maju Jaya' },
                                { value: 'ORD-2025-002', label: 'ORD-2025-002 - CV Bangun Sejahtera' },
                            ]}
                        />

                        {/* Return Items with Partial Qty */}
                        {returnItems.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-2 border-b">
                                    <h4 className="font-medium text-gray-700">Barang yang Akan Diretur</h4>
                                    <p className="text-xs text-gray-500">Masukkan jumlah barang yang diretur (bisa sebagian)</p>
                                </div>
                                <div className="divide-y">
                                    {returnItems.map((item, index) => (
                                        <div key={index} className="p-4 grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-5">
                                                <p className="font-medium text-gray-900">{item.code}</p>
                                                <p className="text-sm text-gray-500">{item.name}</p>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Tersewa</p>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                                                    {item.rentedQty}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500 mb-1">Retur</p>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.rentedQty}
                                                    value={item.returnQty}
                                                    onChange={(e) => handleReturnItemChange(index, 'returnQty', parseInt(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <p className="text-xs text-gray-500 mb-1">Kondisi</p>
                                                <select
                                                    value={item.condition}
                                                    onChange={(e) => handleReturnItemChange(index, 'condition', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500"
                                                >
                                                    <option value="Baik">Baik</option>
                                                    <option value="Rusak Ringan">Rusak Ringan</option>
                                                    <option value="Rusak Berat">Rusak Berat</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Barang Diretur:</span>
                                    <span className="font-bold text-red-600">
                                        {returnItems.reduce((sum, item) => sum + (item.returnQty || 0), 0)} unit
                                    </span>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Penerima di Gudang"
                            required
                            value={formData.receiver}
                            onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                            placeholder="Nama penerima..."
                        />
                        <Textarea
                            label="Catatan"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan retur..."
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button onClick={handleSubmit}>Simpan</Button>
                    </ModalFooter>
                </Modal>

                {/* Detail Modal */}
                <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail ${selectedReturn?.id}`} size="lg">
                    <ModalBody>
                        {selectedReturn && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order</p>
                                        <p className="font-medium text-blue-600">{selectedReturn.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <StatusBadge status={selectedReturn.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Customer</p>
                                        <p className="font-medium text-gray-900">{selectedReturn.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Proyek</p>
                                        <p className="font-medium text-gray-900">{selectedReturn.project}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Retur</p>
                                        <p className="font-medium text-gray-900">{selectedReturn.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Penerima</p>
                                        <p className="font-medium text-gray-900">{selectedReturn.receiver}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Barang yang Dikembalikan:</p>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-2">Item</th>
                                                <th className="text-right p-2">Qty</th>
                                                <th className="text-left p-2">Kondisi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReturn.items?.map((item, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td className="p-2">{item.name}</td>
                                                    <td className="p-2 text-right font-medium">{item.qty}</td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs ${item.condition === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {item.condition}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
                        <Button icon={Printer} onClick={() => { setShowDetailModal(false); openPrintPreview(selectedReturn); }}>Cetak</Button>
                    </ModalFooter>
                </Modal>

                {/* Print Preview Modal */}
                <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title="Preview Surat Jalan Retur" size="lg">
                    <ModalBody>
                        <div className="border rounded-lg overflow-hidden">
                            <ReturnNotePrint
                                ref={printRef}
                                returnNote={{
                                    returnNumber: selectedReturn?.id,
                                    date: selectedReturn?.date,
                                    customerName: selectedReturn?.customer,
                                    projectName: selectedReturn?.project,
                                    orderNumber: selectedReturn?.orderId,
                                    receiver: selectedReturn?.receiver,
                                    condition: selectedReturn?.condition,
                                    items: selectedReturn?.items || [],
                                }}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowPrintModal(false)}>Tutup</Button>
                        <Button icon={Printer} onClick={handlePrint}>Cetak / Download PDF</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}
