"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("petrotina-sidebar-state");
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("petrotina-sidebar-state", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMounted]);

  return (
    <div 
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed 
          ? "md:grid-cols-[80px_1fr]" 
          : "md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]"
      )}
    >
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex flex-col overflow-hidden">
        <Header />
        {children}
      </div>
    </div>
  );
}
