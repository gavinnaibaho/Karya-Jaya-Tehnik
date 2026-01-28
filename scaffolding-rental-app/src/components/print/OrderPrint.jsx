import { forwardRef } from 'react'
import { formatCurrency, formatDate } from '../../lib/utils'

export const OrderPrint = forwardRef(({ order, company }, ref) => {
    if (!order) {
        return (
            <div ref={ref} className="p-8 text-center text-gray-500">
                Tidak ada data order
            </div>
        )
    }

    // Calculate total per day
    const totalPerDay = order.items?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0

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
                        <h2 className="text-2xl font-bold text-red-600">RENTAL ORDER</h2>
                        <p className="text-lg font-mono mt-2">{order.orderNumber || 'ORD-XXXX-XXX'}</p>
                        <p className={`mt-2 px-3 py-1 text-xs font-medium rounded-full inline-block ${order.status === 'Aktif' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status || 'Draft'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Customer</h3>
                    <p className="font-bold text-gray-900">{order.customerName || '-'}</p>
                    <p className="text-sm text-gray-600">PIC: {order.pic || '-'}</p>
                    <p className="text-sm text-gray-600">Telp: {order.phone || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Proyek</h3>
                    <p className="font-bold text-gray-900">{order.projectName || '-'}</p>
                    <p className="text-sm text-gray-600">{order.location || '-'}</p>
                </div>
            </div>

            {/* Rental Period */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Tanggal Mulai</p>
                    <p className="font-bold text-gray-900">{formatDate(order.startDate) || '-'}</p>
                </div>
                <div className="border rounded p-4">
                    <p className="text-sm text-gray-500">Tanggal Selesai</p>
                    <p className="font-bold text-gray-900">{order.endDate ? formatDate(order.endDate) : 'Belum ditentukan'}</p>
                </div>
                <div className="border rounded p-4 bg-red-50">
                    <p className="text-sm text-red-600">Deposit</p>
                    <p className="font-bold text-red-700">{formatCurrency(order.deposit || 0)}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-6 border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">No</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Kode</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Nama Barang</th>
                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold">Jumlah</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">Harga/Hari</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold">Subtotal/Hari</th>
                    </tr>
                </thead>
                <tbody>
                    {(order.items && order.items.length > 0 ? order.items : [
                        { code: 'MF-170', name: 'Main Frame 1.7m', qty: 100, price: 5000 },
                    ]).map((item, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{idx + 1}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-mono">{item.code || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-center font-medium">{item.qty}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-right">{formatCurrency(item.price)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.qty * item.price)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-red-50">
                        <td colSpan="5" className="border border-gray-300 px-4 py-3 text-right font-bold">Total per Hari</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-bold text-red-600">{formatCurrency(totalPerDay)}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Terms */}
            <div className="text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded">
                <p className="font-medium mb-2">Syarat & Ketentuan:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Barang yang disewa menjadi tanggung jawab penyewa</li>
                    <li>Kerusakan/kehilangan barang ditanggung penyewa sesuai harga barang</li>
                    <li>Deposit akan dikembalikan setelah semua barang kembali dalam kondisi baik</li>
                    <li>Pembayaran sewa dihitung per hari dan ditagih setiap bulan</li>
                </ol>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Pihak Pertama<br />(Penyewaan)</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="font-medium">KARYA JAYA TEHNIK</p>
                    </div>
                </div>
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Pihak Kedua<br />(Penyewa)</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="font-medium">{order.customerName || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

OrderPrint.displayName = 'OrderPrint'
