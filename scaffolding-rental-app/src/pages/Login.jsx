import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
    const navigate = useNavigate()
    const { user, signIn, loading: authLoading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/')
        }
    }, [user, authLoading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            toast.error(error.message || 'Email atau password salah')
            setLoading(false)
        } else {
            toast.success('Login berhasil!')
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">KARYA JAYA TEHNIK</h1>
                    <p className="text-red-100 text-sm mt-1">Sistem Manajemen Persewaan Scaffolding</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
                            <span className="text-gray-600">Ingat saya</span>
                        </label>
                        <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                            Lupa password?
                        </a>
                    </div>

                    <Button type="submit" className="w-full" loading={loading}>
                        Masuk
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                        <p>Gunakan akun yang sudah dibuat di Supabase</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
