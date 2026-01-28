import { useState } from 'react'
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, User } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button, SearchInput, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Modal, ModalBody, ModalFooter, Input, Textarea } from '../components/ui'
import { useCustomers } from '../hooks/useCustomers'
import toast from 'react-hot-toast'

export default function Customers() {
    const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [customerToDelete, setCustomerToDelete] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        pic_name: '',
        pic_phone: '',
        notes: ''
    })

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.pic_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer)
            setFormData({
                name: customer.name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                pic_name: customer.pic_name || '',
                pic_phone: customer.pic_phone || '',
                notes: customer.notes || ''
            })
        } else {
            setEditingCustomer(null)
            setFormData({ name: '', phone: '', email: '', address: '', pic_name: '', pic_phone: '', notes: '' })
        }
        setShowModal(true)
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) {
            toast.error('Nama dan No. Telepon wajib diisi!')
            return
        }

        if (editingCustomer) {
            const { error } = await updateCustomer(editingCustomer.id, formData)
            if (error) {
                toast.error('Gagal update customer')
            } else {
                toast.success('Customer berhasil diupdate!')
            }
        } else {
            const { error } = await createCustomer(formData)
            if (error) {
                toast.error('Gagal menambah customer')
            } else {
                toast.success('Customer berhasil ditambahkan!')
            }
        }
        setShowModal(false)
    }

    const handleDelete = async () => {
        if (!customerToDelete) return

        const { error } = await deleteCustomer(customerToDelete.id)
        if (error) {
            toast.error('Gagal menghapus customer')
        } else {
            toast.success('Customer berhasil dihapus!')
        }
        setShowDeleteModal(false)
        setCustomerToDelete(null)
    }

    const confirmDelete = (customer) => {
        setCustomerToDelete(customer)
        setShowDeleteModal(true)
    }

    return (
        <Layout title="Customer Management" subtitle="Kelola data customer perusahaan">
            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Cari nama, telepon, atau PIC..."
                            className="w-full sm:w-80"
                        />
                        <Button icon={Plus} onClick={() => handleOpenModal()}>
                            Tambah Customer
                        </Button>
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Card className="border-2 border-blue-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Customer</p>
                        <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                    </Card>
                    <Card className="border-2 border-green-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Aktif</p>
                        <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
                    </Card>
                </div>

                {/* Customer Table */}
                <Card padding={false}>
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {searchTerm ? 'Tidak ada customer yang ditemukan' : 'Belum ada customer. Klik "Tambah Customer" untuk menambahkan.'}
                        </div>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <div key={customer.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {customer.phone}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleOpenModal(customer)} className="text-blue-600 hover:text-blue-700">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(customer)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {customer.pic_name && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <User className="w-3 h-3 mr-1" />
                                                PIC: {customer.pic_name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden sm:block">
                                <Table>
                                    <TableHeader>
                                        <TableHead>Nama Customer</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>PIC</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCustomers.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                                                <TableCell className="text-gray-600">{customer.phone}</TableCell>
                                                <TableCell className="text-gray-600">{customer.email || '-'}</TableCell>
                                                <TableCell className="text-gray-600">{customer.pic_name || '-'}</TableCell>
                                                <TableCell className="text-gray-600 max-w-xs truncate">{customer.address || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleOpenModal(customer)}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(customer)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingCustomer ? 'Edit Customer' : 'Tambah Customer Baru'}
                    size="md"
                >
                    <ModalBody className="space-y-4">
                        <Input
                            label="Nama Customer / Perusahaan"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="PT / CV / Nama..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="No. Telepon"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="021-xxxxxxx"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@company.com"
                            />
                        </div>
                        <Textarea
                            label="Alamat"
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Alamat lengkap..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Nama PIC"
                                value={formData.pic_name}
                                onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                                placeholder="Nama kontak person..."
                            />
                            <Input
                                label="No. HP PIC"
                                value={formData.pic_phone}
                                onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>
                        <Textarea
                            label="Catatan"
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan tambahan..."
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button onClick={handleSubmit}>{editingCustomer ? 'Simpan Perubahan' : 'Tambah Customer'}</Button>
                    </ModalFooter>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Konfirmasi Hapus" size="sm">
                    <ModalBody>
                        <p className="text-gray-600">
                            Apakah Anda yakin ingin menghapus customer <strong>{customerToDelete?.name}</strong>?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Batal</Button>
                        <Button variant="danger" onClick={handleDelete}>Hapus</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Layout>
    )
}
