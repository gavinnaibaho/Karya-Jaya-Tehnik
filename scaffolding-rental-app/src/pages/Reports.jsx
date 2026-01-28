import { useState } from 'react'
import { Download, DollarSign, Clock, FileText, Users } from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, GradientCard, Select } from '../components/ui'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

export default function Reports() {
    const [period, setPeriod] = useState('month')

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [{
            label: 'Pendapatan (Juta)',
            data: [65, 78, 90, 85, 95, 120, 110, 130, 125, 140, 135, 150],
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    }

    const customerData = {
        labels: ['PT Konstruksi Bangunan', 'PT Mega Proyek', 'CV Jaya Abadi', 'PT Bangun Jaya', 'Lainnya'],
        datasets: [{
            data: [125, 180, 75, 50, 70],
            backgroundColor: ['#dc2626', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'],
        }],
    }

    const topCustomers = [
        { name: 'PT Konstruksi Bangunan', value: 125000000, percent: 100 },
        { name: 'PT Mega Proyek', value: 180000000, percent: 80 },
        { name: 'CV Jaya Abadi', value: 75000000, percent: 60 },
    ]

    return (
        <Layout title="Laporan & Arsip" subtitle="Ringkasan performa bisnis">
            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Periode laporan</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <option value="today">Hari Ini</option>
                                <option value="week">Minggu Ini</option>
                                <option value="month">Bulan Ini</option>
                                <option value="year">Tahun Ini</option>
                            </select>
                            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Gradient Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <GradientCard title="Total Pendapatan" value="Rp 450 jt" icon={DollarSign} gradient="green" badge="+12%" />
                    <GradientCard title="Outstanding" value="Rp 125 jt" icon={Clock} gradient="orange" badge="5 Invoice" />
                    <GradientCard title="Order Aktif" value="8 Order" icon={FileText} gradient="blue" />
                    <GradientCard title="Customer Aktif" value="15 Customer" icon={Users} gradient="purple" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Trend Pendapatan Tahunan</h3>
                        <div className="h-64">
                            <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Pendapatan per Customer</h3>
                        <div className="h-64">
                            <Bar data={customerData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
                        </div>
                    </Card>
                </div>

                {/* Top Customer & Order Status */}
                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Customer</h3>
                        <div className="space-y-4">
                            {topCustomers.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                        <span className="text-gray-600">Rp {(item.value / 1000000).toFixed(0)}jt</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${item.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Status Order</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                                <p className="text-2xl font-bold text-blue-600">3</p>
                                <p className="text-sm text-blue-800">Disetujui</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                                <p className="text-2xl font-bold text-green-600">5</p>
                                <p className="text-sm text-green-800">Berjalan</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                                <p className="text-2xl font-bold text-purple-600">2</p>
                                <p className="text-sm text-purple-800">Retur Selesai</p>
                            </div>
                            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200 text-center">
                                <p className="text-2xl font-bold text-teal-600">4</p>
                                <p className="text-sm text-teal-800">Lunas</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
