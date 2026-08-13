import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

const PHONE_NUMBER = "9940507693654"

export default function FloatingActions() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 320)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <>
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 14, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.9 }}
                        transition={{ duration: 0.22 }}
                        onClick={scrollTop}
                        className="fixed bottom-6 left-6 z-60 inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200/70 bg-linear-to-r from-emerald-500 to-orange-500 text-white shadow-xl shadow-emerald-400/30 transition hover:-translate-y-1 hover:scale-110"
                        aria-label="Yuxarı qalx"
                    >
                        <ArrowUp size={18} />
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.a
                href={`https://wa.me/${PHONE_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-60 inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-500/35"
                aria-label="WhatsApp ilə əlaqə"
            >
                <FaWhatsapp size={26} />
            </motion.a>
        </>
    )
}
