"use client";
import { useSidebar } from "@/contexts/SidebarContext";

export default function ContentWrapper({ children }) {
  const { expanded } = useSidebar();

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        expanded ? "lg:ml-[256px]" : "lg:ml-[80px]"
      }`}
    >
      {children}
    </div>
  );
}
