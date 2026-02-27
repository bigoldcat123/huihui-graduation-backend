"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICON_CLASS_NAME, LogOut } from "@/lib/icons";

type SidebarUserMenuProps = {
  name: string;
  profile: string | null;
  logoutAction: () => Promise<void>;
};

function getInitials(name: string) {
  const chunks = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!chunks.length) {
    return "管";
  }

  return chunks
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SidebarUserMenu({ name, profile, logoutAction }: SidebarUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm"
        >
          <Avatar>
            {profile ? <AvatarImage src={profile} alt={name} /> : null}
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="truncate font-medium">{name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="inline-flex w-full cursor-pointer items-center gap-1.5">
              <LogOut className={ICON_CLASS_NAME} aria-hidden="true" />
              退出登录
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
