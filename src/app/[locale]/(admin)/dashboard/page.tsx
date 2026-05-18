'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, School, BookOpen, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalSchools: number;
  totalQuizzes: number;
  pendingTeachers: number;
}

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSchools: 0, totalQuizzes: 0, pendingTeachers: 0 });

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { icon: Users, label: t('totalUsers'), value: stats.totalUsers, color: 'from-violet-600 to-purple-600' },
    { icon: School, label: t('totalSchools'), value: stats.totalSchools, color: 'from-blue-600 to-cyan-600' },
    { icon: BookOpen, label: t('totalQuizzes'), value: stats.totalQuizzes, color: 'from-emerald-600 to-teal-600' },
    { icon: Clock, label: t('pendingTeachers'), value: stats.pendingTeachers, color: 'from-rose-600 to-orange-600' },
  ];

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold text-white"
      >
        {t('dashboard')}
      </motion.h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm text-gray-400">{card.label}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 + 0.3, type: 'spring' }}
              className="text-3xl font-black text-white"
            >
              {card.value}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
