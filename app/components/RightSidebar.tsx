
"use client";
import {
  User,

  LogOut,
  Sun,
  Moon,
  MessageSquare,
  Users,
  Plus,

} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";



import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUnreadCount } from "../store/notificationSlice";
import { toggleTheme } from "../store/themeSlice";

export default function RightSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => state.theme.mode);
  const unreadCount = useAppSelector(selectUnreadCount);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <aside className="w-[8.33%] min-w-[60px] h-full bg-surface-elevated border-l border-border flex flex-col items-center py-6 gap-6">
      {/* ===== آواتار کاربر ===== */}
      <Link href="/profile" className="flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
          {session?.user?.name?.[0] || "?"}
        </div>
        <span className="text-[10px] text-text-secondary font-medium hidden xl:block truncate max-w-[80px]">
          {session?.user?.name ?? "unknown"}
        </span>
      </Link>

      <div className="w-8 h-px bg-border" />

      {/* ===== ناوبری ===== */}
      <nav className="flex flex-col items-center gap-5">
        <Link
          href="/profile"
          className={`w-10 h-10 rounded-full flex items-center justify-center group relative transition-all duration-200 ${
            isActive("/profile")
              ? "bg-primary text-white"
              : "bg-surface-elevated hover:bg-primary/10 hover:text-primary text-text-secondary"
          }`}
        >
          <User size={20} className="transition-colors" />
          <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Profile
          </span>
        </Link>

        <Link
          href="/notifications"
          className={`w-10 h-10 rounded-full flex items-center justify-center group relative transition-all duration-200 ${
            isActive("/notifications")
              ? "bg-primary text-white"
              : "bg-surface-elevated hover:bg-primary/10 hover:text-primary text-text-secondary"
          }`}
        >
          <MessageSquare size={20} className="transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center border-2 border-surface-elevated">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Notifications
          </span>
        </Link>

        <Link
          href="/users"
          className={`w-10 h-10 rounded-full flex items-center justify-center group relative transition-all duration-200 ${
            isActive("/users")
              ? "bg-primary text-white"
              : "bg-surface-elevated hover:bg-primary/10 hover:text-primary text-text-secondary"
          }`}
        >
          <Users size={20} className="transition-colors" />
          <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Users
          </span>
        </Link>

        <Link
          href="/chat"
          className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group relative"
        >
          <Plus size={20} className="text-white" />
          <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            New Chat
          </span>
        </Link>
      </nav>

      <div className="w-8 h-px bg-border" />

      {/* ===== پایین ===== */}
      <div className="flex flex-col items-center gap-5 mt-auto">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative text-text-secondary"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>



        <button
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 flex items-center justify-center group relative text-text-secondary"
        >
          <LogOut size={20} className="transition-colors" />
          <span className="absolute -left-14 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}