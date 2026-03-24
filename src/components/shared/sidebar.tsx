"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden flex-col border-r bg-background md:flex relative transition-all duration-300">
      {/* Área do Topo (Logo + Toggle) */}
      <div 
        className={cn(
          "flex items-center justify-between overflow-hidden border-b transition-all duration-300 h-14 md:h-[60px]", 
          isCollapsed ? "px-2.5" : "px-4 lg:px-6"
        )}
      >
        <Link 
          href="/" 
          className="relative flex items-center h-8 shrink-0 transition-all duration-300"
          style={{ width: isCollapsed ? '27px' : '120px' }}
        >
          <img 
            src="/logos/logo.svg" 
            alt="PetRotina (Símbolo)" 
            className={cn(
              "absolute left-0 top-0 h-8 w-auto origin-left transition-opacity duration-300", 
              isCollapsed ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )} 
          />
          <img 
            src="/logos/logotipo-completo.svg" 
            alt="PetRotina" 
            className={cn(
              "absolute left-0 top-0 h-8 w-auto origin-left transition-opacity duration-300", 
              isCollapsed ? "opacity-0 z-0 pointer-events-none" : "opacity-100 z-10"
            )} 
          />
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle} 
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4 shrink-0" /> : <ChevronLeft className="h-4 w-4 shrink-0" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      {/* Navegação */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <nav className="grid gap-1 px-2 lg:px-4">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm text-muted-foreground transition-all duration-300 hover:text-primary overflow-hidden whitespace-nowrap",
                  isActive && "bg-muted text-primary font-medium",
                  isCollapsed ? "justify-center h-10 w-10 mx-auto px-0" : "gap-3 px-3 py-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0 transition-none" />
                <span 
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
