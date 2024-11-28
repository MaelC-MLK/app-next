import SideNav from '@/app/ui/dashboard/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64">
        <SideNav />
      </aside>
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
}