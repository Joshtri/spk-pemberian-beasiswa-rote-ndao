"use client";
import { useSidebar } from "@/contexts/SidebarContext";

export default function ContentLayout({ children }) {
  const { expanded } = useSidebar();

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        expanded ? "lg:ml-[256px]" : "lg:ml-[80px]"
      }`}
    >
      <main className="p-4 sm:p-6 flex-1">{children}</main>
    </div>
  );
}