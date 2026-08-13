import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import api from "../api/axios"
import { Eye, EyeOff, Sparkles, CheckCircle, AlertCircle, Loader } from "lucide-react"
import toast from "react-hot-toast"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
} as const

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const [form, setForm] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
    // Clear error on input change
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {}
    if (!form.username.trim()) {
      newErrors.username = "Username tələb olunur"
    }
    if (!form.password.trim()) {
      newErrors.password = "Password tələb olunur"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const res = await api.post("/auth/login", {
        Username: form.username,
        Password: form.password,
      })

      sessionStorage.setItem("token", res.data.token)
      sessionStorage.setItem("role", res.data.role)
      sessionStorage.setItem("username", res.data.username)

      toast.success("Uğurla login oldunuz ✨")

      if (res.data.role === "Admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/")
      }
    } catch (error) {
      toast.error("Username və ya password səhvdir")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-green-50 to-orange-50">
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="text-green-600" size={32} />
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-orange-500 mb-2">
              Xoş Gəlmisiniz
            </h1>
            <p className="text-gray-600 text-sm">
              Hesabınıza daxil olun və reseptləri kəşf edin
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-3xl p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <motion.div
                className="relative"
                whileFocus="focus"
                variants={{
                  focus: { scale: 1.02 },
                }}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-2xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur ${
                    errors.username
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
                  required
                />
                {errors.username && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mt-2 text-red-500 text-xs"
                  >
                    <AlertCircle size={14} />
                    {errors.username}
                  </motion.div>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div className="relative" whileFocus="focus" variants={{ focus: { scale: 1.02 } }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 pr-12 rounded-2xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 bg-white/50 backdrop-blur ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  }`}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mt-2 text-red-500 text-xs"
                  >
                    <AlertCircle size={14} />
                    {errors.password}
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-green-500 to-orange-400 text-white py-3 md:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {isLoading ? (
                  <motion.div className="flex items-center justify-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Loader size={20} />
                    </motion.div>
                    <span>Gözləyin...</span>
                  </motion.div>
                ) : (
                  <motion.div className="flex items-center justify-center gap-2">
                    <span>Login</span>
                    <CheckCircle size={20} />
                  </motion.div>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs text-gray-500">və ya</span>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Register Link */}
            <motion.p className="text-center text-gray-600 text-sm" variants={itemVariants}>
              Hesabınız yoxdur?{" "}
              <Link to="/register" className="inline-block">
                <motion.span
                  className="bg-linear-to-r from-green-600 to-orange-500 bg-clip-text text-transparent font-semibold hover:underline cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register olun
                </motion.span>
              </Link>
            </motion.p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}