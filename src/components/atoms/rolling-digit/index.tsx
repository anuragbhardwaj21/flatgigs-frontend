import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import cn from '@/utils/cn'

const RollingDigit = memo(({ value, className }: { value: string; className?: string }) => {
  return (
    <span className={cn('relative inline-block h-[1.35em] w-[1ch] overflow-hidden leading-none tabular-nums', className)}>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className='absolute inset-0 inline-flex items-center justify-center will-change-transform'
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 25,
            mass: 1
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className='invisible'>{value}</span>
    </span>
  )
})
export default RollingDigit
