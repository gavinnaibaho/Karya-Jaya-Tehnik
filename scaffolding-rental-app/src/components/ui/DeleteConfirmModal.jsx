import { AlertTriangle } from 'lucide-react'
import { Modal, ModalBody, ModalFooter } from './Modal'
import { Button } from './Button'

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, itemName }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || "Konfirmasi Hapus"}>
            <ModalBody>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            {message || "Apakah Anda yakin ingin menghapus data ini?"}
                        </p>
                        {itemName && (
                            <p className="mt-2 font-semibold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                                {itemName}
                            </p>
                        )}
                        <p className="mt-3 text-sm text-red-600">
                            ⚠️ Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="outline" onClick={onClose}>Batal</Button>
                <Button
                    onClick={() => { onConfirm(); onClose(); }}
                    className="bg-red-600 hover:bg-red-700"
                >
                    Hapus
                </Button>
            </ModalFooter>
        </Modal>
    )
}
