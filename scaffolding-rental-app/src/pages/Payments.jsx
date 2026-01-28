import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, GradientCard, Button, SearchInput, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Select, Input } from '../components/ui'
import { formatCurrencyShort, formatCurrency } from '../lib/utils'

const mockPayments = [
    { id: 'PAY-2025-001', date: '2025-01-26', invoiceId: 'INV-2025-001', customer: 'PT Mega Proyek', amount: 25000000, method: 'Transfer Bank', ref: 'TRF-BCA-001' },
    { id: 'PAY-2025-002', date: '2025-01-22', invoiceId: 'INV-2025-002', customer: 'PT Konstruksi Bangunan', amount: 50000000, method: 'Transfer Bank', ref: 'TRF-BCA-002' },
    { id: 'PAY-2025-003', date: '2025-01-18', invoiceId: 'INV-2025-003', customer: 'CV Jaya Abadi', amount: 45000000, method: 'Cash', ref: 'CASH-001' },
]

export default function Payments() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)

    const totalMonth = mockPayments.reduce((sum, p) => sum + p.amount, 0)

    const handleSubmit = () => {
        alert('Pembayaran berhasil dicatat!')
        setShowModal(false)
    }

    return (
        <Layout title="Pembayaran" subtitle="Kelola pencatatan pembayaran">
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <GradientCard title="Total Diterima Bulan Ini" value={formatCurrencyShort(totalMonth)} gradient="green" />
                    <GradientCard title="Jumlah Transaksi" value={`${mockPayments.length} Transaksi`} gradient="blue" />
                    <GradientCard title="Rata-rata Pembayaran" value={formatCurrencyShort(totalMonth / mockPayments.length)} gradient="purple" />
                </div>

                <Card>
                    <div className="flex items-center justify-between">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Cari pembayaran..."
                            className="w-80"
                        />
                        <Button icon={Plus} onClick={() => setShowModal(true)}>
                            Catat Pembayaran
                        </Button>
                    </div>
                </Card>

                <Card padding={false}>
                    <Table>
                        <TableHeader>
                            <TableHead>No. Ref</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead align="right">Jumlah</TableHead>
                            <TableHead>Metode</TableHead>
                        </TableHeader>
                        <TableBody>
                            {mockPayments.map((pay) => (
                                <TableRow key={pay.id}>
                                    <TableCell className="font-mono font-medium text-gray-900">{pay.id}</TableCell>
                                    <TableCell className="text-gray-900">{pay.date}</TableCell>
                                    <TableCell className="text-blue-600 font-medium">{pay.invoiceId}</TableCell>
                                    <TableCell className="text-gray-900">{pay.customer}</TableCell>
                                    <TableCell align="right" className="font-bold text-green-600">{formatCurrencyShort(pay.amount)}</TableCell>
                                    <TableCell className="text-gray-600">{pay.method}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Catat Pembayaran" size="sm">
                    <ModalBody className="space-y-4">
                        <Select
                            label="Pilih Invoice"
                            required
                            options={[
                                { value: 'INV-2025-001', label: 'INV-2025-001 - Sisa: Rp 50jt' },
                                { value: 'INV-2025-002', label: 'INV-2025-002 - Sisa: Rp 75jt' },
                            ]}
                        />
                        <Input label="Jumlah Bayar" type="number" required placeholder="0" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Tanggal" type="date" required />
                            <Select
                                label="Metode"
                                options={[
                                    { value: 'Transfer Bank', label: 'Transfer Bank' },
                                    { value: 'Cash', label: 'Cash' },
                                    { value: 'Cek/Giro', label: 'Cek/Giro' },
                                ]}
                            />
                        </div>
                        <Input label="No. Referensi" placeholder="TRF-..." />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button variant="success" onClick={handleSubmit}>Simpan</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}
