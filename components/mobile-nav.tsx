"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Home, ClipboardList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

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

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">開啟選單</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle>Happ System</SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-1 p-4">
          {/* Quick Action */}
          <div className="mb-4 pb-4 border-b">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                新增計劃
              </Link>
            </Button>
          </div>

          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <p className="text-xs text-neutral-500">
            Happ 自動化訂房系統 v1.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
