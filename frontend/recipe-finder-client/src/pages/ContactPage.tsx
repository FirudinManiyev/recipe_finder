import { useState } from "react"
import api from "../shared/api/client"
import { toApiProblem } from "../shared/api/errors"
import { Mail, Phone, Instagram, Github, Linkedin, MapPin, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: ""
  })

  const [errors, setErrors] = useState<{fullName?: string; email?: string; message?: string}>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!form.fullName.trim()) newErrors.fullName = "Ad soyad tələb olunur"
    else if (form.fullName.trim().length < 2 || form.fullName.length > 100) newErrors.fullName = "Ad soyad 2–100 simvol aralığında olmalıdır"
    if (!form.email.trim()) newErrors.email = "Email tələb olunur"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "E-mail düzgün deyil"
    }
    else if (form.email.length > 150) newErrors.email = "E-mail ən çox 150 simvol ola bilər"
    if (!form.message.trim()) newErrors.message = "Mesaj tələb olunur"
    else if (form.message.trim().length < 10) newErrors.message = "Mesaj ən azı 10 simvol olmalıdır"
    else if (form.message.length > 1000) newErrors.message = "Mesaj ən çox 1000 simvol ola bilər"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      await api.post("/feedback", {
        FullName: form.fullName.trim(),
        Email: form.email.trim().toLowerCase(),
        Message: form.message.trim()
      })

      setSuccess(true)
      setForm({
        fullName: "",
        email: "",
        message: ""
      })

      toast.success("Mesaj uğurla göndərildi! 🎉")

      setTimeout(() => {
        setSuccess(false)
      }, 4000)
    } catch (error: unknown) {
      toast.error(toApiProblem(error).message)
    } finally {
      setLoading(false)
    }
  }

  // Animation variants with proper typing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  } as const

  return (
    <div className="min-h-screen relative overflow-hidden py-12 md:py-20 px-4 md:px-6 bg-linear-to-br from-white via-green-50 to-orange-50">
      {/* Advanced Background Layers */}
      <div className="absolute inset-0 -z-50 overflow-hidden">
        {/* Animated top-left gradient */}
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-green-300/40 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated top-right gradient */}
        <motion.div 
          className="absolute top-0 -right-32 w-96 h-96 bg-linear-to-bl from-orange-300/30 via-pink-300/30 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated bottom-left gradient */}
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-tr from-green-400/20 via-emerald-400/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Animated bottom-right gradient */}
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-linear-to-tl from-orange-300/30 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.div 
        className="max-w-6xl mx-auto relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12 md:mb-16 text-center" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 leading-tight">
            Bizimlə <span className="bg-linear-to-r from-green-500 to-orange-500 bg-clip-text text-transparent">Əlaqə</span> Qurun
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Sualın, təklifin və ya rəyin varsa, biz buradayıq! 
            Dadlı layihələr üçün birlikdə işləyək 🍽️
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDE - Contact Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            
            {/* Phone Card */}
            <motion.div
              className="flex items-start gap-4 p-5 md:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="p-4 bg-linear-to-br from-green-100 to-green-50 text-green-600 rounded-xl shrink-0 shadow-md"
                whileHover={{ scale: 1.1 }}
              >
                <Phone size={28} />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Mobil Telefon</p>
                <a 
                  href="tel:+994507693654"
                  className="text-lg md:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors"
                >
                  +994 50 769 36 54
                </a>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              className="flex items-start gap-4 p-5 md:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              whileHover={{ y: -5 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="p-4 bg-linear-to-br from-orange-100 to-orange-50 text-orange-500 rounded-xl shrink-0 shadow-md"
                whileHover={{ scale: 1.1 }}
              >
                <Mail size={28} />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Email Ünvanı</p>
                <a 
                  href="mailto:firudinmaniyev@gmail.com"
                  className="text-lg md:text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors break-all"
                >
                  firudinmaniyev@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              className="flex items-start gap-4 p-5 md:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              whileHover={{ y: -5 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="p-4 bg-linear-to-br from-blue-100 to-blue-50 text-blue-600 rounded-xl shrink-0 shadow-md"
                whileHover={{ scale: 1.1 }}
              >
                <MapPin size={28} />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Ünvan</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">Bakı, Azərbaycan</p>
              </div>
            </motion.div>

            {/* Social Media Section */}
            <motion.div variants={itemVariants} className="mt-8 md:mt-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Sosial Media</h3>
              
              <div className="flex gap-4">
                <motion.a
                  href="https://www.instagram.com/firudin.coder/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-linear-to-br from-pink-500 to-orange-400 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={24} />
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/firudin-maniyev-4843242b7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={24} />
                </motion.a>

                <motion.a
                  href="https://github.com/FirudinManiyev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-linear-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={24} />
                </motion.a>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT SIDE - Form */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-6 md:p-8"
            variants={itemVariants}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              borderColor: "rgba(34, 197, 94, 0.3)"
            }}
          >
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mesaj Göndər</h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">Biz bütün mesajları oxuyuq və tez cavab veririk</p>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-green-600 shrink-0" />
                <span className="font-medium">Mesaj uğurla göndərildi! Sağ olun 🎉</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

              {/* Full Name Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad</label>
                <motion.input
                  type="text"
                  name="fullName"
                  placeholder="Sizin adınız"
                  value={form.fullName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className={`w-full px-4 md:px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none
                    ${errors.fullName 
                      ? "border-red-400 bg-red-50" 
                      : "border-gray-300 bg-gray-50 focus:border-green-500 focus:bg-white"}`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.fullName && (
                  <motion.p 
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={16} /> {errors.fullName}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Ünvanı</label>
                <motion.input
                  type="email"
                  name="email"
                  placeholder="sizin@email.com"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={150}
                  autoComplete="email"
                  className={`w-full px-4 md:px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none
                    ${errors.email 
                      ? "border-red-400 bg-red-50" 
                      : "border-gray-300 bg-gray-50 focus:border-orange-500 focus:bg-white"}`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.email && (
                  <motion.p 
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={16} /> {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Message Textarea */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mesajınız</label>
                <motion.textarea
                  name="message"
                  placeholder="Bizimlə paylaşmak istədiyiniz hər şeyi yazın..."
                  value={form.message}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  className={`w-full px-4 md:px-5 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none resize-none
                    ${errors.message 
                      ? "border-red-400 bg-red-50" 
                      : "border-gray-300 bg-gray-50 focus:border-green-500 focus:bg-white"}`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.message && (
                  <motion.p 
                    className="text-red-600 text-sm mt-2 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={16} /> {errors.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-green-500 to-orange-500 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    Mesajı Göndər
                    <span className="text-xl">🍽️</span>
                  </>
                )}
              </motion.button>

            </form>

          </motion.div>

        </div>

      </motion.div>

    </div>
  )
}
