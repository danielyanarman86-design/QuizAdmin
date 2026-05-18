'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a14]"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute top-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-rose-600 via-violet-500 to-orange-500"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.4)',
                  '0 0 60px rgba(239, 68, 68, 0.7)',
                  '0 0 20px rgba(239, 68, 68, 0.4)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-violet-600"
            >
              <Shield className="h-12 w-12 text-white" />
            </motion.div>

            <div className="text-center">
              <h1 className="bg-gradient-to-r from-rose-400 via-violet-300 to-orange-400 bg-clip-text text-4xl font-black text-transparent">
                QuizRush
              </h1>
              <p className="mt-1 text-sm text-gray-500">Admin Panel</p>
            </div>

            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-2 w-2 rounded-full bg-rose-500"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
