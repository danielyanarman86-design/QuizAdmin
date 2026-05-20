'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, School, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface School {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

export default function SchoolsPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [schools, setSchools] = useState<School[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);

  const fetchSchools = () => {
    api.get('/schools').then((res) => setSchools(res.data)).catch(() => {});
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/schools', form);
      setForm({ name: '', address: '' });
      setShowForm(false);
      fetchSchools();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteSchoolConfirm'))) return;
    await api.delete(`/schools/${id}`);
    fetchSchools();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('schools')}</h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 font-medium text-white">
          <Plus className="h-4 w-4" />
          {t('addSchool')}
        </motion.button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">{t('schoolName')}</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-violet-500 transition" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">{t('schoolAddress')}</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-violet-500 transition" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="rounded-xl bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-500 transition disabled:opacity-60">
              {tCommon('save')}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 px-6 py-2 text-sm font-medium text-gray-400 hover:text-white transition">
              {tCommon('cancel')}
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-3">
        {schools.map((school, i) => (
          <motion.div key={school.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <School className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{school.name}</p>
                <p className="text-sm text-gray-400">{school.address}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(school.id)}
              className="rounded-xl p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
