import { forwardRef } from 'react'
import { formatDate } from '../../lib/utils'

export const ReturnNotePrint = forwardRef(({ returnNote, company }, ref) => {
    if (!returnNote) {
        return (
            <div ref={ref} className="p-8 text-center text-gray-500">
                Tidak ada data surat jalan retur
            </div>
        )
    }

    return (
        <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="border-b-4 border-purple-600 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{company?.name || 'KARYA JAYA TEHNIK'}</h1>
                        <p className="text-sm text-gray-600 mt-1">{company?.address || 'Jl. Industri No. 123, Jakarta Utara'}</p>
                        <p className="text-sm text-gray-600">Telp: {company?.phone || '021-12345678'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-purple-600">SURAT JALAN RETUR</h2>
                        <p className="text-lg font-mono mt-2">{returnNote.returnNumber || 'SJR-XXXX-XXX'}</p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Dari</h3>
                    <p className="font-bold text-gray-900">{returnNote.customerName || '-'}</p>
                    <p className="text-sm text-gray-600">{returnNote.projectName || '-'}</p>
                </div>
                <div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Tanggal:</span>
                        <span className="font-medium">{formatDate(returnNote.date) || '-'}</span>
                        <span className="text-gray-500">No. Order:</span>
                        <span className="font-medium">{returnNote.orderNumber || '-'}</span>
                        <span className="text-gray-500">Penerima:</span>
                        <span className="font-medium">{returnNote.receiver || '-'}</span>
                        <span className="text-gray-500">Kondisi:</span>
                        <span className="font-medium">{returnNote.condition || 'Baik'}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-purple-50">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Nama Barang</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Jumlah</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Kondisi</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {(returnNote.items && returnNote.items.length > 0 ? returnNote.items : [
                        { name: 'Scaffolding Frame 1.7m', qty: 200, condition: 'Baik' },
                    ]).map((item, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{idx + 1}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-center font-medium">{item.qty}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                                <span className={`px-2 py-1 rounded text-xs ${item.condition === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {item.condition || 'Baik'}
                                </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.note || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Notes */}
            {returnNote.notes && (
                <div className="mb-8 bg-gray-50 p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Catatan:</p>
                    <p className="text-sm text-gray-600">{returnNote.notes}</p>
                </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Yang Menyerahkan</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="text-sm">{returnNote.customerName || '(............................)'}</p>
                    </div>
                </div>
                <div className="text-center border border-gray-300 p-4">
                    <p className="text-sm text-gray-600 mb-16">Yang Menerima</p>
                    <div className="border-t border-gray-400 pt-2">
                        <p className="text-sm">{returnNote.receiver || '(............................)'}</p>
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

ReturnNotePrint.displayName = 'ReturnNotePrint'
