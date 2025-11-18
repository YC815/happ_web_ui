"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "儀表板",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "房間",
    href: "/rooms",
    icon: Home,
  },
  {
    title: "計劃",
    href: "/plans",
    icon: ClipboardList,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-neutral-50">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Happ System</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-200"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-neutral-500">
          Happ 自動化訂房系統 v1.0
        </p>
      </div>
    </div>
  );
}
