export function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full">{children}</table>
        </div>
    )
}

export function TableHeader({ children }) {
    return (
        <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{children}</tr>
        </thead>
    )
}

export function TableHead({ children, className = '', align = 'left' }) {
    const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
    return (
        <th className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${alignClass} ${className}`}>
            {children}
        </th>
    )
}

export function TableBody({ children }) {
    return <tbody className="divide-y divide-gray-200">{children}</tbody>
}

export function TableRow({ children, onClick, className = '' }) {
    return (
        <tr
            className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    )
}

export function TableCell({ children, className = '', align = 'left' }) {
    const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
    return (
        <td className={`px-6 py-4 text-sm ${alignClass} ${className}`}>
            {children}
        </td>
    )
}

export function TableEmpty({ message = 'Tidak ada data', icon: Icon }) {
    return (
        <tr>
            <td colSpan="100" className="px-6 py-12 text-center">
                {Icon && <Icon className="w-12 h-12 mx-auto mb-2 text-gray-300" />}
                <p className="text-sm text-gray-500">{message}</p>
            </td>
        </tr>
    )
}
