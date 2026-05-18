'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Ban } from 'lucide-react';
import { api } from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  school?: { name: string };
}

const statusColors: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  rejected: 'text-red-400 bg-red-400/10',
  banned: 'text-gray-400 bg-gray-400/10',
};

export default function UsersPage() {
  const t = useTranslations();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    api.get('/admin/users').then((res) => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/admin/users/${id}/status`, { status });
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">{t('admin.users')}</h1>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['User', 'Email', 'Role', 'School', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="text-white text-sm">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-300 capitalize">{user.role}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{user.school?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[user.status] || ''}`}>
                    {t(`common.${user.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {user.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(user.id, 'active')} className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-400/10 transition" title={t('admin.approveTeacher')}>
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button onClick={() => updateStatus(user.id, 'rejected')} className="rounded-lg p-1.5 text-red-400 hover:bg-red-400/10 transition" title={t('admin.rejectTeacher')}>
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {user.status === 'active' && (
                      <button onClick={() => updateStatus(user.id, 'banned')} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-400/10 transition" title={t('admin.banUser')}>
                        <Ban className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
