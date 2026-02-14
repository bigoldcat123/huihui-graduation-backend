import Link from "next/link";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r bg-card">
          <div className="border-b p-5">
            <p className="text-lg font-semibold">Huihui Admin</p>
          </div>
          <nav className="p-3">
            <Link
              href="/foods"
              className="block rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Food Management
            </Link>
          </nav>
        </aside>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
