import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            await api.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password
            });

            toast.success("Qeydiyyat uğurla tamamlandı!");
            navigate("/login");

        } catch (error) {
            console.log(error);
            toast.error("Xəta baş verdi. Yenidən cəhd edin!");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 text-white animate-fadeIn">

                <h1 className="text-3xl font-bold text-center mb-8">
                    Qeydiyyat
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 pr-12 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
                        Qeydiyyat
                    </button>

                </form>

            </div>

        </div>
    )
}