"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/foods", label: "Food Management" },
  { href: "/suggestion", label: "Suggention" },
];

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="p-3">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mt-2 block rounded-md px-3 py-2 text-sm font-medium transition-colors first:mt-0",
              isActive
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
