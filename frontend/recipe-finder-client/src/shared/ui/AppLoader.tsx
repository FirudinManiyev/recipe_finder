import { motion, useReducedMotion } from 'framer-motion'

export function AppLoader() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-emerald-50 via-white to-orange-50 px-6">
      <motion.div
        role="status"
        aria-label="Recipe Finder yüklənir"
        className="flex flex-col items-center gap-5 text-center"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
      >
        <motion.img
          src="/logo_recipefinder.png"
          alt=""
          className="h-24 w-24 rounded-3xl object-contain drop-shadow-xl"
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div>
          <p className="text-xl font-black text-slate-900">Recipe Finder</p>
          <p className="mt-1 text-sm text-slate-600">Dadlı reseptlər hazırlanır...</p>
        </div>
        <span className="h-1.5 w-36 overflow-hidden rounded-full bg-emerald-100" aria-hidden="true">
          <motion.span
            className="block h-full rounded-full bg-linear-to-r from-emerald-500 to-orange-400"
            initial={{ x: '-100%' }}
            animate={{ x: reduceMotion ? '0%' : '100%' }}
            transition={{ duration: 1, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </div>
  )
}
