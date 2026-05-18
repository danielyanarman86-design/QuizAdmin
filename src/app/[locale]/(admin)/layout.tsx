import { AdminGuard } from '@/components/layout/AdminGuard';
import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#0a0a14]">
        <Sidebar />
        <main className="ml-60 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
