import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Instagram, Linkedin, Github, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react"

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-emerald-200/60 bg-slate-950 text-slate-200">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-emerald-500/20 to-transparent" />
            <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
                    <img src="/logo_recipefinder.png" alt="RecipeFinder" className="h-20" />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                        Dadli reseptleri tapmaq, planlamaq ve paylasmaq ucun sade ve modern platforma.
                    </p>
                    <Link to="/recipes" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">
                        İndi Resept Ara
                        <ArrowUpRight size={15} />
                    </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.05, duration: 0.45 }}>
                    <h3 className="text-base font-bold text-white">Səhifələr</h3>
                    <div className="mt-4 flex flex-col gap-2.5">
                        <FooterLink to="/" label="Anasəhifə" />
                        <FooterLink to="/recipes" label="Reseptlər" />
                        <FooterLink to="/blog" label="Blog" />
                        <FooterLink to="/about" label="Haqqımızda" />
                        <FooterLink to="/contact" label="Əlaqə" />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.1, duration: 0.45 }}>
                    <h3 className="text-base font-bold text-white">Əlaqə</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                            <Phone size={15} className="text-emerald-300" />
                            <span>+994 50 769 36 54</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                            <Mail size={15} className="text-emerald-300" />
                            <span>firudinmaniyev@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                            <MapPin size={15} className="text-emerald-300" />
                            <span>Bakı, Azərbaycan</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.15, duration: 0.45 }}>
                    <h3 className="text-base font-bold text-white">Sosial Media</h3>
                    <div className="mt-4 flex gap-3">
                        <SocialIcon href="https://www.instagram.com/firudin.coder/" label="Instagram">
                            <Instagram size={18} />
                        </SocialIcon>
                        <SocialIcon href="https://www.linkedin.com/in/firudin-maniyev-4843242b7/" label="LinkedIn">
                            <Linkedin size={18} />
                        </SocialIcon>
                        <SocialIcon href="https://github.com/FirudinManiyev" label="Github">
                            <Github size={18} />
                        </SocialIcon>
                    </div>
                </motion.div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-5 text-center text-xs text-slate-400">
                    <p>FirudinM © {new Date().getFullYear()} - Bütün hüquqlar qorunur</p>
                </div>
            </div>
        </footer>

    )
}



function FooterLink({ to, label }: { to: string; label: string }) {

    return (

        <Link to={to} className="inline-flex items-center text-sm text-slate-300 transition hover:translate-x-1 hover:text-emerald-300">
            {label}
        </Link>

    )

}



function SocialIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {

    return (

        <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-emerald-300 hover:bg-linear-to-r hover:from-emerald-500 hover:to-orange-500"
            aria-label={label}
        >
            {children}
        </motion.a>

    )

}