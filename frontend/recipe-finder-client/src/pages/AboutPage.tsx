import { motion } from "framer-motion"
import {
  Utensils,
  Search,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChefHat,
  Leaf,
  Clock3,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutPage() {
  const featureItems = [
    {
      icon: Search,
      title: "Resept Axtarışı",
      desc: "Sevdiyiniz yeməyi saniyələr içində tapın və filtr edin.",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      icon: Utensils,
      title: "Asan Təlimatlar",
      desc: "Addım-addım izahlarla mətbəxdə əminliklə irəliləyin.",
      accent: "from-orange-400 to-amber-500",
    },
    {
      icon: BookOpen,
      title: "Blog Yazıları",
      desc: "Kulinariya trendləri və faydalı məqalələri oxuyun.",
      accent: "from-sky-400 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      desc: "Fikirlərinizi paylaşın, platformanı birlikdə inkişaf etdirək.",
      accent: "from-fuchsia-400 to-rose-500",
    },
  ]

  const stats = [
    { value: "100+", label: "Resept", icon: ChefHat },
    { value: "10+", label: "İstifadəçi", icon: Leaf },
    { value: "10+", label: "Blog Yazısı", icon: Clock3 },
  ]

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
      },
    },
  } as const

  return (
    <main className="relative isolate overflow-hidden bg-linear-to-br from-slate-50 via-emerald-50 to-orange-50">
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl"
        animate={{ x: [0, 26, -18, 0], y: [0, -20, 24, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-300/40 blur-3xl"
        animate={{ x: [0, -22, 20, 0], y: [0, 24, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <section className="relative px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <motion.div
          className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item} className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 backdrop-blur">
              <Sparkles size={16} />
              RecipeFinder Haqqında
            </div>
            <h1 className="text-balance text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Dadlı ideyalar,
              <span className="bg-linear-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent"> sürətli nəticə</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              RecipeFinder müxtəlif mətbəxlərin ən yaxşı reseptlərini bir araya gətirən modern platformadır.
              Məqsədimiz mətbəxdə vaxtınıza qənaət edib, hər gün daha yaradıcı menyular qurmağınıza kömək etməkdir.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/recipes">
                <motion.span
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reseptlərə Bax
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
              <Link to="/blog">
                <motion.span
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Blogu Oxu
                  <BookOpen size={16} />
                </motion.span>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <motion.div
              className="absolute inset-0 rounded-4xl bg-linear-to-br from-emerald-200/60 via-transparent to-orange-200/60 blur-xl"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative rounded-4xl border border-white/70 bg-white/75 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <img
                src="/cheffirudinlogo.png"
                alt="RecipeFinder Logo"
                className="mx-auto w-52 drop-shadow-xl sm:w-64"
              />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100 p-4">
                  <p className="text-sm font-semibold text-emerald-700">Axtarış</p>
                  <p className="mt-1 text-xs text-emerald-900/70">Sürətli filtr və nəticə</p>
                </div>
                <div className="rounded-2xl bg-linear-to-br from-orange-50 to-orange-100 p-4">
                  <p className="text-sm font-semibold text-orange-700">Təlimat</p>
                  <p className="mt-1 text-xs text-orange-900/70">Sadə addım-addım izah</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {featureItems.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                variants={item}
                whileHover={{ y: -8 }}
                className="group rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-100 backdrop-blur-md transition-colors"
              >
                <div className={`inline-flex rounded-2xl bg-linear-to-r p-3 text-white ${feature.accent}`}>
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
                <div className="mt-5 h-1 w-0 rounded-full bg-linear-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-16" />
              </motion.article>
            )
          })}
        </motion.div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div
          className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {stats.map((stat) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="rounded-3xl border border-white/70 bg-linear-to-br from-white to-emerald-50 p-7 text-center shadow-lg shadow-emerald-100"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <StatIcon size={22} />
                </div>
                <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div
          className="mx-auto max-w-6xl overflow-hidden rounded-4xl border border-emerald-200/60 bg-linear-to-r from-emerald-500 to-orange-400 p-8 text-white shadow-2xl shadow-emerald-200 sm:p-10 md:flex md:items-center md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Bizimlə Əlaqəyə Keçin</h2>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Sualların və ya təkliflərin varsa, komandamız sənə qısa zamanda dönüş edəcək.
            </p>
          </div>

          <Link to="/contact" className="mt-6 inline-block md:mt-0">
            <motion.span
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-emerald-700"
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              Əlaqə Səhifəsinə Keç
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </section>

    </main>
  )
}