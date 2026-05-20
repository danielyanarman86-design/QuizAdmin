'use client';

import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, School, Users, BookOpen, BarChart3,
  Shield, LogOut,
} from 'lucide-react';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

export function Sidebar() {
  const t = useTranslations('admin');
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/schools`, label: t('schools'), icon: School },
    { href: `/${locale}/users`, label: t('users'), icon: Users },
    { href: `/${locale}/quizzes`, label: t('quizzes'), icon: BookOpen },
    { href: `/${locale}/statistics`, label: t('statistics'), icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('quizrush_admin_token');
    localStorage.removeItem('quizrush_admin_user');
    router.push(`/${locale}/login`);
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-[#0d0d1a] fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-violet-600">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-black text-white text-sm">QuizRush</p>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-rose-600/20 to-violet-600/20 text-white border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className={`h-4 w-4 ${active ? 'text-rose-400' : ''}`} />
              {link.label}
            </motion.a>
          );
        })}
      </nav>

      {/* Locale Switcher */}
      <div className="px-4 pb-2 flex justify-center">
        <LocaleSwitcher />
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
