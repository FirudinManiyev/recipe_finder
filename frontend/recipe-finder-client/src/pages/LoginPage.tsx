import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            const res = await api.post("/auth/login", {
                Username: form.username,
                Password: form.password
            })

            sessionStorage.setItem("token", res.data.token)
            sessionStorage.setItem("role", res.data.role)
            sessionStorage.setItem("username", res.data.username)

            toast.success("Uğurla login oldunuz")

            if (res.data.role === "Admin") {
                navigate("/admin/dashboard")
            } else {
                navigate("/")
            }

        } catch (error) {

            toast.error("Username və ya password səhvdir")

        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

                <h1 className="text-3xl font-bold text-center mb-8">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 pr-12 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    )
}