'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield } from 'lucide-react';
import { api } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { locale } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      const user = res.data.user;

      if (user.role !== 'superAdmin') {
        setError('Access denied. SuperAdmin only.');
        return;
      }

      localStorage.setItem('quizrush_admin_token', res.data.accessToken);
      localStorage.setItem('quizrush_admin_user', JSON.stringify(user));
      router.push(`/${locale}/dashboard`);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.4)', '0 0 50px rgba(239,68,68,0.7)', '0 0 20px rgba(239,68,68,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-violet-600"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl font-black bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
              QuizRush
            </h1>
            <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="mb-6 text-xl font-bold text-white">{t('login')}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  placeholder="admin@quizrush.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-60"
            >
              {loading ? '...' : t('login')}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
