import { forwardRef } from 'react'
import { formatCurrency, formatDate } from '../../lib/utils'

export const InvoiceReceiptPrint = forwardRef(({ invoices, customer, company }, ref) => {
    // Early return if no invoice data
    if (!invoices || invoices.length === 0) {
        return (
            <div ref={ref} className="p-8 text-center text-gray-500">
                Tidak ada invoice yang dipilih
            </div>
        )
    }

    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0)
    const totalOutstanding = totalAmount - totalPaid
    const documentNumber = `TTD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    const documentDate = new Date().toISOString().split('T')[0]

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="border-b-4 border-blue-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{company?.name || 'KARYA JAYA TEHNIK'}</h1>
                        <p className="text-sm text-gray-600 mt-1">{company?.address || 'Jl. Industri No. 123, Jakarta Utara'}</p>
                        <p className="text-sm text-gray-600">Telp: {company?.phone || '021-12345678'}</p>
                        <p className="text-sm text-gray-600">Email: {company?.email || 'info@karyajayatehnik.com'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-blue-600">TANDA TERIMA</h2>
                        <h3 className="text-lg text-blue-600">DOKUMEN INVOICE</h3>
                        <p className="text-lg font-mono mt-2">{documentNumber}</p>
                    </div>
                </div>
            </div>

            {/* Document Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Diserahkan Kepada</h3>
                    <p className="font-bold text-gray-900">{customer?.name || invoices[0]?.customer?.name || '-'}</p>
                    <p className="text-sm text-gray-600">{customer?.address || invoices[0]?.customer?.address || '-'}</p>
                    {(customer?.phone || invoices[0]?.customer?.phone) && (
                        <p className="text-sm text-gray-600">Telp: {customer?.phone || invoices[0]?.customer?.phone}</p>
                    )}
                </div>
                <div className="text-right">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Tanggal:</span>
                        <span className="font-medium">{formatDate(documentDate)}</span>
                        <span className="text-gray-500">Jumlah Invoice:</span>
                        <span className="font-medium">{invoices.length} dokumen</span>
                    </div>
                </div>
            </div>

            {/* Invoice Table */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Daftar Invoice yang Diserahkan:</h4>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50">
                            <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">No</th>
                            <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">No. Invoice</th>
                            <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">Periode/Proyek</th>
                            <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700">Tanggal Invoice</th>
                            <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700">Jatuh Tempo</th>
                            <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">Jumlah Tagihan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="border px-4 py-3 text-sm text-center">{idx + 1}</td>
                                <td className="border px-4 py-3 text-sm font-mono font-medium">{inv.invoice_number}</td>
                                <td className="border px-4 py-3 text-sm">
                                    {inv.period ? `Periode ${inv.period}` : inv.project_name || '-'}
                                </td>
                                <td className="border px-4 py-3 text-sm text-center">{formatDate(inv.invoice_date)}</td>
                                <td className="border px-4 py-3 text-sm text-center text-red-600 font-medium">{formatDate(inv.due_date)}</td>
                                <td className="border px-4 py-3 text-sm text-right font-medium">{formatCurrency(inv.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={5} className="border px-4 py-3 text-right">Total Tagihan:</td>
                            <td className="border px-4 py-3 text-right text-lg text-red-600">{formatCurrency(totalOutstanding)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Total Nilai Invoice</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Sudah Dibayar</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Sisa Tagihan</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(totalOutstanding)}</p>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="text-sm text-gray-600 mb-8">
                <p className="font-medium mb-1">Catatan:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Dokumen ini merupakan bukti penyerahan invoice kepada pihak customer</li>
                    <li>Harap segera lakukan pembayaran sebelum jatuh tempo</li>
                    <li>Pembayaran dapat dilakukan melalui transfer bank ke rekening yang tertera di invoice</li>
                </ul>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Yang Menyerahkan,</p>
                    <p className="text-xs text-gray-500 mb-16">(Tanda tangan & cap)</p>
                    <div className="border-t border-gray-400 pt-2 w-56 mx-auto">
                        <p className="font-medium">KARYA JAYA TEHNIK</p>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Yang Menerima,</p>
                    <p className="text-xs text-gray-500 mb-16">(Tanda tangan, nama jelas & cap)</p>
                    <div className="border-t border-gray-400 pt-2 w-56 mx-auto">
                        <p className="font-medium">{customer?.name || invoices[0]?.customer?.name || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                <p>Dokumen ini dicetak pada {formatDate(documentDate)} - {documentNumber}</p>
            </div>
        </div>
    )
})

InvoiceReceiptPrint.displayName = 'InvoiceReceiptPrint'
