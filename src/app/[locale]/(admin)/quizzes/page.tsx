'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpen, Trash2, Eye } from 'lucide-react';
import { api } from '@/lib/api';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  isPublic: boolean;
  createdBy?: { firstName: string; lastName: string };
  questions?: any[];
}

const statusColors: Record<string, string> = {
  draft: 'text-yellow-400 bg-yellow-400/10',
  published: 'text-emerald-400 bg-emerald-400/10',
  archived: 'text-gray-400 bg-gray-400/10',
};

export default function AdminQuizzesPage() {
  const t = useTranslations('admin');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = () => {
    api.get('/admin/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;
    await api.delete(`/quizzes/${id}`);
    fetchQuizzes();
  };

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold text-white"
      >
        {t('quizzes')}
      </motion.h1>

      {loading ? (
        <div className="flex gap-2 justify-center py-20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <BookOpen className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No quizzes yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Title', 'Category', 'Author', 'Questions', 'Status', 'Public', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, i) => (
                <motion.tr
                  key={quiz.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{quiz.title}</p>
                    {quiz.description && <p className="text-xs text-gray-500 truncate max-w-xs">{quiz.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{quiz.category || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {quiz.createdBy ? `${quiz.createdBy.firstName} ${quiz.createdBy.lastName}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{quiz.questions?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[quiz.status] || ''}`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${quiz.isPublic ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {quiz.isPublic ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
