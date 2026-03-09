import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function LoginPage() {

    const navigate = useNavigate()

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

            console.log(res.data)

            const token = res.data.token

            sessionStorage.setItem("token", res.data.token)
            sessionStorage.setItem("role", res.data.role)
            sessionStorage.setItem("username", res.data.username)

            navigate("/admin/recipes")

        } catch (error) {
            console.log(error)
            alert("Login uğursuz oldu")
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20">

            <h1 className="text-3xl font-bold mb-6">
                Admin Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>


    )
}