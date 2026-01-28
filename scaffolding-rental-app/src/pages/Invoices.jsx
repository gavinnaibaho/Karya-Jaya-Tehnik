import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Plus, Printer, Eye, Search, Filter, X, CreditCard, FileText, CheckSquare } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, StatusBadge, Modal, ModalBody, ModalFooter, Select, Input } from '../components/ui'
import { InvoicePrint, InvoiceReceiptPrint } from '../components/print'
import { formatCurrency, formatDate } from '../lib/utils'
import { useInvoices } from '../hooks/useInvoices'
import toast from 'react-hot-toast'

export default function Invoices() {
    const { invoices, loading, getSummary } = useInvoices()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [formData, setFormData] = useState({ orderId: '', dueDate: '', notes: '' })
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentData, setPaymentData] = useState({ amount: '', method: 'Transfer Bank', date: new Date().toISOString().split('T')[0], note: '' })
    const [showReceiptModal, setShowReceiptModal] = useState(false)
    const [selectedInvoices, setSelectedInvoices] = useState([])
    const [showSelectMode, setShowSelectMode] = useState(false)
    const printRef = useRef()
    const receiptPrintRef = useRef()
    const summary = getSummary()

    const statusFilter = searchParams.get('status')

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !statusFilter || inv.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const clearFilter = () => {
        setSearchParams({})
    }

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: selectedInvoice?.invoice_number || 'Invoice',
        onAfterPrint: () => toast.success('Invoice berhasil dicetak/di-download!')
    })

    const openPrintPreview = (invoice) => {
        setSelectedInvoice(invoice)
        setShowPrintModal(true)
    }

    const openDetail = (invoice) => {
        setSelectedInvoice(invoice)
        setShowDetailModal(true)
    }

    const handleCreateInvoice = () => {
        toast.success('Invoice berhasil dibuat!')
        setShowCreateModal(false)
        setFormData({ orderId: '', dueDate: '', notes: '' })
    }

    const openPaymentModal = () => {
        setPaymentData({
            amount: selectedInvoice?.total - selectedInvoice?.paid_amount || '',
            method: 'Transfer Bank',
            date: new Date().toISOString().split('T')[0],
            note: ''
        })
        setShowPaymentModal(true)
    }

    const handleRecordPayment = () => {
        if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
            toast.error('Masukkan jumlah pembayaran yang valid')
            return
        }

        const remainingAmount = selectedInvoice.total - selectedInvoice.paid_amount
        if (parseFloat(paymentData.amount) > remainingAmount) {
            toast.error(`Jumlah pembayaran melebihi sisa tagihan (${formatCurrency(remainingAmount)})`)
            return
        }

        // Generate payment ID
        const paymentId = `PAY-${Date.now().toString().slice(-6)}`

        // Create payment record
        const newPayment = {
            id: paymentId,
            date: paymentData.date,
            amount: parseFloat(paymentData.amount),
            method: paymentData.method,
            note: paymentData.note
        }

        // Update selected invoice with new payment
        const updatedInvoice = {
            ...selectedInvoice,
            paid_amount: selectedInvoice.paid_amount + parseFloat(paymentData.amount),
            payments: [...(selectedInvoice.payments || []), newPayment],
            status: selectedInvoice.paid_amount + parseFloat(paymentData.amount) >= selectedInvoice.total ? 'Lunas' : 'Sebagian'
        }

        setSelectedInvoice(updatedInvoice)
        setShowPaymentModal(false)
        toast.success(`Pembayaran ${formatCurrency(parseFloat(paymentData.amount))} berhasil dicatat!`)
    }

    // Toggle invoice selection for receipt
    const toggleInvoiceSelection = (invoice) => {
        setSelectedInvoices(prev => {
            const isSelected = prev.find(inv => inv.invoice_number === invoice.invoice_number)
            if (isSelected) {
                return prev.filter(inv => inv.invoice_number !== invoice.invoice_number)
            } else {
                return [...prev, invoice]
            }
        })
    }

    // Select all outstanding invoices from same customer
    const selectAllFromCustomer = (customerName) => {
        const customerInvoices = invoices.filter(inv =>
            inv.customer?.name === customerName && inv.status !== 'Lunas'
        )
        setSelectedInvoices(customerInvoices)
    }

    // Open receipt modal
    const openReceiptModal = () => {
        if (selectedInvoices.length === 0) {
            toast.error('Pilih minimal 1 invoice untuk membuat tanda terima')
            return
        }
        setShowReceiptModal(true)
    }

    // Print receipt handler
    const handlePrintReceipt = useReactToPrint({
        contentRef: receiptPrintRef,
        documentTitle: `Tanda-Terima-Invoice-${Date.now()}`,
        onAfterPrint: () => {
            toast.success('Tanda Terima berhasil dicetak/di-download!')
            setShowReceiptModal(false)
            setShowSelectMode(false)
            setSelectedInvoices([])
        }
    })

    return (
        <Layout title="Invoice" subtitle="Kelola tagihan dan faktur">
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total Tagihan</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(summary.total)}</p>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Sudah Dibayar</p>
                        <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(summary.paid)}</p>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Outstanding</p>
                        <p className="text-xl font-bold text-orange-600 mt-1">{formatCurrency(summary.outstanding)}</p>
                    </Card>
                    <Card className="border-l-4 border-l-red-500">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Jatuh Tempo</p>
                        <p className="text-xl font-bold text-red-600 mt-1">{summary.overdue} invoice</p>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Cari no. invoice atau customer..."
                                className="w-full sm:w-80"
                            />
                            {statusFilter && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="text-sm text-red-700">Filter: <strong>{statusFilter}</strong></span>
                                    <button onClick={clearFilter} className="text-red-600 hover:text-red-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {showSelectMode ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowSelectMode(false)
                                            setSelectedInvoices([])
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        icon={FileText}
                                        onClick={openReceiptModal}
                                        disabled={selectedInvoices.length === 0}
                                    >
                                        Buat Tanda Terima ({selectedInvoices.length})
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        icon={CheckSquare}
                                        onClick={() => setShowSelectMode(true)}
                                    >
                                        Pilih Invoice
                                    </Button>
                                    <Button icon={Plus} onClick={() => setShowCreateModal(true)}>Buat Invoice</Button>
                                </>
                            )}
                        </div>
                    </div>
                    {showSelectMode && (
                        <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                            💡 Klik baris invoice untuk memilih. Pilih beberapa invoice untuk membuat Tanda Terima Dokumen.
                        </div>
                    )}
                </Card>

                {/* Invoice Table */}
                <Card padding={false}>
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-gray-200">
                                {filteredInvoices.map((inv) => (
                                    <div key={inv.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-mono font-medium text-gray-900">{inv.invoice_number}</p>
                                                <p className="text-sm text-gray-600">{inv.customer?.name || inv.order?.customer?.name}</p>
                                            </div>
                                            <StatusBadge status={inv.status} />
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Total: <span className="font-medium text-gray-900">{formatCurrency(inv.total)}</span></p>
                                                <p className="text-xs text-gray-500">Jatuh tempo: {formatDate(inv.due_date)}</p>
                                            </div>
                                            <Button size="sm" variant="outline" icon={Printer} onClick={() => openPrintPreview(inv)}>
                                                Cetak
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden sm:block">
                                <Table>
                                    <TableHeader>
                                        <TableHead>No. Invoice</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Tgl Invoice</TableHead>
                                        <TableHead>Jatuh Tempo</TableHead>
                                        <TableHead align="right">Total</TableHead>
                                        <TableHead align="right">Dibayar</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInvoices.map((inv) => {
                                            const isSelected = selectedInvoices.find(s => s.invoice_number === inv.invoice_number)
                                            return (
                                                <TableRow
                                                    key={inv.id}
                                                    onClick={() => showSelectMode ? toggleInvoiceSelection(inv) : openDetail(inv)}
                                                    className={`cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                                                >
                                                    {showSelectMode && (
                                                        <TableCell className="w-10">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!isSelected}
                                                                onChange={() => toggleInvoiceSelection(inv)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                            />
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="font-mono font-medium text-gray-900">{inv.invoice_number}</TableCell>
                                                    <TableCell className="text-gray-900">{inv.customer?.name || inv.order?.customer?.name}</TableCell>
                                                    <TableCell className="text-gray-600">{formatDate(inv.invoice_date)}</TableCell>
                                                    <TableCell className="text-gray-600">{formatDate(inv.due_date)}</TableCell>
                                                    <TableCell align="right" className="font-medium">{formatCurrency(inv.total)}</TableCell>
                                                    <TableCell align="right" className="text-green-600">{formatCurrency(inv.paid_amount)}</TableCell>
                                                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </Card>

                {/* Print Preview Modal */}
                <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title="Preview Invoice" size="lg">
                    <ModalBody>
                        <div className="border rounded-lg overflow-hidden">
                            <InvoicePrint
                                ref={printRef}
                                invoice={{
                                    invoiceNumber: selectedInvoice?.invoice_number,
                                    invoiceDate: selectedInvoice?.invoice_date,
                                    dueDate: selectedInvoice?.due_date,
                                    customerName: selectedInvoice?.customer?.name,
                                    customerAddress: selectedInvoice?.customer?.address,
                                    orderNumber: selectedInvoice?.order_number || selectedInvoice?.order_id,
                                    projectName: selectedInvoice?.project_name,
                                    items: selectedInvoice?.items?.map(item => ({
                                        name: item.name,
                                        qty: item.qty,
                                        days: selectedInvoice?.rental_period?.days || 1,
                                        pricePerDay: item.price_per_day,
                                    })) || [],
                                    subtotal: selectedInvoice?.subtotal,
                                    tax: selectedInvoice?.ppn || selectedInvoice?.tax_amount,
                                    total: selectedInvoice?.total,
                                }}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowPrintModal(false)}>Tutup</Button>
                        <Button icon={Printer} onClick={handlePrint}>Cetak / Download PDF</Button>
                    </ModalFooter>
                </Modal>

                {/* Create Invoice Modal */}
                <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Invoice Baru">
                    <ModalBody className="space-y-4">
                        <Select
                            label="Pilih Order"
                            required
                            value={formData.orderId}
                            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                            options={[
                                { value: 'ORD-2025-001', label: 'ORD-2025-001 - PT Konstruksi Bangunan' },
                                { value: 'ORD-2025-002', label: 'ORD-2025-002 - CV Jaya Abadi' },
                                { value: 'ORD-2025-003', label: 'ORD-2025-003 - PT Mega Proyek' },
                            ]}
                        />
                        <Input
                            label="Jatuh Tempo"
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                        <Input
                            label="Catatan"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan untuk invoice..."
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
                        <Button onClick={handleCreateInvoice}>Buat Invoice</Button>
                    </ModalFooter>
                </Modal>

                {/* Detail Modal */}
                <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail ${selectedInvoice?.invoice_number}`} size="lg">
                    <ModalBody>
                        {selectedInvoice && (
                            <div className="space-y-6">
                                {/* Header Info */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono text-xl font-bold text-gray-900">{selectedInvoice.invoice_number}</p>
                                        <p className="text-sm text-gray-500">Order: {selectedInvoice.order_number || selectedInvoice.order_id}</p>
                                    </div>
                                    <StatusBadge status={selectedInvoice.status} />
                                </div>

                                {/* Customer & Project Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Informasi Customer</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Nama Customer</p>
                                            <p className="font-medium text-gray-900">{selectedInvoice.customer?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">PIC</p>
                                            <p className="font-medium text-gray-900">{selectedInvoice.customer?.pic || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Alamat</p>
                                            <p className="font-medium text-gray-900">{selectedInvoice.customer?.address || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Telepon</p>
                                            <p className="font-medium text-gray-900">{selectedInvoice.customer?.phone || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rental Period */}
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <p className="text-blue-600 text-xs font-medium">Periode Sewa</p>
                                        <p className="font-bold text-blue-900">{selectedInvoice.rental_period?.days || '-'} Hari</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Tanggal Invoice</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedInvoice.invoice_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Jatuh Tempo</p>
                                        <p className="font-medium text-red-600">{formatDate(selectedInvoice.due_date)}</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-100 px-4 py-2">
                                            <h4 className="font-medium text-gray-900">Detail Barang Sewa</h4>
                                        </div>
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left p-3 font-medium text-gray-600">Kode</th>
                                                    <th className="text-left p-3 font-medium text-gray-600">Nama Barang</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Qty</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Harga/Hari</th>
                                                    <th className="text-right p-3 font-medium text-gray-600">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedInvoice.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="p-3 font-mono text-gray-900">{item.code}</td>
                                                        <td className="p-3 text-gray-900">{item.name}</td>
                                                        <td className="p-3 text-right text-gray-900">{item.qty}</td>
                                                        <td className="p-3 text-right text-gray-900">{formatCurrency(item.price_per_day)}</td>
                                                        <td className="p-3 text-right font-medium text-gray-900">{formatCurrency(item.subtotal)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">PPN (10%)</span>
                                        <span className="font-medium">{formatCurrency(selectedInvoice.ppn || selectedInvoice.tax_amount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-red-600">{formatCurrency(selectedInvoice.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Sudah Dibayar</span>
                                        <span className="font-medium text-green-600">{formatCurrency(selectedInvoice.paid_amount)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold bg-yellow-50 p-2 rounded">
                                        <span>Sisa Tagihan</span>
                                        <span className="text-orange-600">{formatCurrency(selectedInvoice.total - selectedInvoice.paid_amount)}</span>
                                    </div>
                                </div>

                                {/* Payment History */}
                                {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-green-50 px-4 py-2">
                                            <h4 className="font-medium text-green-800">Riwayat Pembayaran</h4>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {selectedInvoice.payments.map((payment, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <div>
                                                        <span className="font-mono text-gray-600">{payment.id}</span>
                                                        <span className="ml-2 text-gray-500">{formatDate(payment.date)}</span>
                                                        <span className="ml-2 text-gray-500">({payment.method})</span>
                                                    </div>
                                                    <span className="font-medium text-green-600">{formatCurrency(payment.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedInvoice.notes && (
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                        <strong>Catatan:</strong> {selectedInvoice.notes}
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowDetailModal(false)}>Tutup</Button>
                        {selectedInvoice?.status !== 'Lunas' && (
                            <Button
                                icon={CreditCard}
                                variant="success"
                                onClick={openPaymentModal}
                            >
                                Catat Pembayaran
                            </Button>
                        )}
                        <Button icon={Printer} onClick={() => { setShowDetailModal(false); openPrintPreview(selectedInvoice); }}>Cetak</Button>
                    </ModalFooter>
                </Modal>

                {/* Payment Modal */}
                <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Catat Pembayaran">
                    <ModalBody className="space-y-4">
                        {selectedInvoice && (
                            <>
                                {/* Invoice Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Invoice</span>
                                        <span className="font-mono font-bold">{selectedInvoice.invoice_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Total Tagihan</span>
                                        <span className="font-semibold">{formatCurrency(selectedInvoice.total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Sudah Dibayar</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(selectedInvoice.paid_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-2">
                                        <span className="font-medium">Sisa Tagihan</span>
                                        <span className="font-bold text-orange-600">{formatCurrency(selectedInvoice.total - selectedInvoice.paid_amount)}</span>
                                    </div>
                                </div>

                                {/* Payment Form */}
                                <Input
                                    label="Jumlah Pembayaran"
                                    type="number"
                                    required
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                    placeholder="Masukkan jumlah pembayaran"
                                />
                                <Input
                                    label="Tanggal Pembayaran"
                                    type="date"
                                    required
                                    value={paymentData.date}
                                    onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                                />
                                <Select
                                    label="Metode Pembayaran"
                                    required
                                    value={paymentData.method}
                                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                                    options={[
                                        { value: 'Transfer Bank', label: 'Transfer Bank' },
                                        { value: 'Cash', label: 'Cash / Tunai' },
                                        { value: 'Cek/Giro', label: 'Cek / Giro' },
                                        { value: 'QRIS', label: 'QRIS' },
                                    ]}
                                />
                                <Input
                                    label="Catatan (Opsional)"
                                    value={paymentData.note}
                                    onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                                    placeholder="Catatan pembayaran..."
                                />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Batal</Button>
                        <Button icon={CreditCard} onClick={handleRecordPayment}>Simpan Pembayaran</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}

