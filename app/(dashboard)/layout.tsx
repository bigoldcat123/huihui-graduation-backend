import { cookies } from "next/headers";

import { logoutAction } from "@/app/(dashboard)/sidebar-actions";
import { DashboardSidebarNav } from "@/components/dashboard-sidebar-nav";
import { SidebarUserMenu } from "@/components/sidebar-user-menu";
import { getCurrentUser } from "@/lib/auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = await getCurrentUser(token);
  const displayName = user?.name?.trim() || "Admin";

  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="grid h-full grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="flex h-full flex-col border-r bg-card">
          <div className="border-b p-5">
            <p className="text-lg font-semibold">Huihui Admin</p>
          </div>
          <DashboardSidebarNav />
          <div className="mt-auto border-t p-3">
            <SidebarUserMenu
              name={displayName}
              profile={user?.profile ?? null}
              logoutAction={logoutAction}
            />
          </div>
        </aside>
        <div className="h-full overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
