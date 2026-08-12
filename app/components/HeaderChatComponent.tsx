"use client";
import { Bell, Files, Globe, House, Menu, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderChatComponent() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", icon: House, label: "Home" },
        { href: "/chat", icon: Users, label: "Chat" },
        { href: "/files", icon: Files, label: "Files" },
        { href: "/attachments", icon: Globe, label: "Attachements" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <>
            {/* ===== HEADER موبایل (fixed) ===== */}
            <header className="w-full h-16 flex items-center justify-between px-4 md:hidden bg-background/80 backdrop-blur-sm border-b border-border fixed top-0 left-0 z-50">
                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center">
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-2">
                    <Image src="/diagram.svg" alt="logo" width={32} height={32} priority />
                    <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        MyWorkspace
                    </h1>
                </div>

                <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>
            </header>

            {/* ===== SIDEBAR دسکتاپ (fixed) ===== */}
            <aside className="hidden md:flex md:flex-col w-3/12 h-screen bg-surface-elevated border-r border-border shadow-xl fixed top-0 left-0 z-50">
                {/* لوگو */}
                <div className="flex flex-col items-center justify-center py-8 border-b border-border">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Image src="/diagram.svg" alt="logo" width={48} height={48} priority />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-3">
                        MyWorkspace
                    </h1>
                    <p className="text-xs text-text-secondary">AI Platform</p>
                </div>

                {/* منو */}
                <nav className="flex-1 py-8 px-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const isActive = pathname === href;
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                                                : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                                        }`}
                                    >
                                        <Icon size={22} className={isActive ? 'scale-110' : ''} />
                                        <span className="text-sm font-medium">{label}</span>
                                        {isActive && (
                                            <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50"></span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* پروفایل */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">John Doe</p>
                            <p className="text-xs text-text-secondary">john@example.com</p>
                        </div>
                        <Bell size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                </div>
            </aside>
        </>
    );
}