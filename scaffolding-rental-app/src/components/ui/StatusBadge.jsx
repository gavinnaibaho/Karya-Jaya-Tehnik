import { getStatusColor } from '../../lib/utils'

export function StatusBadge({ status }) {
    const colors = getStatusColor(status)

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
            {status}
        </span>
    )
}
