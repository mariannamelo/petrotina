"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const currentNav = NAV_LINKS.find(item => item.href === pathname);
  const title = currentNav?.title || "PetRotina";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:h-[60px] md:px-6">
      <MobileNav />
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Espaço reservado para ações futuras (notificações, etc) */}
        <Avatar className="h-8 w-8 ring-1 ring-border">
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">EU</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
