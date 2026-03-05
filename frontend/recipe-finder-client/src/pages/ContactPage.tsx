import { useState } from "react"
import api from "../api/axios"

export default function ContactPage() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: ""
  })

  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post("/feedback", form)
      setSuccess(true)

      setForm({
        fullName: "",
        email: "",
        message: ""
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Bizimlə əlaqə
      </h1>

      {success && (
        <p className="mb-4 text-green-600">
          Mesajınız göndərildi!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="fullName"
          placeholder="Ad Soyad"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="message"
          placeholder="Mesajınız"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-3 rounded h-32"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Göndər
        </button>

      </form>

    </div>
  )
}