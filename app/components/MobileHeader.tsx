"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  MessageSquare,
  Users,
  Sun,
  Moon,
  LogOut,
  Bell,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/themeSlice";
import {
  fetchConversations,
  selectAllConversations,
} from "../store/conversationSlice";
import { fetchAllUsers, selectAllUsers } from "../store/usersSlice";

export default function MobileHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const theme = useAppSelector((state) => state.theme.mode);
  const conversations = useAppSelector(selectAllConversations);
  const users = useAppSelector(selectAllUsers);

  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const navItems = [
    {
      icon: MessageSquare,
      label: "My Chats",
      href: "/chat",
      badge: unreadTotal > 0 ? unreadTotal : undefined,
    },
    {
      icon: Users,
      label: "People",
      href: "/users",
    },
    {
      icon: theme === "dark" ? Sun : Moon,
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      onClick: () => dispatch(toggleTheme()),
    },
  ];

  return (
    <>
      {/* ═══ HEADER موبایل ═══ */}
      <header className="w-full h-16 flex items-center justify-between px-4 md:hidden bg-background/80 backdrop-blur-sm border-b border-border fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <Image src="/diagram.svg" alt="logo" width={32} height={32} priority />
          <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Talk to me
          </h1>
        </div>

        <Link
          href="/notifications"
          className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center relative"
        >
          <Bell size={20} />
          {unreadTotal > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          )}
        </Link>
      </header>

      {/* ═══ DRAWER ═══ */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-elevated border-r border-border shadow-2xl z-[70] transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Image src="/diagram.svg" alt="logo" width={28} height={28} />
            <span className="font-bold text-text-primary">Menu</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {session?.user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isLink = !!item.href;

            const content = (
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 text-text-primary transition-colors">
                <Icon size={20} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
            );

            return isLink ? (
              <Link
                key={i}
                href={item.href!}
                onClick={() => setIsOpen(false)}
              >
                {content}
              </Link>
            ) : (
              <button key={i} onClick={item.onClick} className="w-full text-left">
                {content}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-2 h-px bg-border" />

          {/* Logout */}
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 text-text-primary transition-colors text-left"
          >
            <LogOut size={20} className="text-red-500 flex-shrink-0" />
            <span className="text-sm font-medium text-red-500">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}