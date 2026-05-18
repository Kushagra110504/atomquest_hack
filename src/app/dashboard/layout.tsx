import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Target, BarChart2, CheckCircle, Settings, LogOut } from "lucide-react";
import { SignOutButton } from "./components/SignOutButton";
import { ThemeToggle } from "./components/ThemeToggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: BarChart2, roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
    { name: "My Goals", href: "/dashboard/goals", icon: Target, roles: ["EMPLOYEE", "MANAGER"] },
    { name: "Team Goals", href: "/dashboard/team", icon: CheckCircle, roles: ["MANAGER", "ADMIN"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN"] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">AtomQuest</h2>
            <p className="text-sm text-zinc-500">{role} Portal</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {filteredNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-bold">
              {session.user.name?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{session.user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
