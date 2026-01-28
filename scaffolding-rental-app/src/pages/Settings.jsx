import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, Input, Textarea } from '../components/ui'

export default function Settings() {
    const [activeTab, setActiveTab] = useState('company')

    const tabs = [
        { id: 'company', label: 'Profil Perusahaan' },
        { id: 'invoice', label: 'Pengaturan Invoice' },
        { id: 'users', label: 'User Management' },
    ]

    return (
        <Layout title="Pengaturan" subtitle="Konfigurasi sistem">
            <div className="space-y-6">
                {/* Tabs */}
                <Card>
                    <div className="flex space-x-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Company Profile */}
                {activeTab === 'company' && (
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Profil Perusahaan</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Input label="Nama Perusahaan" defaultValue="KARYA JAYA TEHNIK" />
                            <Input label="No. Telepon" type="tel" defaultValue="021-12345678" />
                            <div className="col-span-2">
                                <Textarea label="Alamat" rows={3} defaultValue="Jl. Industri No. 123, Jakarta Utara" />
                            </div>
                            <Input label="Email" type="email" defaultValue="info@karyajayatehnik.com" />
                            <Input label="NPWP" defaultValue="01.234.567.8-901.000" />
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                            <Button>Simpan Perubahan</Button>
                        </div>
                    </Card>
                )}

                {/* Invoice Settings */}
                {activeTab === 'invoice' && (
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Pengaturan Invoice</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Input label="Prefix Invoice" defaultValue="INV" />
                            <Input label="Nomor Awal" type="number" defaultValue="1" />
                            <Input label="PPN (%)" type="number" defaultValue="11" />
                            <Input label="Jatuh Tempo Default (Hari)" type="number" defaultValue="30" />
                            <div className="col-span-2">
                                <Textarea
                                    label="Terms & Conditions"
                                    rows={4}
                                    defaultValue="Pembayaran dilakukan dalam waktu 30 hari setelah tanggal invoice."
                                />
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                            <Button>Simpan Perubahan</Button>
                        </div>
                    </Card>
                )}

                {/* User Management */}
                {activeTab === 'users' && (
                    <Card padding={false}>
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                            <Button size="sm" icon={UserPlus}>Tambah User</Button>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Owner</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">owner@karyajaya.com</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Admin</span></td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Aktif</span></td>
                                    <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Staff Admin</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">admin@karyajaya.com</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Staff</span></td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Aktif</span></td>
                                    <td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                )}
            </div>
        </Layout>
    )
}
