import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-slideIn`}>
                    {title && (
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                    <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ModalBody({ children, className = '' }) {
    return <div className={`p-6 ${className}`}>{children}</div>
}

export function ModalFooter({ children, className = '' }) {
    return (
        <div className={`sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3 ${className}`}>
            {children}
        </div>
    )
}
