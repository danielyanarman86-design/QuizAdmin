'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = useParams();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('quizrush_admin_token');
    const userStr = localStorage.getItem('quizrush_admin_user');

    if (!token || !userStr) {
      setStatus('unauthorized');
      router.replace(`/${locale}/login`);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'superAdmin') {
        setStatus('unauthorized');
        router.replace(`/${locale}/login`);
        return;
      }
      setStatus('authorized');
    } catch {
      setStatus('unauthorized');
      router.replace(`/${locale}/login`);
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-rose-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') return null;

  return <>{children}</>;
}
