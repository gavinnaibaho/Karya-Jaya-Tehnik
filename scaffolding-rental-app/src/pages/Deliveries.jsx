import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Printer, X, Eye } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, StatusBadge, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, Select, Textarea } from '../components/ui'
import { DeliveryNotePrint } from '../components/print'

const mockDeliveries = [
    {
        id: 'SJK-2025-001',
        date: '2025-01-15',
        orderId: 'ORD-2025-001',
        customer: 'PT Maju Jaya',
        project: 'Proyek Mall Central',
        location: 'Jakarta Pusat',
        driver: 'Agus Supardi',
        vehicle: 'B 1234 CD',
        status: 'Selesai',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', unit: 'Unit', qty: 50 },
            { code: 'CB-150', name: 'Cross Brace 1.5m', unit: 'Unit', qty: 100 }
        ]
    },
    {
        id: 'SJK-2025-002',
        date: '2025-01-20',
        orderId: 'ORD-2025-002',
        customer: 'CV Bangun Sejahtera',
        project: 'Gedung Kantor ABC',
        location: 'Tangerang',
        driver: 'Joko Priyono',
        vehicle: 'B 5678 EF',
        status: 'Pending',
        items: [
            { code: 'MF-170', name: 'Main Frame 1.7m', unit: 'Unit', qty: 30 },
            { code: 'JB-60', name: 'Jack Base 60cm', unit: 'Unit', qty: 30 }
        ]
    },
]

export default function Deliveries() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [selectedDelivery, setSelectedDelivery] = useState(null)
    const printRef = useRef()

    const statusFilter = searchParams.get('status')

    // Merge mock deliveries with auto-generated SJ from orders in localStorage
    const getDeliveries = () => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')

        // Extract deliveries from orders that have delivery info
        const ordersWithDelivery = savedOrders
            .filter(order => order.delivery)
            .map(order => ({
                id: order.delivery.id,
                date: order.delivery.date,
                orderId: order.id,
                customer: order.customer,
                project: order.project,
                location: order.location || '-',
                driver: order.delivery.driver || '-',
                vehicle: order.delivery.vehicle || '-',
                status: order.delivery.status || 'Dijadwalkan',
                items: order.items?.map(item => ({
                    code: item.code || item.productCode,
                    name: item.name || item.productName,
                    unit: 'Unit',
                    qty: item.qty
                })) || []
            }))

        // Merge: orders with delivery first, then mock data
        const allDeliveries = [...ordersWithDelivery, ...mockDeliveries]

        // Remove duplicates by id
        return allDeliveries.filter((delivery, index, self) =>
            index === self.findIndex(d => d.id === delivery.id)
        )
    }

    const deliveries = getDeliveries()

    const filteredDeliveries = deliveries.filter(d => {
        const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.project.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || d.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const clearFilter = () => {
        setSearchParams({})
    }

    const handleViewDetail = (delivery) => {
        setSelectedDelivery(delivery)
        setShowDetailModal(true)
    }

    const openPrintPreview = (delivery) => {
        setSelectedDelivery(delivery)
        setShowPrintModal(true)
    }

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Surat-Jalan-${selectedDelivery?.id || 'SJK'}`,
    })

    return (
        <Layout title="Surat Jalan Kirim" subtitle="Kelola pengiriman barang ke customer">
            <div className="space-y-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari surat jalan..."
                                className="w-80"
                            />
                            {statusFilter && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                    <span className="text-sm text-orange-700">Filter: <strong>{statusFilter}</strong></span>
                                    <button onClick={clearFilter} className="text-orange-600 hover:text-orange-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                            📋 Surat Jalan otomatis dibuat saat membuat Order
                        </div>
                    </div>
                </Card>

                <Card padding={false}>
                    <Table>
                        <TableHeader>
                            <TableHead>No. SJ</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Status</TableHead>
                        </TableHeader>
                        <TableBody>
                            {filteredDeliveries.map((delivery) => (
                                <TableRow
                                    key={delivery.id}
                                    onClick={() => handleViewDetail(delivery)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <TableCell className="font-mono font-medium text-gray-900">{delivery.id}</TableCell>
                                    <TableCell className="text-gray-900">{delivery.date}</TableCell>
                                    <TableCell className="text-blue-600 font-medium">{delivery.orderId}</TableCell>
                                    <TableCell className="text-gray-900">{delivery.customer}</TableCell>
                                    <TableCell className="text-gray-600">{delivery.driver}</TableCell>
                                    <TableCell><StatusBadge status={delivery.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Detail Modal */}
                <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail ${selectedDelivery?.id}`} size="lg">
                    <ModalBody>
                        {selectedDelivery && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order</p>
                                        <p className="font-medium text-blue-600">{selectedDelivery.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <StatusBadge status={selectedDelivery.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Customer</p>
                                        <p className="font-medium text-gray-900">{selectedDelivery.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Proyek</p>
                                        <p className="font-medium text-gray-900">{selectedDelivery.project}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Kirim</p>
                                        <p className="font-medium text-gray-900">{selectedDelivery.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Driver</p>
                                        <p className="font-medium text-gray-900">{selectedDelivery.driver}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kendaraan</p>
                                        <p className="font-medium text-gray-900">{selectedDelivery.vehicle}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Barang yang Dikirim:</p>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-2">Kode</th>
                                                <th className="text-left p-2">Item</th>
                                                <th className="text-right p-2">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDelivery.items?.map((item, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td className="p-2 font-mono text-gray-600">{item.code}</td>
                                                    <td className="p-2">{item.name}</td>
                                                    <td className="p-2 text-right font-medium">{item.qty}</td>
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
                        <Button icon={Printer} onClick={() => { setShowDetailModal(false); openPrintPreview(selectedDelivery); }}>Cetak</Button>
                    </ModalFooter>
                </Modal>

                {/* Print Preview Modal */}
                <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title="Preview Surat Jalan" size="lg">
                    <ModalBody>
                        <div className="border rounded-lg overflow-hidden">
                            <DeliveryNotePrint
                                ref={printRef}
                                delivery={{
                                    deliveryNumber: selectedDelivery?.id,
                                    date: selectedDelivery?.date,
                                    customerName: selectedDelivery?.customer,
                                    projectName: selectedDelivery?.project,
                                    projectLocation: selectedDelivery?.location,
                                    orderNumber: selectedDelivery?.orderId,
                                    driverName: selectedDelivery?.driver,
                                    vehicleNumber: selectedDelivery?.vehicle,
                                    items: selectedDelivery?.items || [],
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
