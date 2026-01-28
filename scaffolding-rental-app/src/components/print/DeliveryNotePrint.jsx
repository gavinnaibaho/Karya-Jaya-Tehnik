import { forwardRef } from 'react'
import { formatDate } from '../../lib/utils'

export const DeliveryNotePrint = forwardRef(({ delivery, company }, ref) => {
    if (!delivery) {
        return (
            <div ref={ref} className="p-8 text-center text-gray-500">
                Tidak ada data surat jalan
            </div>
        )
    }

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="border-b-4 border-blue-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{company?.name || 'KARYA JAYA TEHNIK'}</h1>
                        <p className="text-sm text-gray-600 mt-1">{company?.address || 'Jl. Industri No. 123, Jakarta Utara'}</p>
                        <p className="text-sm text-gray-600">Telp: {company?.phone || '021-12345678'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-blue-600">SURAT JALAN KIRIM</h2>
                        <p className="text-lg font-mono mt-2">{delivery.deliveryNumber || 'SJK-XXXX-XXX'}</p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Kepada</h3>
                    <p className="font-bold text-gray-900">{delivery.customerName || '-'}</p>
                    <p className="text-sm text-gray-600">{delivery.projectName || '-'}</p>
                    <p className="text-sm text-gray-600">{delivery.projectLocation || '-'}</p>
                </div>
                <div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Tanggal:</span>
                        <span className="font-medium">{formatDate(delivery.date) || '-'}</span>
                        <span className="text-gray-500">No. Order:</span>
                        <span className="font-medium">{delivery.orderNumber || '-'}</span>
                        <span className="text-gray-500">Driver:</span>
                        <span className="font-medium">{delivery.driverName || '-'}</span>
                        <span className="text-gray-500">Kendaraan:</span>
                        <span className="font-medium">{delivery.vehicleNumber || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-blue-50">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Kode</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Nama Barang</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Satuan</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Jumlah</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {(delivery.items && delivery.items.length > 0 ? delivery.items : [
                        { code: 'MF-170', name: 'Main Frame 1.7m x 1.5m', unit: 'Unit', qty: 200 },
                    ]).map((item, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{idx + 1}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-mono">{item.code || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-center">{item.unit || 'Unit'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-center font-medium">{item.qty}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.note || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Notes */}
            {delivery.notes && (
                <div className="mb-8 bg-gray-50 p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Catatan:</p>
                    <p className="text-sm text-gray-600">{delivery.notes}</p>
                </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Pengirim</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="text-sm">{delivery.driverName || '(............................)'}</p>
                    </div>
                </div>
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Penerima</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="text-sm">(............................)</p>
                    </div>
                </div>
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Mengetahui</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="text-sm">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

DeliveryNotePrint.displayName = 'DeliveryNotePrint'
