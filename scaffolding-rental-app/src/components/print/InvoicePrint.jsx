import { forwardRef } from 'react'
import { formatCurrency, formatDate } from '../../lib/utils'

export const InvoicePrint = forwardRef(({ invoice, company }, ref) => {
    // Early return if no invoice data
    if (!invoice) {
        return (
            <div ref={ref} className="p-8 text-center text-gray-500">
                Tidak ada data invoice
            </div>
        )
    }

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="border-b-4 border-red-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{company?.name || 'KARYA JAYA TEHNIK'}</h1>
                        <p className="text-sm text-gray-600 mt-1">{company?.address || 'Jl. Industri No. 123, Jakarta Utara'}</p>
                        <p className="text-sm text-gray-600">Telp: {company?.phone || '021-12345678'}</p>
                        <p className="text-sm text-gray-600">Email: {company?.email || 'info@karyajayatehnik.com'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-red-600">INVOICE</h2>
                        <p className="text-lg font-mono mt-2">{invoice.invoiceNumber || 'INV-XXXX-XXX'}</p>
                    </div>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Ditagihkan Kepada</h3>
                    <p className="font-bold text-gray-900">{invoice.customerName || '-'}</p>
                    <p className="text-sm text-gray-600">{invoice.customerAddress || '-'}</p>
                </div>
                <div className="text-right">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Tanggal Invoice:</span>
                        <span className="font-medium">{formatDate(invoice.invoiceDate) || '-'}</span>
                        <span className="text-gray-500">Jatuh Tempo:</span>
                        <span className="font-medium text-red-600">{formatDate(invoice.dueDate) || '-'}</span>
                        <span className="text-gray-500">No. Order:</span>
                        <span className="font-medium">{invoice.orderNumber || '-'}</span>
                        <span className="text-gray-500">Proyek:</span>
                        <span className="font-medium">{invoice.projectName || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                        <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                        <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                        <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-700">Hari</th>
                        <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">Harga/Hari</th>
                        <th className="border px-4 py-3 text-right text-sm font-semibold text-gray-700">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {(invoice.items && invoice.items.length > 0 ? invoice.items : [
                        { name: 'Scaffolding Frame 1.7m', qty: 200, days: 30, pricePerDay: 15000 },
                        { name: 'Cross Brace', qty: 300, days: 30, pricePerDay: 8000 },
                        { name: 'Jack Base', qty: 100, days: 30, pricePerDay: 5000 },
                    ]).map((item, idx) => (
                        <tr key={idx} className="border-b">
                            <td className="border px-4 py-3 text-sm">{idx + 1}</td>
                            <td className="border px-4 py-3 text-sm">{item.name}</td>
                            <td className="border px-4 py-3 text-sm text-center">{item.qty}</td>
                            <td className="border px-4 py-3 text-sm text-center">{item.days || 1}</td>
                            <td className="border px-4 py-3 text-sm text-right">{formatCurrency(item.pricePerDay)}</td>
                            <td className="border px-4 py-3 text-sm text-right font-medium">
                                {formatCurrency(item.qty * (item.days || 1) * item.pricePerDay)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-80">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(invoice.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">PPN (11%)</span>
                        <span className="font-medium">{formatCurrency(invoice.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-red-50 px-3 -mx-3 rounded">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg text-red-600">{formatCurrency(invoice.total || 0)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h4 className="font-semibold text-gray-900 mb-2">Informasi Pembayaran</h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>Bank: BCA</p>
                    <p>No. Rekening: 123-456-7890</p>
                    <p>Atas Nama: PT KARYA JAYA TEHNIK</p>
                </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-500 mb-8">
                <p className="font-medium mb-1">Syarat & Ketentuan:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Pembayaran dilakukan dalam waktu 30 hari setelah tanggal invoice</li>
                    <li>Pembayaran dapat dilakukan melalui transfer bank atau tunai</li>
                    <li>Invoice ini sah meskipun tanpa tanda tangan dan cap</li>
                </ol>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-16">Hormat Kami,</p>
                    <div className="border-t border-gray-400 pt-2 w-48 mx-auto">
                        <p className="font-medium">KARYA JAYA TEHNIK</p>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-16">Penerima,</p>
                    <div className="border-t border-gray-400 pt-2 w-48 mx-auto">
                        <p className="font-medium">{invoice.customerName || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

InvoicePrint.displayName = 'InvoicePrint'
