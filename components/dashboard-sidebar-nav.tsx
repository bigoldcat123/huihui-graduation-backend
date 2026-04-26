"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ICON_CLASS_NAME, ImageIcon, ListTodo, MessageSquare, Store, UtensilsCrossed } from "@/lib/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/foods", label: "菜品管理", icon: UtensilsCrossed },
  { href: "/restaurants", label: "餐厅管理", icon: Store },
  { href: "/suggestion", label: "建议管理", icon: MessageSquare },
  { href: "/todos", label: "待办管理", icon: ListTodo },
  { href: "/image-recognition", label: "图片识别管理", icon: ImageIcon },
];

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="p-3">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const ItemIcon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mt-2 inline-flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors first:mt-0",
              isActive
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <ItemIcon className={ICON_CLASS_NAME} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
