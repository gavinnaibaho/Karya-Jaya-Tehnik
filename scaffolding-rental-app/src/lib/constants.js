// Application Constants

export const ORDER_STATUS = {
    DRAFT: 'Draft',
    APPROVED: 'Disetujui',
    RUNNING: 'Berjalan',
    RETURN_COMPLETE: 'Retur Selesai',
    INVOICED: 'Sudah Invoice',
    PAID: 'Lunas',
    CLOSED: 'Ditutup',
    CANCELLED: 'Dibatalkan',
}

export const DELIVERY_STATUS = {
    DRAFT: 'Draft',
    POSTED: 'Posted',
    CANCELLED: 'Batal',
}

export const INVOICE_STATUS = {
    DRAFT: 'Draft',
    SENT: 'Terkirim',
    PARTIAL: 'Sebagian Bayar',
    PAID: 'Lunas',
    OVERDUE: 'Jatuh Tempo',
    CANCELLED: 'Dibatalkan',
}

export const PAYMENT_METHODS = [
    { value: 'transfer_bank', label: 'Transfer Bank' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Cek/Giro' },
]

export const PRODUCT_CATEGORIES = [
    { value: 'main_frame', label: 'Main Frame' },
    { value: 'cross_brace', label: 'Cross Brace' },
    { value: 'jack_base', label: 'Jack Base' },
    { value: 'u_head', label: 'U-Head' },
    { value: 'joint_pin', label: 'Joint Pin' },
    { value: 'ledger', label: 'Ledger' },
    { value: 'platform', label: 'Platform' },
    { value: 'accessory', label: 'Aksesoris' },
]

export const ITEM_CONDITIONS = [
    { value: 'good', label: 'Baik' },
    { value: 'damaged_light', label: 'Rusak Ringan' },
    { value: 'damaged_heavy', label: 'Rusak Berat' },
    { value: 'missing', label: 'Hilang' },
]

export const USER_ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
}

export const DEFAULT_SETTINGS = {
    companyName: 'KARYA JAYA TEHNIK',
    companyAddress: 'Jl. Industri No. 123, Jakarta Utara',
    companyPhone: '021-12345678',
    companyEmail: 'info@karyajayatehnik.com',
    companyNpwp: '01.234.567.8-901.000',
    invoicePrefix: 'INV',
    invoiceStartNumber: 1,
    taxPercent: 11,
    paymentTermsDays: 30,
    termsConditions: 'Pembayaran dilakukan dalam waktu 30 hari setelah tanggal invoice.',
}
