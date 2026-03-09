import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {

            await api.post("/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password
            });

            alert("Qeydiyyat uğurla tamamlandı");
            navigate("/login");

        } catch (error) {
            console.log(error);
            alert("Xəta baş verdi");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">

            <h1 className="text-2xl font-bold mb-6 text-center">
                Register
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>

            </form>

        </div>
    );
}