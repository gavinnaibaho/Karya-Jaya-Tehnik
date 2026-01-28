import { classNames } from '../../lib/utils'

export function Card({ children, className = '', padding = true }) {
    return (
        <div className={classNames(
            'bg-white rounded-xl border border-gray-200',
            padding && 'p-6',
            className
        )}>
            {children}
        </div>
    )
}

export function CardHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) {
    const colorStyles = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
        green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
        red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
        teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600' },
    }

    const styles = colorStyles[color] || colorStyles.blue

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl border-2 ${styles.border} p-6 hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${styles.bg}`}>
                    {Icon && <Icon className={`w-6 h-6 ${styles.icon}`} />}
                </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    )
}

export function GradientCard({ title, value, subtitle, icon: Icon, gradient = 'green', badge }) {
    const gradients = {
        green: 'from-green-500 to-emerald-600',
        blue: 'from-blue-500 to-indigo-600',
        orange: 'from-orange-500 to-amber-600',
        purple: 'from-purple-500 to-violet-600',
        red: 'from-red-500 to-rose-600',
    }

    return (
        <div className={`bg-gradient-to-br ${gradients[gradient]} rounded-xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                {badge && <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">{badge}</span>}
            </div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
    )
}
