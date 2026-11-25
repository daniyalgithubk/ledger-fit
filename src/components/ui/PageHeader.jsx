import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, text, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 text-center"
    >
      {Icon && (
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-cyan-300">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{text}</p>
    </motion.div>
  );
}