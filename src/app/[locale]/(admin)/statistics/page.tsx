'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Users, School, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

interface PlatformStats {
  totalUsers: number;
  totalSchools: number;
  totalQuizzes: number;
  pendingTeachers: number;
  totalAttempts: number;
  avgScore: number;
  byRole: { teachers: number; students: number };
  byStatus: { active: number; pending: number; banned: number };
}

export default function AdminStatisticsPage() {
  const t = useTranslations('admin');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/statistics')
      .then((res) => setStats(res.data))
      .catch(() => {
        setStats({
          totalUsers: 0, totalSchools: 0, totalQuizzes: 0, pendingTeachers: 0,
          totalAttempts: 0, avgScore: 0,
          byRole: { teachers: 0, students: 0 },
          byStatus: { active: 0, pending: 0, banned: 0 },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: Users, label: t('totalUsers'), value: stats.totalUsers, color: 'from-violet-600 to-purple-600' },
    { icon: School, label: t('totalSchools'), value: stats.totalSchools, color: 'from-blue-600 to-cyan-600' },
    { icon: BookOpen, label: t('totalQuizzes'), value: stats.totalQuizzes, color: 'from-emerald-600 to-teal-600' },
    { icon: Clock, label: t('pendingTeachers'), value: stats.pendingTeachers, color: 'from-rose-600 to-orange-600' },
    { icon: TrendingUp, label: 'Total Attempts', value: stats.totalAttempts, color: 'from-indigo-600 to-blue-600' },
    { icon: TrendingUp, label: 'Avg Score', value: `${stats.avgScore}%`, color: 'from-amber-600 to-yellow-600' },
  ] : [];

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold text-white"
      >
        {t('statistics')}
      </motion.h1>

      {loading ? (
        <div className="flex gap-2 justify-center py-20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-400">{card.label}</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.2, type: 'spring' }}
                  className="text-3xl font-black text-white"
                >
                  {card.value}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* By Role */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 font-semibold text-white">Users by Role</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Teachers', value: stats.byRole.teachers, color: 'bg-violet-500' },
                    { label: 'Students', value: stats.byRole.students, color: 'bg-blue-500' },
                  ].map((item) => {
                    const total = stats.byRole.teachers + stats.byRole.students || 1;
                    const pct = Math.round((item.value / total) * 100);
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-2 rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* By Status */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 font-semibold text-white">Users by Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Active', value: stats.byStatus.active, color: 'bg-emerald-500' },
                    { label: 'Pending', value: stats.byStatus.pending, color: 'bg-yellow-500' },
                    { label: 'Banned', value: stats.byStatus.banned, color: 'bg-red-500' },
                  ].map((item) => {
                    const total = stats.byStatus.active + stats.byStatus.pending + stats.byStatus.banned || 1;
                    const pct = Math.round((item.value / total) * 100);
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-2 rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
