// app/chat/components/RightSidebar.tsx
"use client";
import { 
    User, 
    Settings, 
    LogOut, 
    Sun, 
    Moon, 

    MessageSquare,
    Users,
    Plus,
    MoreVertical
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function RightSidebar() {
    const [isDark, setIsDark] = useState(false);
    const {data : session } = useSession();
    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };
        const router = useRouter();
    return (
        <aside className="w-[8.33%] min-w-[60px] h-full bg-surface-elevated border-l border-border flex flex-col items-center py-6 gap-6">
            {/* ===== آواتار کاربر ===== */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
                    {session?.user?.name && session.user.name[0] }
                </div>
                <span className="text-[10px] text-text-secondary font-medium hidden xl:block">
                    {
                        session?.user?.name ?? "unknown"
                    }
                </span>
            </div>

            {/* ===== خط جداکننده ===== */}
            <div className="w-8 h-px bg-border"></div>

            {/* ===== آیکون‌های عمودی ===== */}
            <nav className="flex flex-col items-center gap-5">
                {/* دکمه پروفایل */}
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative">
                    <User size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Profile
                    </span>
                </button>

                {/* دکمه پیام‌ها */}
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative">
                    <MessageSquare size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Messages
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-elevated"></span>
                </button>

                {/* دکمه کاربران */}
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative">
                    <Users size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Users
                    </span>
                </button>

                {/* دکمه افزودن */}
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group relative">
                    <Plus size={20} className="text-white" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        New Chat
                    </span>
                </button>
            </nav>

            {/* ===== خط جداکننده ===== */}
            <div className="w-8 h-px bg-border"></div>

            {/* ===== آیکون‌های پایینی ===== */}
            <div className="flex flex-col items-center gap-5 mt-auto">
                {/* دکمه تم */}
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative"
                >
                    {isDark ? (
                        <Sun size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    ) : (
                        <Moon size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    )}
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {isDark ? 'Light' : 'Dark'}
                    </span>
                </button>

                {/* دکمه تنظیمات */}
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative">
                    <Settings size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Settings
                    </span>
                </button>

                {/* دکمه خروج */}
                <button 
                onClick={() => {
                    signOut();
                        router.push("/")
                }}
                 className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 flex items-center justify-center group relative">
                    <LogOut size={20} className="text-text-secondary group-hover:text-red-500 transition-colors" />
                    <span className="absolute -left-14 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Logout
                    </span>
                </button>

                {/* دکمه سه نقطه (بیشتر) */}
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center group relative">
                    <MoreVertical size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="absolute -left-14 bg-primary text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        More
                    </span>
                </button>
            </div>
        </aside>
    );
}