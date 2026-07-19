"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Award,
  Users,
  MessageCircle,
  LogOut,
  Target,
  User,
  Video,
  X,
  Activity,
  Map,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  isMobile,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();


  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Practice",
      href: "/practice",
      color: "text-green-600",
    },
    {
      icon: ClipboardList,
      label: "Mock Test",
      href: "/mock-test",
      color: "text-purple-600",
    },
    {
      icon: Target,
      label: "Subjects",
      href: "/subjects",
      color: "text-orange-600",
    },
    {
      icon: Award,
      label: "Results",
      href: "/results",
      color: "text-yellow-600",
    },
    {
      icon: Activity,
      label: "Personalized Weakness Detection",
      href: "/weakness",
      color: "text-rose-600",
    },
    {
      icon: Map,
      label: "Roadmap Generator",
      href: "/roadmap",
      color: "text-cyan-600",
    },
    {
      icon: Users,
      label: "Leaderboard",
      href: "/leaderboard",
      color: "text-indigo-600",
    },
    {
      icon: MessageCircle,
      label: "AI Assistant",
      href: "/ai-assistant",
      color: "text-pink-600",
    },
    {
      icon: Video,
      label: "Video Transcript",
      href: "/video-transcript",
      color: "text-teal-600",
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      color: "text-indigo-600",
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center space-x-3">
              <Image src="/Logo.png" alt="PPSC" width={36} height={36} />
              <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                PPSC
              </h1>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="absolute top-5 right-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-green-100 hover:to-green-50 dark:hover:from-green-900/20 dark:hover:to-green-800/20"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive(item.href) ? "" : item.color
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
             <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 w-full justify-center rounded-lg text-red-600 bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-[1.12rem] text-center border-b border-gray-200 dark:border-gray-700">
            {isCollapsed ? (
              <div className="flex items-center justify-center">
                   <Image src="/Logo.png" alt="PPSC" width={44} height={8} />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Image src="/Logo.png" alt="PPSC" width={44} height={8} />
                <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  PPSC
                </h1>
              </div>
            )}
          </div>

          <nav className="p-2 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : ""}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-linear-to-r hover:from-green-100 hover:to-green-50 dark:hover:from-green-900/20 dark:hover:to-green-800/20 hover:border-r-4 hover:border-primary dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive(item.href) ? "" : item.color
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* bottom logout area */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed ? (
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 w-full justify-center rounded-lg text-red-600 bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={logout}
                  title="Logout"
                  aria-label="Logout"
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
