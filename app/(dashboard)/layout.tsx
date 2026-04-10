import Sidebar from "@/components/Sidebar";
import SidebarMobile from "@/components/SidebarMobile";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <SidebarMobile>
        <Sidebar />
      </SidebarMobile>
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 w-full overflow-x-hidden pt-20 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
